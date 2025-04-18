import React from 'react';

const ChatTypingIndicator: React.FC = () => {
  return (
    <div className="flex mb-4">
      <div className="flex-shrink-0 mr-3">
        <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center">
          <span className="material-icons text-sm">smart_toy</span>
        </div>
      </div>
      <div className="bg-neutral-100 rounded-lg p-3 max-w-3xl">
        <div className="flex items-center">
          <span className="text-neutral-700 mr-2">AI is analyzing symptoms</span>
          <div className="flex space-x-1">
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTypingIndicator;