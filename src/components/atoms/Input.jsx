import React from 'react';

const Input = ({ className, ...rest }) => {
    return (
        <input
            className={className}
            {...rest}
        />
    );
};

export default Input;