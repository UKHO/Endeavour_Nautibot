import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import { useState } from 'react';
import TypewriterText from '../UI/TypewriterText';
import './ChatMessage.css';

const ChatMessage = ({ message, isUser, isTyping = false, useTypewriter = false }) => {
    const [typewriterComplete, setTypewriterComplete] = useState(false);

    const messageVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: 'easeOut'
            }
        }
    };

    const typingDotVariants = {
        start: { y: 0 },
        end: { y: -10 }
    };

    return (
        <motion.div
            className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--bot'}`}
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <div className="chat-message__avatar">
                {isUser ? (
                    <User size={20} />
                ) : (
                    <Bot size={20} />
                )}
            </div>

            <div className="chat-message__content">
                <div className={`chat-message__bubble ${isUser ? 'chat-message__bubble--user' : 'chat-message__bubble--bot'}`}>
                    {isTyping ? (
                        <div className="chat-message__typing">
                            <motion.span
                                variants={typingDotVariants}
                                animate="end"
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatType: 'reverse',
                                    delay: 0
                                }}
                            />
                            <motion.span
                                variants={typingDotVariants}
                                animate="end"
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatType: 'reverse',
                                    delay: 0.15
                                }}
                            />
                            <motion.span
                                variants={typingDotVariants}
                                animate="end"
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatType: 'reverse',
                                    delay: 0.3
                                }}
                            />
                        </div>
                    ) : (
                        <p className="chat-message__text">
                            {!isUser && useTypewriter && !typewriterComplete ? (
                                <TypewriterText
                                    text={message}
                                    speed={20}
                                    onComplete={() => setTypewriterComplete(true)}
                                />
                            ) : (
                                message
                            )}
                            {!isUser && useTypewriter && !typewriterComplete && (
                                <span className="chat-message__cursor">|</span>
                            )}
                        </p>
                    )}
                </div>
                <span className="chat-message__timestamp">
                    {new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
            </div>
        </motion.div>
    );
};

export default ChatMessage;
