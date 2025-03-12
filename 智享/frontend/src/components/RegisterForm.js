import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // ...existing code...

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/register', {
                email,
                password,
            });
            // ...existing code...
        } catch (error) {
            // ...existing code...
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* ...existing code... */}
            <button type="submit">注册</button>
        </form>
    );
};

export default RegisterForm;