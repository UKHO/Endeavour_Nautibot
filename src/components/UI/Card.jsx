import { motion } from 'framer-motion';
import './Card.css';

const Card = ({
    children,
    variant = 'default',
    padding = 'medium',
    hover = false,
    onClick,
    className = '',
    ...props
}) => {
    const baseClass = 'admiralty-card';
    const variantClass = `${baseClass}--${variant}`;
    const paddingClass = `${baseClass}--padding-${padding}`;
    const hoverClass = hover ? `${baseClass}--hover` : '';
    const clickableClass = onClick ? `${baseClass}--clickable` : '';

    const CardComponent = hover || onClick ? motion.div : 'div';

    const motionProps = hover || onClick ? {
        whileHover: { y: -4, boxShadow: 'var(--shadow-lg)' },
        transition: { duration: 0.2 }
    } : {};

    return (
        <CardComponent
            className={`${baseClass} ${variantClass} ${paddingClass} ${hoverClass} ${clickableClass} ${className}`}
            onClick={onClick}
            {...motionProps}
            {...props}
        >
            {children}
        </CardComponent>
    );
};

export default Card;
