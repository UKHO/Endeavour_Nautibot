import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Plus,
    Menu,
    X,
    Search,
    Settings,
    LogOut,
    ChevronRight
} from 'lucide-react';
import Button from '../UI/Button';
import Card from '../UI/Card';
import './Sidebar.css';

const Sidebar = ({ conversations, onNewChat, onSelectConversation, currentConversationId }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredConversations = conversations.filter(conv =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sidebarVariants = {
        open: { width: 320, transition: { duration: 0.3, ease: 'easeInOut' } },
        closed: { width: 0, transition: { duration: 0.3, ease: 'easeInOut' } }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return timestamp.toLocaleDateString();
    };

    return (
        <>
            {/* Menu Toggle Button - Shows when sidebar is closed */}
            {!isOpen && (
                <button
                    className="sidebar-menu-toggle"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open sidebar"
                >
                    <Menu size={20} />
                </button>
            )}

            {/* Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop for mobile */}
                        <motion.div
                            className="sidebar-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.aside
                            className="sidebar"
                            variants={sidebarVariants}
                            initial="open"
                            animate="open"
                            exit="closed"
                        >
                            {/* Header */}
                            <div className="sidebar__header">
                                <div className="sidebar__header-top">
                                    <div className="sidebar__logo">
                                        <div className="sidebar__logo-icon">
                                            <MessageSquare size={24} />
                                        </div>
                                        <span className="sidebar__logo-text">SeaWise AI</span>
                                    </div>
                                    <button
                                        className="sidebar__close-button"
                                        onClick={() => setIsOpen(false)}
                                        aria-label="Close sidebar"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <Button
                                    variant="primary"
                                    size="medium"
                                    onClick={onNewChat}
                                    icon={<Plus size={18} />}
                                    fullWidth
                                >
                                    New Chat
                                </Button>
                            </div>

                            {/* Search */}
                            <div className="sidebar__search">
                                <Search size={18} className="sidebar__search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="sidebar__search-input"
                                />
                            </div>

                            {/* Conversations List */}
                            <div className="sidebar__conversations">
                                <h3 className="sidebar__section-title">Recent Conversations</h3>
                                <div className="sidebar__conversations-list">
                                    {filteredConversations.map((conversation) => (
                                        <motion.div
                                            key={conversation.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Card
                                                padding="small"
                                                className={`conversation-item ${currentConversationId === conversation.id
                                                    ? 'conversation-item-active'
                                                    : ''
                                                    }`}
                                                onClick={() => onSelectConversation(conversation.id)}
                                                hover
                                            >
                                                <div className="conversation-item-content">
                                                    <h4 className="conversation-item-title">
                                                        {conversation.title}
                                                    </h4>
                                                    <p className="conversation-item-preview">
                                                        {conversation.preview}
                                                    </p>
                                                    <span className="conversation-item-timestamp">
                                                        {formatTimestamp(conversation.timestamp)}
                                                    </span>
                                                </div>
                                                <ChevronRight size={16} className="conversation-item-icon" />
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="sidebar__footer">
                                <button className="sidebar__footer-button">
                                    <Settings size={18} />
                                    <span>Settings</span>
                                </button>
                                <button className="sidebar__footer-button">
                                    <LogOut size={18} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
