import { Conversation } from './conversation'

export interface AssistantMessage {
  id: string
  role: 'ASSISTANT',
  content: string
}

export interface UserMessage {
  id: string
  role: 'USER',
  content: string
}

export type MessageListItem = AssistantMessage | UserMessage

export interface MessageCallbacks {
  onMessageChange?: (message: MessageListItem[]) => void
}

export class Message {
  private list: MessageListItem[] = []

  constructor(private readonly conversation: Conversation, private readonly options: MessageCallbacks) {
  }

  private notifyChange() {
    this.options.onMessageChange?.(this.list)
  }

  async send(content: string) {
    // TODO 发送消息
  }

  addMessage(message: MessageListItem) {
    this.list.push(message)
    this.notifyChange()
  }

  removeMessage(id: string) {
    this.list = this.list.filter(msg => msg.id !== id)
    this.notifyChange()
  }

  updateMessage(id: string, content: string) {
    const messageIndex = this.list.findIndex(msg => msg.id === id)
    if (messageIndex !== -1) {
      this.list[messageIndex] = { ...this.list[messageIndex], content }
      this.notifyChange()
    }
  }

  getMessages(): MessageListItem[] {
    return [...this.list]
  }

  clearMessages() {
    this.list = []
    this.notifyChange()
  }
}