import { motion } from 'framer-motion';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    onClick,
    disabled = false,
    icon,
    fullWidth = false,
    className = '',
    ...props
}) => {
    const baseClass = 'admiralty-button';
    const variantClass = `${baseClass}--${variant}`;
    const sizeClass = `${baseClass}--${size}`;
    const fullWidthClass = fullWidth ? `${baseClass}--full-width` : '';
    const disabledClass = disabled ? `${baseClass}--disabled` : '';

    const handleClick = (e) => {
        console.log('Button clicked!', { disabled, type: props.type });
        if (onClick && !disabled) {
            onClick(e);
        }
    };

    return (
        <motion.button
            className={`${baseClass} ${variantClass} ${sizeClass} ${fullWidthClass} ${disabledClass} ${className}`}
            onClick={handleClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            transition={{ duration: 0.15 }}
            {...props}
        >
            {icon && <span className={`${baseClass}__icon`}>{icon}</span>}
            <span className={`${baseClass}__text`}>{children}</span>
        </motion.button>
    );
};

export default Button;
