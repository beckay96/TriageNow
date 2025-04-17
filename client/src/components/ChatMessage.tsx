import { FC } from 'react';
import { ChatMessage as ChatMessageType } from '@/store';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  if (message.sender === 'ai') {
    return (
      <div className="flex mb-4">
        <div className="flex-shrink-0 mr-3">
          <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center">
            <span className="material-icons text-sm">smart_toy</span>
          </div>
        </div>
        <div className="bg-neutral-100 rounded-lg p-3 max-w-3xl">
          <p className="text-neutral-700">{message.message}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex mb-4 justify-end">
        <div className="bg-primary-light/10 rounded-lg p-3 max-w-3xl">
          <p className="text-neutral-700">{message.message}</p>
        </div>
        <div className="flex-shrink-0 ml-3">
          <div className="bg-neutral-200 w-8 h-8 rounded-full flex items-center justify-center">
            <span className="material-icons text-neutral-500 text-sm">person</span>
          </div>
        </div>
      </div>
    );
  }
};

export default ChatMessage;
