import { FC, useRef, useState, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '@/store';
import ChatMessage from '@/components/ChatMessage';
import ChatTypingIndicator from '@/components/ChatTypingIndicator';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '@/store';

interface ChatPopupProps {
  patientOption?: string | null;
  showQuestionnaire?: () => void;
}

const ChatPopup: FC<ChatPopupProps> = ({ patientOption, showQuestionnaire }) => {
  const [isChatOpen, setIsChatOpen] = useState(true); // Start with chat open as requested
  const [userMessage, setUserMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    chatMessages, 
    addChatMessage,
    processingUserInput
  } = useStore();

  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    if (chatEndRef.current && isChatOpen) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  // Initial AI greeting based on patient option when the component mounts
  useEffect(() => {
    if (chatMessages.length === 0 && patientOption) {
      let greeting = "Hello! I'm your virtual health assistant. I can help assess your symptoms and provide general health guidance.";
      let followUp = "";
      
      switch (patientOption) {
        case 'need-hospital':
          followUp = " Let's discuss your symptoms to help determine what level of care would be appropriate for your situation. Can you tell me what you're experiencing?";
          break;
        case 'check-health':
          followUp = " I can help you understand your symptoms better. What health concerns bring you here today?";
          break;
        case 'ambulance':
          followUp = " While you wait for medical assistance, I can help gather information that may be helpful for healthcare providers. What symptoms are you experiencing?";
          break;
        case 'at-er':
          followUp = " I can help organize information about your symptoms that you can share with medical staff. What symptoms brought you to seek care today?";
          break;
      }
      
      addChatMessage(greeting + followUp, 'ai');
      
      // Show questionnaire automatically after a short delay
      if (showQuestionnaire) {
        setTimeout(() => {
          showQuestionnaire();
        }, 1000);
      }
    }
  }, [addChatMessage, chatMessages.length, patientOption, showQuestionnaire]);

  const handleSendMessage = () => {
    if (userMessage.trim()) {
      addChatMessage(userMessage, 'user');
      setUserMessage('');
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userMessage.trim()) {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end justify-end">
          <AnimatePresence>
            {isChatOpen && (
              <motion.div 
                className="bg-white dark:bg-zinc-900 dark:border dark:border-zinc-800 rounded-lg shadow-lg flex flex-col mb-2 w-80 md:w-96 max-h-[80vh] overflow-hidden"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header - always visible */}
                <div className="bg-primary dark:bg-gradient-to-r dark:from-blue-800 dark:to-zinc-800 p-3 flex justify-between items-center flex-shrink-0">
                  <h3 className="text-white font-semibold flex items-center">
                    <span className="material-icons mr-2 transition-transform duration-300 hover:scale-110 hover:rotate-12">smart_toy</span>
                    Health Assistant
                  </h3>
                  <button 
                    onClick={toggleChat}
                    className="text-white hover:bg-white/10 rounded-full p-1 transition-colors duration-200"
                  >
                    <span className="material-icons text-sm">remove</span>
                  </button>
                </div>

                {/* Messages area - scrollable */}
                <div className="flex-grow overflow-y-auto p-3">
                  {chatMessages.map(message => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {processingUserInput && <ChatTypingIndicator />}
                  <div ref={chatEndRef} />
                </div>

                {/* Input area - always visible */}
                <div className="p-3 border-t dark:border-zinc-800 flex-shrink-0">
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Type your symptoms or questions here..." 
                      className="flex-1 border border-neutral-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-green-400 focus:border-transparent"
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      onKeyUp={handleKeyUp}
                    />
                    <button 
                      className="bg-primary dark:bg-blue-700 text-white px-3 rounded-r-md hover:bg-primary-dark dark:hover:bg-blue-600 transition-colors"
                      onClick={handleSendMessage}
                    >
                      <span className="material-icons text-sm">send</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      
      {/* Chat Icon Button */}
      <button 
        onClick={toggleChat}
        className={`
          bg-gradient-to-br from-blue-400/70 via-green-400/70 to-purple-400/70 dark:bg-blue-700 text-white p-2 rounded-full shadow-xl border border-blue-500 dark:border-blue-400 flex items-center justify-center m-3
          hover:shadow-xl transition-all duration-300 transform hover:scale-150
          group relative
          ${isChatOpen ? 'rotate-0' : 'hover-lift'}
        `}
        aria-label="Toggle chat assistant"
      >
        <span className="material-icons text-black">
          {isChatOpen ? 'chat' : 'smart_toy'}
        </span>
        {!isChatOpen && chatMessages.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {chatMessages.filter(msg => msg.sender === 'ai').length || ''}
          </span>
        )}
        <span className="absolute inset-0 rounded-full bg-primary dark:bg-blue-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
      </button>
    </div>
  );
};

export default ChatPopup;