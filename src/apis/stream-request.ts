// Stream SSE 请求配置接口
export interface StreamRequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number; // 超时时间，毫秒
}

// 各阶段回调接口
export interface StreamRequestCallbacks {
  onStart?: () => void; // 请求开始
  onConnect?: () => void; // 连接建立
  onMessage?: (data: string, rawEvent?: MessageEvent) => void; // 接收到数据
  onProgress?: (chunk: string) => void; // 数据块进度
  onComplete?: (fullData: string) => void; // 请求完成
  onError?: (error: StreamRequestError) => void; // 错误处理
  onAbort?: () => void; // 请求取消
  onClose?: () => void; // 连接关闭
}

// 自定义错误类型
export class StreamRequestError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly response?: Response;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode?: number,
    response?: Response
  ) {
    super(message);
    this.name = 'StreamRequestError';
    this.code = code;
    this.statusCode = statusCode;
    this.response = response;
  }
}

// 请求状态枚举
export enum StreamRequestStatus {
  CONNECTED = 'connected',  // 连接成功
  STREAMING = 'streaming',  // 请求中
  ERROR = 'error',         // 错误
  COMPLETED = 'completed'  // 结束
}

// Stream SSE 请求类
export class StreamRequest {
  private abortController: AbortController | null = null;
  private eventSource: EventSource | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private status: StreamRequestStatus = StreamRequestStatus.CONNECTED;
  private config: StreamRequestConfig;
  private callbacks: StreamRequestCallbacks;
  private accumulatedData: string = '';
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(config: StreamRequestConfig, callbacks: StreamRequestCallbacks = {}) {
    this.config = config;
    this.callbacks = callbacks;
  }

  // 获取当前状态
  public getStatus(): StreamRequestStatus {
    return this.status;
  }

  // 获取累积的数据
  public getAccumulatedData(): string {
    return this.accumulatedData;
  }

  // 开始请求
  public async start(): Promise<void> {
    try {
      this.setStatus(StreamRequestStatus.CONNECTED);
      this.callbacks.onStart?.();

      // 创建 AbortController 用于取消请求
      this.abortController = new AbortController();

      // 设置超时
      if (this.config.timeout) {
        this.timeoutId = setTimeout(() => {
          this.abort('TIMEOUT');
        }, this.config.timeout);
      }

      // 根据不同情况选择不同的请求方式
      if (this.config.method === 'GET' && !this.config.body) {
        await this.startEventSource();
      } else {
        await this.startFetchStream();
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  // 使用 EventSource 进行 GET 请求
  private async startEventSource(): Promise<void> {
    const url = new URL(this.config.url);
    
    // 添加 headers 作为查询参数（如果需要的话）
    if (this.config.headers) {
      Object.entries(this.config.headers).forEach(([key, value]) => {
        if (key.toLowerCase() !== 'authorization') {
          url.searchParams.append(key, value);
        }
      });
    }

    this.eventSource = new EventSource(url.toString());

    this.eventSource.onopen = () => {
      this.setStatus(StreamRequestStatus.STREAMING);
      this.callbacks.onConnect?.();
    };

    this.eventSource.onmessage = (event) => {
      this.handleMessage(event.data, event);
    };

    this.eventSource.onerror = () => {
      this.handleError(new StreamRequestError('EventSource 连接错误', 'EVENTSOURCE_ERROR'));
    };

    // 监听取消信号
    this.abortController!.signal.addEventListener('abort', () => {
      this.eventSource?.close();
    });
  }

  // 使用 fetch 进行流式请求
  private async startFetchStream(): Promise<void> {
    const requestInit: RequestInit = {
      method: this.config.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        ...this.config.headers,
      },
      signal: this.abortController!.signal,
    };

    if (this.config.body) {
      requestInit.body = typeof this.config.body === 'string' 
        ? this.config.body 
        : JSON.stringify(this.config.body);
    }

    const response = await fetch(this.config.url, requestInit);

    if (!response.ok) {
      throw new StreamRequestError(
        `HTTP ${response.status}: ${response.statusText}`,
        'HTTP_ERROR',
        response.status,
        response
      );
    }

    if (!response.body) {
      throw new StreamRequestError('响应体为空', 'EMPTY_RESPONSE_BODY');
    }

    this.setStatus(StreamRequestStatus.STREAMING);
    this.callbacks.onConnect?.();

    // 开始读取流
    this.reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await this.reader.read();

        if (done) {
          this.complete();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        this.processChunk(chunk);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        this.setStatus(StreamRequestStatus.COMPLETED);
        this.callbacks.onAbort?.();
      } else {
        this.handleError(error);
      }
    }
  }

  // 处理数据块
  private processChunk(chunk: string): void {
    this.setStatus(StreamRequestStatus.STREAMING);

    // 处理 SSE 格式的数据
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6); // 移除 'data: ' 前缀
        
        if (data === '[DONE]') {
          this.complete();
          return;
        }

        if (data.trim()) {
          this.handleMessage(data);
        }
      }
    }

    this.callbacks.onProgress?.(chunk);
  }

  // 处理消息
  private handleMessage(data: string, rawEvent?: MessageEvent): void {
    this.accumulatedData += data;
    this.callbacks.onMessage?.(data, rawEvent);
  }

  // 完成请求
  private complete(): void {
    this.cleanup();
    this.setStatus(StreamRequestStatus.COMPLETED);
    this.callbacks.onComplete?.(this.accumulatedData);
  }

  // 取消请求
  public abort(reason: string = 'USER_ABORT'): void {
    if (this.abortController && !this.abortController.signal.aborted) {
      this.abortController.abort(reason);
    }

    this.cleanup();
    this.setStatus(StreamRequestStatus.COMPLETED);
    this.callbacks.onAbort?.();
  }

  // 错误处理
  private handleError(error: unknown): void {
    this.cleanup();
    this.setStatus(StreamRequestStatus.ERROR);

    let streamError: StreamRequestError;

    if (error instanceof StreamRequestError) {
      streamError = error;
    } else if (error instanceof Error) {
      if (error.name === 'AbortError') {
        streamError = new StreamRequestError('请求被取消', 'ABORTED');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        streamError = new StreamRequestError('网络连接错误', 'NETWORK_ERROR');
      } else {
        streamError = new StreamRequestError(
          error.message || '未知错误',
          'UNKNOWN_ERROR'
        );
      }
    } else {
      streamError = new StreamRequestError(
        typeof error === 'string' ? error : '未知错误',
        'UNKNOWN_ERROR'
      );
    }

    this.callbacks.onError?.(streamError);
  }

  // 设置状态
  private setStatus(status: StreamRequestStatus): void {
    this.status = status;
  }

  // 清理资源
  private cleanup(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    if (this.reader) {
      this.reader.cancel();
      this.reader = null;
    }

    this.callbacks.onClose?.();
  }

  // 销毁实例
  public destroy(): void {
    this.abort();
    this.cleanup();
  }
}

// 便捷的工厂函数
export function createStreamRequest(
  config: StreamRequestConfig,
  callbacks: StreamRequestCallbacks = {}
): StreamRequest {
  return new StreamRequest(config, callbacks);
}

// 简化的流式请求函数
export async function streamRequest(
  config: StreamRequestConfig,
  callbacks: StreamRequestCallbacks = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = new StreamRequest(config, {
      ...callbacks,
      onComplete: (data) => {
        callbacks.onComplete?.(data);
        resolve(data);
      },
      onError: (error) => {
        callbacks.onError?.(error);
        reject(error);
      },
    });

    request.start().catch(reject);
  });
}

// 导出默认实例创建函数
export { StreamRequest as default };