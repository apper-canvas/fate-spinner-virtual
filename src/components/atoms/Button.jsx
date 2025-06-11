import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className, ...rest }) => {
    return (
        <motion.button
            className={className}
            {...rest}
        >
            {children}
        </motion.button>
    );
};

export default Button;