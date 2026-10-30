import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext, AppContextType } from '../context/AppContext';
import { ChatMessage } from '../types';
import { getAIResponse } from '../services/geminiService';
import { moderateContent, ModerationResult } from '../services/contentModeration';
import {
    PaperAirplaneIcon,
    SpeakerWaveIcon,
    SparklesIcon,
    LinkIcon,
    ShieldCheckIcon,
    TrashIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from './icons/Icons';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
    collection,
    doc,
    setDoc,
    deleteDoc,
    onSnapshot,
    query,
    getDocs
} from 'firebase/firestore';

const ChatWindow: React.FC = () => {
    const { user, language, translations } = useContext(AppContext) as AppContextType;
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [moderationWarning, setModerationWarning] = useState<ModerationResult | null>(null);
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Real-time listener strictly bound to current authenticated user's private collection
    useEffect(() => {
        if (!user?.uid) {
            setMessages([]);
            return;
        }

        const chatPath = `users/${user.uid}/chatHistory`;
        const chatColRef = collection(db, 'users', user.uid, 'chatHistory');

        const unsubscribe = onSnapshot(
            chatColRef,
            (snapshot) => {
                const loaded: ChatMessage[] = [];
                snapshot.forEach((docSnap) => {
                    const data = docSnap.data();
                    loaded.push({
                        id: docSnap.id,
                        userId: data.userId || user.uid,
                        role: data.role || 'user',
                        text: data.text || '',
                        language: data.language,
                        createdAt: data.createdAt,
                        sources: data.sources,
                    });
                });

                // Sort by createdAt ascending
                loaded.sort((a, b) => {
                    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return timeA - timeB;
                });

                setMessages(loaded);
            },
            (error) => {
                console.warn('Notice listening to private chat history:', error);
                // Report according to Firestore error handling guidelines
                try {
                    handleFirestoreError(error, OperationType.GET, chatPath);
                } catch {
                    // Handled
                }
            }
        );

        return () => unsubscribe();
    }, [user?.uid]);

    useEffect(scrollToBottom, [messages]);

    // Real-time input moderation check
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInput(val);

        if (val.trim()) {
            const mod = moderateContent(val);
            if (!mod.isClean) {
                setModerationWarning(mod);
            } else {
                setModerationWarning(null);
            }
        } else {
            setModerationWarning(null);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading || !user?.uid) return;

        // Content moderation validation
        const moderation = moderateContent(input.trim());
        if (!moderation.isClean) {
            setModerationWarning(moderation);
            return;
        }

        const userMsgText = input.trim();
        const userMsgId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const chatPath = `users/${user.uid}/chatHistory`;

        const userMessagePayload: ChatMessage = {
            id: userMsgId,
            userId: user.uid,
            role: 'user',
            text: userMsgText,
            language: language,
            createdAt: new Date().toISOString(),
        };

        setInput('');
        setModerationWarning(null);
        setIsLoading(true);

        // Optimistically show or save directly to Firestore
        try {
            await setDoc(doc(db, 'users', user.uid, 'chatHistory', userMsgId), userMessagePayload);
        } catch (err) {
            console.error('Failed to save user message to Firestore:', err);
            handleFirestoreError(err, OperationType.CREATE, `${chatPath}/${userMsgId}`);
        }

        try {
            const response = await getAIResponse(userMsgText, language);
            const aiText = response.text?.trim() || "Thank you. Your inquiry has been processed.";
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

            const aiMsgId = `mod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
            const aiMessagePayload: ChatMessage = {
                id: aiMsgId,
                userId: user.uid,
                role: 'model',
                text: aiText,
                language: language,
                createdAt: new Date().toISOString(),
                ...(sources ? { sources } : {}),
            };

            await setDoc(doc(db, 'users', user.uid, 'chatHistory', aiMsgId), aiMessagePayload);
        } catch (error) {
            console.error('AI response error:', error);
            const errId = `mod_err_${Date.now()}`;
            const errorMessagePayload: ChatMessage = {
                id: errId,
                userId: user.uid,
                role: 'model',
                text: error instanceof Error ? error.message : "An error occurred while generating assistance. Please try again.",
                language: language,
                createdAt: new Date().toISOString(),
            };
            try {
                await setDoc(doc(db, 'users', user.uid, 'chatHistory', errId), errorMessagePayload);
            } catch (saveErr) {
                console.error('Failed to log error to Firestore:', saveErr);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearHistory = async () => {
        if (!user?.uid || messages.length === 0) return;
        if (!window.confirm("Are you sure you want to permanently clear your private conversation history? This cannot be undone.")) {
            return;
        }

        setIsClearing(true);
        const chatPath = `users/${user.uid}/chatHistory`;
        try {
            const chatColRef = collection(db, 'users', user.uid, 'chatHistory');
            const snap = await getDocs(chatColRef);
            const deletePromises = snap.docs.map(d => deleteDoc(d.ref));
            await Promise.all(deletePromises);
            setMessages([]);
            setActionFeedback("Chat history cleared securely.");
            setTimeout(() => setActionFeedback(null), 3000);
        } catch (err) {
            console.error('Failed to clear history:', err);
            handleFirestoreError(err, OperationType.DELETE, chatPath);
        } finally {
            setIsClearing(false);
        }
    };

    const handleSpeak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="flex flex-col h-[70vh]">
            {/* Header / Privacy Isolation Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b dark:border-gray-700 text-xs">
                <div className="flex items-center gap-2 text-text-secondary dark:text-gray-300">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 font-medium">
                        <ShieldCheckIcon className="w-3.5 h-3.5" />
                        Private User Session ({user?.provider || 'verified'})
                    </span>
                    <span className="hidden sm:inline text-gray-400">•</span>
                    <span className="hidden sm:inline font-mono truncate max-w-xs">{user?.email || user?.username}</span>
                </div>

                {messages.length > 0 && (
                    <button
                        onClick={handleClearHistory}
                        disabled={isClearing}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors disabled:opacity-50"
                        title="Delete private history"
                    >
                        <TrashIcon className="w-3.5 h-3.5" />
                        <span>{isClearing ? 'Clearing...' : translations.clearHistory || 'Clear History'}</span>
                    </button>
                )}
            </div>

            {actionFeedback && (
                <div className="mb-2 p-2 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>{actionFeedback}</span>
                </div>
            )}

            {/* Conversation Log Area */}
            <div className="flex-grow overflow-y-auto pr-3 -mr-1 mb-3 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center py-12 px-4 text-gray-500 dark:text-gray-400">
                        <div className="w-12 h-12 mx-auto mb-3 text-brand-primary dark:text-blue-400 bg-brand-light dark:bg-blue-950/50 rounded-full flex items-center justify-center">
                            <SparklesIcon className="w-6 h-6" />
                        </div>
                        <h4 className="font-semibold text-text-primary dark:text-white mb-1">Your Private Conversation</h4>
                        <p className="text-xs max-w-md mx-auto">
                            Ask questions regarding public services, infrastructure inquiries, or civic procedures. Your conversation is encrypted and only visible when logged into your account.
                        </p>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                    >
                        {msg.role === 'model' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white shadow-sm">
                                <SparklesIcon className="w-4 h-4" />
                            </div>
                        )}
                        <div
                            className={`max-w-lg p-4 rounded-2xl shadow-sm text-sm ${
                                msg.role === 'user'
                                    ? 'bg-brand-primary text-white rounded-br-none'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-600'
                            }`}
                        >
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                            {msg.role === 'model' && (
                                <>
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                        <button
                                            onClick={() => handleSpeak(msg.text)}
                                            className="text-gray-400 hover:text-brand-primary dark:hover:text-brand-light transition-colors p-1"
                                            title="Read aloud"
                                        >
                                            <SpeakerWaveIcon className="w-4 h-4" />
                                        </button>
                                        {msg.createdAt && (
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-3 pt-2 border-t dark:border-gray-600 text-xs">
                                            <h4 className="font-semibold mb-1 text-gray-600 dark:text-gray-300">Verified Sources:</h4>
                                            <ul className="space-y-1">
                                                {msg.sources.map((source, index) => (
                                                    <li key={index}>
                                                        <a
                                                            href={source.web?.uri || '#'}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline"
                                                        >
                                                            <LinkIcon className="w-3 h-3 flex-shrink-0" />
                                                            <span className="truncate">{source.web?.title || 'Official Source'}</span>
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
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white">
                            <SparklesIcon className="w-4 h-4 animate-pulse" />
                        </div>
                        <div className="max-w-lg p-4 rounded-2xl bg-gray-100 dark:bg-gray-700 rounded-bl-none">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                                <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse delay-75" />
                                <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse delay-150" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Moderation Warning Banner */}
            {moderationWarning && !moderationWarning.isClean && (
                <div className="mb-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs rounded-xl flex items-start gap-2 shadow-sm animate-shake">
                    <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                        <strong className="block font-bold">Content Filter Active: Inappropriate Language Detected</strong>
                        <span>{moderationWarning.reason}</span>
                    </div>
                </div>
            )}

            {/* Input Bar */}
            <div className="relative pt-2 border-t dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isLoading && (!moderationWarning || moderationWarning.isClean)) {
                                handleSend();
                            }
                        }}
                        placeholder={translations.typeYourQuestion}
                        className={`flex-grow p-3.5 pr-4 border rounded-xl dark:bg-gray-900 focus:outline-none transition-colors text-sm ${
                            moderationWarning && !moderationWarning.isClean
                                ? 'border-red-400 ring-2 ring-red-300 dark:ring-red-900 bg-red-50/20'
                                : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-brand-accent'
                        }`}
                        disabled={isLoading}
                        maxLength={2000}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim() || Boolean(moderationWarning && !moderationWarning.isClean)}
                        className="bg-brand-primary text-white p-3.5 rounded-xl shadow disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-brand-secondary transition-all duration-200 flex-shrink-0"
                        title="Send message"
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 px-1">
                    <span>🛡️ Filter: Insults, vulgarities, and adult words are prohibited.</span>
                    <span>{input.length}/2000</span>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;