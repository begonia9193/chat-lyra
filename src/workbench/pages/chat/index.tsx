import { memo } from 'react';
import { useParams } from 'react-router-dom';

export const ChatPage = memo(() => {
  const { id } = useParams<{ id: string; }>();

  return (
    <div className="w-full h-full p-16px">
      <div>对话 ID: {id}</div>
    </div>
  );
});