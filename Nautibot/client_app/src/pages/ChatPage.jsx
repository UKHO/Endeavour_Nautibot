import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatMessage from '../components/Chat/ChatMessage';
import ChatInput from '../components/Chat/ChatInput';
import WelcomeScreen from '../components/Chat/WelcomeScreen';
import Sidebar from '../components/Sidebar/Sidebar';
import InteractiveBackground from '../components/UI/InteractiveBackground';
import { askQuestion } from '../utils/api';
import './ChatPage.css';

const SUGGESTED_PROMPTS = [
    'Show me the latest navigation charts',
    'What are the current safety protocols?',
    'Summarise the most recent fleet management report',
    'Find compliance guidance for inspections',
    'Explain the newest maritime regulations updates'
];

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [conversationMessages, setConversationMessages] = useState({});
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (messageText) => {
        const trimmedMessage = messageText?.trim();
        if (!trimmedMessage) return;

        const conversationId = currentConversationId ?? `conv-${Date.now()}`;
        const existingHistory = conversationMessages[conversationId] ?? (conversationId === currentConversationId ? messages : []);

        const userMessage = {
            id: `user-${Date.now()}`,
            text: trimmedMessage,
            isUser: true,
            timestamp: new Date(),
        };

        const nextHistory = [...existingHistory, userMessage];

        setCurrentConversationId(conversationId);
        setMessages(nextHistory);
        setConversationMessages(prev => ({
            ...prev,
            [conversationId]: nextHistory
        }));

        setConversations(prev => {
            const existingIndex = prev.findIndex(conv => conv.id === conversationId);
            const timestamp = new Date();
            if (existingIndex === -1) {
                const title = trimmedMessage.length > 60 ? `${trimmedMessage.slice(0, 60)}…` : trimmedMessage;
                const newConversation = {
                    id: conversationId,
                    title: title || 'New conversation',
                    preview: trimmedMessage,
                    timestamp
                };
                return [newConversation, ...prev];
            }

            const updatedConversation = {
                ...prev[existingIndex],
                preview: trimmedMessage,
                timestamp
            };

            return [updatedConversation, ...prev.filter((_, index) => index !== existingIndex)];
        });

        setIsTyping(true);

        try {
            const apiResponse = await askQuestion(trimmedMessage);
            const answer = typeof apiResponse?.Results === 'string'
                ? apiResponse.Results
                : Array.isArray(apiResponse?.Results)
                    ? apiResponse.Results.join('\n')
                    : 'I could not understand the response from the server.';

            const botMessage = {
                id: `bot-${Date.now()}`,
                text: answer,
                isUser: false,
                timestamp: new Date(),
            };

            const finalHistory = [...nextHistory, botMessage];

            setMessages(finalHistory);
            setConversationMessages(prev => ({
                ...prev,
                [conversationId]: finalHistory
            }));

            setConversations(prev => {
                const existingIndex = prev.findIndex(conv => conv.id === conversationId);
                const timestamp = new Date();
                const previewText = answer.split('\n')[0];

                if (existingIndex === -1) {
                    return prev;
                }

                const updatedConversation = {
                    ...prev[existingIndex],
                    preview: previewText,
                    timestamp
                };

                return [updatedConversation, ...prev.filter((_, index) => index !== existingIndex)];
            });
        } catch (err) {
            const botMessage = {
                id: `bot-error-${Date.now()}`,
                text: 'Sorry, something went wrong while contacting the assistant. Please try again in a moment.',
                isUser: false,
                timestamp: new Date(),
            };

            const erroredHistory = [...nextHistory, botMessage];

            setMessages(erroredHistory);
            setConversationMessages(prev => ({
                ...prev,
                [conversationId]: erroredHistory
            }));

            setConversations(prev => {
                const existingIndex = prev.findIndex(conv => conv.id === conversationId);
                if (existingIndex === -1) {
                    return prev;
                }

                const updatedConversation = {
                    ...prev[existingIndex],
                    preview: botMessage.text,
                    timestamp: new Date()
                };

                return [updatedConversation, ...prev.filter((_, index) => index !== existingIndex)];
            });
        } finally {
            setIsTyping(false);
        }
    };

    const handlePromptClick = (prompt) => {
        handleSendMessage(prompt);
    };

    const handleNewChat = () => {
        setMessages([]);
        setCurrentConversationId(null);
    };

    const handleSelectConversation = (conversationId) => {
        setCurrentConversationId(conversationId);
        const history = conversationMessages[conversationId] ?? [];
        setMessages(history);
    };

    return (
        <div className="chat-page">
            <InteractiveBackground />
            <Sidebar
                conversations={conversations}
                onNewChat={handleNewChat}
                onSelectConversation={handleSelectConversation}
                currentConversationId={currentConversationId}
            />

            <div className="chat-page__main">
                <div className="chat-page__messages-container">
                    {messages.length === 0 ? (
                        <WelcomeScreen
                            onPromptClick={handlePromptClick}
                            suggestedPrompts={SUGGESTED_PROMPTS}
                        />
                    ) : (
                        <div className="chat-page__messages">
                            <AnimatePresence mode="popLayout">
                                {messages.map((message) => (
                                    <ChatMessage
                                        key={message.id}
                                        message={message.text}
                                        isUser={message.isUser}
                                        useTypewriter={!message.isUser}
                                    />
                                ))}
                                {isTyping && (
                                    <ChatMessage
                                        key="typing"
                                        message=""
                                        isUser={false}
                                        isTyping={true}
                                    />
                                )}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                <div className="chat-page__input-container">
                    <ChatInput
                        onSendMessage={handleSendMessage}
                        disabled={isTyping}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
