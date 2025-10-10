import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { UFOIcon, StarIcon } from './Icons';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setMessages([{
                id: 0,
                sender: 'bot',
                text: "Sparky reporting for duty! Ready to explore the content cosmos, Captain? 🚀 Ask me anything or use the quick actions below!",
                type: 'text',
            }]);
        }
    }, [isOpen]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        const newUserMessage: ChatMessage = { id: Date.now(), sender: 'user', text, type: 'text' };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsTyping(true);

        const chatHistory = [...messages, newUserMessage];

        try {
            const response = await getChatbotResponse(chatHistory);
            const newBotMessage: ChatMessage = { id: Date.now() + 1, sender: 'bot', text: response, type: 'text' };
            setMessages(prev => [...prev, newBotMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { id: Date.now() + 1, sender: 'bot', text: "Whoops! A solar flare must be interfering with my signal. Please try that again. ✨", type: 'error' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };
    
    const handleQuickAction = (text: string, action?: 'rate') => {
        const newUserMessage: ChatMessage = { id: Date.now(), sender: 'user', text, type: 'text' };
        setMessages(prev => [...prev, newUserMessage]);
        setIsTyping(true);
        
        if (action === 'rate') {
             const newBotMessage: ChatMessage = { id: Date.now() + 1, sender: 'bot', text: "Thank you for your feedback! How would you rate your experience with this app?", type: 'rating_request' };
             setMessages(prev => [...prev, newBotMessage]);
             setIsTyping(false);
        } else if (text === "Need help?") {
            const helpMessage: ChatMessage = { id: Date.now() + 1, sender: 'bot', text: "For cosmic-level support, please contact our human counterparts at support@visionarycoders.dev ✨", type: 'text' };
             setMessages(prev => [...prev, helpMessage]);
             setIsTyping(false);
        } else {
             handleSendMessage(text);
        }
    };
    
    const handleRating = (rating: number) => {
        const ratingMessage: ChatMessage = { id: Date.now(), sender: 'user', text: `Rated ${rating} out of 5 stars.`, type: 'rating_response'};
        const thankYouMessage: ChatMessage = { id: Date.now() + 1, sender: 'bot', text: "Thanks for the stellar feedback! Your input helps us explore new galaxies of improvement. 🪐", type: 'text'};
        setMessages(prev => [...prev.filter(m => m.type !== 'rating_request'), ratingMessage, thankYouMessage]);
    }

    const QuickActions = () => (
        <div className="flex flex-wrap gap-2 p-4 border-t border-gray-200 dark:border-gray-700/50">
            <button onClick={() => handleQuickAction("How does this work?")} className="px-3 py-1 text-xs bg-gray-100 text-text-muted-light rounded-full hover:bg-gray-200 transition-colors dark:bg-dark-bg dark:text-text-muted-dark dark:hover:bg-gray-700">How does this work?</button>
            <button onClick={() => handleQuickAction("Rate the app", "rate")} className="px-3 py-1 text-xs bg-gray-100 text-text-muted-light rounded-full hover:bg-gray-200 transition-colors dark:bg-dark-bg dark:text-text-muted-dark dark:hover:bg-gray-700">Rate the app</button>
            <button onClick={() => handleQuickAction("Need help?")} className="px-3 py-1 text-xs bg-gray-100 text-text-muted-light rounded-full hover:bg-gray-200 transition-colors dark:bg-dark-bg dark:text-text-muted-dark dark:hover:bg-gray-700">Need help?</button>
        </div>
    );
    
    const StarRating = ({ onRate }: { onRate: (rating: number) => void }) => (
        <div className="flex justify-center items-center gap-2 p-2">
            {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => onRate(star)} className="text-gray-300 hover:text-yellow-400 transition-colors">
                    <StarIcon className="w-8 h-8"/>
                </button>
            ))}
        </div>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-primary rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110 animate-float-bob z-20"
                aria-label="Open chatbot"
            >
                <UFOIcon className="w-10 h-10" />
            </button>
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-[350px] h-[500px] bg-surface-light border border-gray-200 rounded-xl shadow-2xl flex flex-col z-20 animate-slideInUp dark:bg-surface-dark dark:border-gray-700/50">
                    <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700/50">
                        <UFOIcon className="w-8 h-8 text-primary" />
                        <h3 className="ml-3 font-bold text-text-main-light dark:text-text-main-dark text-lg">Galactic Guide</h3>
                    </header>
                    <div className="flex-grow p-4 overflow-y-auto space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'bot' && <UFOIcon className="w-6 h-6 text-primary/70 flex-shrink-0 mb-1" />}
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 text-text-main-light dark:bg-dark-bg dark:text-text-main-dark rounded-bl-none'}`}>
                                    {msg.type === 'rating_request' ? (
                                        <>
                                            <p className="text-sm">{msg.text}</p>
                                            <StarRating onRate={handleRating} />
                                        </>
                                    ) : msg.type === 'rating_response' ? (
                                        <div className="flex items-center gap-1 text-sm italic text-yellow-500">
                                            {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < parseInt(msg.text.split(' ')[1]) ? 'text-yellow-400' : 'text-gray-300'}`} />)}
                                        </div>
                                    ) : (
                                        <p className="text-sm">{msg.text}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-end gap-2 justify-start">
                                <UFOIcon className="w-6 h-6 text-primary/70 flex-shrink-0 mb-1" />
                                <div className="bg-gray-100 text-text-main-light rounded-2xl rounded-bl-none px-4 py-2 dark:bg-dark-bg">
                                   <div className="flex items-center gap-1">
                                       <span className="w-2 h-2 bg-text-muted-light rounded-full animate-bounce dark:bg-text-muted-dark"></span>
                                       <span className="w-2 h-2 bg-text-muted-light rounded-full animate-bounce dark:bg-text-muted-dark" style={{animationDelay: '0.2s'}}></span>
                                       <span className="w-2 h-2 bg-text-muted-light rounded-full animate-bounce dark:bg-text-muted-dark" style={{animationDelay: '0.4s'}}></span>
                                   </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    {messages.length < 3 && <QuickActions />}
                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(userInput); }} className="p-4 border-t border-gray-200 dark:border-gray-700/50">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Message your guide..."
                            className="w-full bg-gray-100 border border-gray-300 rounded-full py-2 px-4 text-text-main-light placeholder-text-muted-light focus:ring-2 focus:ring-primary focus:border-primary transition duration-150 dark:bg-dark-bg dark:border-gray-600 dark:text-text-main-dark dark:placeholder-gray-500"
                        />
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;