import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from '../components/Chat/ChatMessage';
import ChatInput from '../components/Chat/ChatInput';
import WelcomeScreen from '../components/Chat/WelcomeScreen';
import Sidebar from '../components/Sidebar/Sidebar';
import InteractiveBackground from '../components/UI/InteractiveBackground';
import {
    dummyConversations,
    suggestedPrompts,
    getRandomResponse,
    simulateTypingDelay
} from '../utils/dummyData';
import './ChatPage.css';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [conversations] = useState(dummyConversations);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = (messageText) => {
        if (!messageText || !messageText.trim()) return;

        // Add user message immediately
        const userMessage = {
            id: `user-${Date.now()}`,
            text: messageText.trim(),
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        // Simulate bot response
        const response = getRandomResponse();
        const delay = simulateTypingDelay(response.text);

        setTimeout(() => {
            const botMessage = {
                id: `bot-${Date.now()}`,
                text: response.text,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, delay);
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
        // In a real app, you would load the conversation messages here
        // For now, we'll just clear messages as it's a dummy implementation
        setMessages([]);
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
                            suggestedPrompts={suggestedPrompts}
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
