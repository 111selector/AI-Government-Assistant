
import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext, AppContextType } from '../context/AppContext';
import { ChatMessage } from '../types';
import { getAIResponse } from '../services/geminiService';
import { PaperAirplaneIcon, SpeakerWaveIcon, SparklesIcon, LinkIcon } from './icons/Icons';

const ChatWindow: React.FC = () => {
    const { language, translations } = useContext(AppContext) as AppContextType;
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: input.trim(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await getAIResponse(userMessage.text, language);
            const modelMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: response.text.trim(),
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
            };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: error instanceof Error ? error.message : "An unknown error occurred.",
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSpeak = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language;
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-speech is not supported in your browser.');
        }
    };

    return (
        <div className="flex flex-col h-[65vh]">
            <div className="flex-grow overflow-y-auto pr-4 -mr-4 mb-4 space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white"><SparklesIcon className="w-5 h-5"/></div>}
                        <div className={`max-w-lg p-4 rounded-xl ${msg.role === 'user' ? 'bg-brand-accent text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 rounded-bl-none'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            {msg.role === 'model' && (
                                <>
                                    <button onClick={() => handleSpeak(msg.text)} className="mt-2 text-gray-500 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-light">
                                        <SpeakerWaveIcon className="w-5 h-5" />
                                    </button>
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-3 pt-3 border-t dark:border-gray-600">
                                            <h4 className="text-xs font-semibold mb-2">Sources:</h4>
                                            <ul className="space-y-1">
                                                {msg.sources.map((source, index) => (
                                                    <li key={index}>
                                                        <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                                                           <LinkIcon className="w-3 h-3 flex-shrink-0" /> 
                                                           <span className="truncate">{source.web.title}</span>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white"><SparklesIcon className="w-5 h-5 animate-pulse"/></div>
                        <div className="max-w-lg p-4 rounded-xl bg-gray-100 dark:bg-gray-700 rounded-bl-none">
                           <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75"></div>
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center gap-2 pt-4 border-t dark:border-gray-600">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder={translations.typeYourQuestion}
                    className="flex-grow p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent focus:outline-none"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="bg-brand-primary text-white p-3 rounded-lg shadow disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-brand-secondary transition-colors duration-300"
                >
                    <PaperAirplaneIcon className="w-6 h-6"/>
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
   