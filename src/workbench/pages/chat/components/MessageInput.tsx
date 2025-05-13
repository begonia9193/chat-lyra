import { memo, useRef } from 'react';
import cn from 'classnames';
import TextAreaAutoSize, { TextareaAutosizeProps } from 'react-textarea-autosize';
import { Icon } from '@/components/Icon';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  generating: boolean;
  onStopGenerate?: () => void;
}

export const MessageInput = memo<MessageInputProps>((props) => {
  const { value, onChange, onSubmit, generating, onStopGenerate } = props;

  const compositing = useRef(false);
  const handleKeyDown: TextareaAutosizeProps['onKeyDown'] = event => {
    if (generating) {
      return;
    }
    if (event.code === 'Enter') {
      event.preventDefault();
      // 防止用户自定义组合键换行冲突
      if (
        compositing.current ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }
      // 追加回车
      if (event.shiftKey) {
        const { value, selectionStart, selectionEnd } =
          event.target as HTMLTextAreaElement;
        const newValue = `${value.slice(0, selectionStart)}\n${value.slice(
          selectionEnd,
        )}`;
        onChange(newValue);
        return;
      }
      onSubmit();
    }
  };

  const handleComposition: React.CompositionEventHandler<
    HTMLTextAreaElement
  > = event => {
    // 输入中文时，敲下回车，不触发发送
    if (event.type === 'compositionstart') {
      compositing.current = true;
      return;
    }
    if (event.type === 'compositionend') {
      compositing.current = false;
    }
  };

  return (
    <div
      className="relative group w-full"
    >
      <div className='flex items-center  gap-[12px] relative'>
        <div
          className={cn(
            'relative p-[2px] chat-input-container box-border flex justify-between flex-1 bg-white rounded-[12px] overflow-hidden',
            'items-center',
            'border-[#E1E1E5] border border-solid border-opacity-60 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.06)]',
          )}
        >
          <div
            className="chat-input-background"
          ></div>

          <div
            className={cn(
              'chat-input-wrapper  flex-col relative  z-[2] min-h-[50px]  w-full flex justify-between  bg-white rounded-[10px] box-border',
              'px-[12px] py-[9px] pl-[16px]'
            )}
          >
            <div className='flex-1 flex'>
              <div className='flex-1 flex overflow-hidden flex-col justify-center'>
                <TextAreaAutoSize
                  autoFocus
                  wrap='soft'
                  onKeyDown={handleKeyDown}
                  className='block min-h-[24px] w-full h-full p-[0] placeholder:align-middle resize-none border-0 bg-white text-[14px]/[24px] outline-0 placeholder:text-[#8d8d99] placeholder:leading-[24px] text-[#17171d] focus-visible:outline-none disabled:placeholder:text-[#8d8d99]-40'
                  value={value}
                  placeholder="请输入...."
                  minRows={1}
                  maxRows={6}
                  onChange={event => {
                    const content = event.target.value;
                    onChange(content);
                  }}
                  onCompositionStart={handleComposition}
                  onCompositionEnd={handleComposition}
                />
              </div>

              <div
                className="flex gap-[12px] ml-[12px] items-center"
              >
                <div className='w-[32px] h-[32px] rounded-full  flex-center overflow-hidden'>
                  {!generating && (
                    <SendButton
                      disabled={generating}
                      onClick={onSubmit}
                    />
                  )}
                  {generating && (
                    <Icon
                      icon='i-icons-stop'
                      className='cursor-pointer'
                      onClick={() => onStopGenerate?.()}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export interface SendButtonProps {
  size?: 'normal' | 'large';
  disabled?: boolean;
  onClick?: () => void;
}

export function SendButton(props: SendButtonProps) {
  const { size = 'normal', disabled = false, onClick } = props;
  return (
    <div
      className={cn(
        'chat-bg-linear flex items-center justify-center cursor-pointer text-white hover:opacity-80',
        {
          'btn-icon-only': size === 'normal',
          '!opacity-40 hover:!opacity-40 !cursor-not-allowed':
            disabled,
        },
      )}
      onClick={() => !disabled && onClick?.()}
    >
      <Icon
        icon='i-icons-send'
        className='text-[20px] w-16px h-16px'
      />
    </div>
  );
}