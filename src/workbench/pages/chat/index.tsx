import { memo } from 'react';
import { useParams } from 'react-router-dom';
import { MessageInput } from './components/MessageInput';

export const ChatPage = memo(() => {
  const { id } = useParams<{ id: string; }>();
  console.log("conversation id", id);

  return (
    <div className="w-full h-full of-hidden flex flex-col">
      <div className='h-30px shrink-0'>
      </div>
      <div className='flex-1 of-auto'>
        message list
      </div>
      <div>
        <MessageInput
          value={''}
          onChange={() => {}}
          onSubmit={() => {}}
          generating={false}
        />
      </div>
    </div>
  );
});