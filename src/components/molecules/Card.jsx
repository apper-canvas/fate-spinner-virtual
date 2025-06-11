import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className, ...rest }) => {
    const defaultClasses = "bg-surface rounded-xl p-6 border border-secondary/30 neon-glow";
    return (
        <motion.div
            className={`${defaultClasses} ${className || ''}`}
            {...rest}
        >
            {children}
        </motion.div>
    );
};

export default Card;