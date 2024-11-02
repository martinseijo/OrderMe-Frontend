// Register.jsx
import React, { useState } from 'react';
import { register } from '../authService';

export const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        phone: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        
        try {
            await register(formData); // Llama a la función de registro
            setSuccess(true); // Indica éxito en el registro
        } catch (error) {
            setError('Failed to register. Please try again.');
        }
    };

    return (
        <>
            <p>Formulario de registro</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <button type="submit">Register</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>Registration successful!</p>}
        </>
    );
};
