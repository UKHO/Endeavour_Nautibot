import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import './WelcomeScreen.css';

const WelcomeScreen = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: 'easeOut'
            }
        }
    };

    return (
        <motion.div
            className="welcome-screen"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="welcome-screen__header" variants={itemVariants}>
                <div className="welcome-screen__icon">
                    <Sparkles size={48} />
                </div>
                <h1 className="welcome-screen__title">Welcome to SeaWise</h1>
                <p className="welcome-screen__subtitle">
                    Your intelligent maritime assistant for navigation, safety, and compliance
                </p>
            </motion.div>

            <motion.div className="welcome-screen__features" variants={itemVariants}>
                <div className="feature-card">
                    <div className="feature-card__icon">📊</div>
                    <h3 className="feature-card__title">Document Analysis</h3>
                    <p className="feature-card__description">
                        Instantly analyze and extract insights from maritime documents
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-card__icon">🔍</div>
                    <h3 className="feature-card__title">Smart Search</h3>
                    <p className="feature-card__description">
                        Find relevant information across your maritime knowledge sources
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-card__icon">⚓</div>
                    <h3 className="feature-card__title">Maritime Expertise</h3>
                    <p className="feature-card__description">
                        Specialized knowledge in navigation, safety, and compliance
                    </p>
                </div>
            </motion.div>

        </motion.div>
    );
};

export default WelcomeScreen;
