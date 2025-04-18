import { FC } from 'react';
import { ChatMessage as ChatMessageType } from '@/store';
import useStore from '@/store';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  const { aiConfidence } = useStore();
  
  if (message.sender === 'ai') {
    return (
      <div className="flex mb-4">
        <div className="flex-shrink-0 mr-3">
          <div className="border border-purple-600 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center">
            <span className="material-icons text-sm">smart_toy</span>
          </div>
        </div>
        <div className="bg-neutral-100 dark:bg-black rounded-lg p-3 max-w-3xl border border-blue-500">
          <p className="text-neutral-700 dark:text-white">{message.message}</p>
          
          {/* AI confidence indicator */}
          <div className="mt-2 flex items-center">
            <div className="w-full max-w-[120px] h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${aiConfidence > 80 ? 'bg-green-500' : aiConfidence > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${aiConfidence}%` }}
              ></div>
            </div>
            <span className="ml-2 text-xs dark:text-white/70 text-neutral-500">
              {aiConfidence > 80 ? 'High confidence' : 
               aiConfidence > 60 ? 'Moderate confidence' : 
               'Low confidence'} ({aiConfidence}%)
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex mb-4 justify-end">
        <div className="bg-white dark:bg-zinc-800 border border-blue-500 rounded-lg p-2 max-w-3xl">
          <p className="text-blue-800 dark:text-blue-300">{message.message}</p>
        </div>
        <div className="flex-shrink-0 ml-3">
          <div className="border border-blue-600 bg-neutral-200 w-8 h-8 rounded-full flex items-center justify-center">
            <span className="material-icons text-neutral-500 text-sm">person</span>
          </div>
        </div>
      </div>
    );
  }
};

export default ChatMessage;
