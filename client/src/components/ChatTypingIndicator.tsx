import { FC } from 'react';

const ChatTypingIndicator: FC = () => {
  return (
    <div className="flex mb-4">
      <div className="flex-shrink-0 mr-3">
        <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center">
          <span className="material-icons text-sm">smart_toy</span>
        </div>
      </div>
      <div className="bg-neutral-100 rounded-lg p-4 max-w-3xl flex items-center">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <span className="ml-2 text-neutral-500 text-sm">AI Assistant is typing...</span>
      </div>
    </div>
  );
};

export default ChatTypingIndicator;