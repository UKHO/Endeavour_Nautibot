import { motion } from 'framer-motion';
import './FloatingParticles.css';

const FloatingParticles = ({ count = 20 }) => {
    const particles = Array.from({ length: count }, (_, i) => i);

    return (
        <div className="floating-particles">
            {particles.map((particle) => (
                <motion.div
                    key={particle}
                    className="particle"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        scale: Math.random() * 0.5 + 0.5,
                        opacity: Math.random() * 0.3 + 0.2,
                    }}
                    animate={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        scale: Math.random() * 0.8 + 0.4,
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: Math.random() * 20 + 15,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
};

export default FloatingParticles;
