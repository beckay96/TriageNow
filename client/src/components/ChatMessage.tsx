import React from "react";

interface ChatMessageProps {
  text: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ text }) => {
  return (
    <div className="flex mb-4">
      <div className="bg-primary rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm font-bold">AI</span>
      </div>
      <div className="ml-3 bg-neutral-100 rounded-lg py-2 px-3 max-w-md">
        <p className="text-neutral-800">{text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
