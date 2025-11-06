import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import Button from '../UI/Button';
import './ChatInput.css';

const ChatInput = ({ onSendMessage, disabled = false }) => {
    const [message, setMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (message.trim() && !disabled) {
            onSendMessage(message);
            setMessage('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit(e);
        }
    };

    return (
        <motion.div
            className={`chat-input ${isFocused ? 'chat-input--focused' : ''}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            <form onSubmit={handleSubmit} className="chat-input__form">
                <div className="chat-input__wrapper">
                    <textarea
                        className="chat-input__textarea"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Ask me anything..."
                        rows={1}
                        disabled={disabled}
                    />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={!message.trim() || disabled}
                    icon={<Send size={18} />}
                    className="chat-input__send-button"
                >
                    Send
                </Button>
            </form>

            <div className="chat-input__footer">
                <p className="chat-input__hint">
                    Press <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for new line
                </p>
            </div>
        </motion.div>
    );
};

export default ChatInput;
