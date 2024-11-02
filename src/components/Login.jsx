import React, { useState } from 'react';
import { login } from '../authService';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(username, password);
            onLogin();
            navigate('/users');
        } catch (error) {
            console.error('Login failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <h2 className="login-title">OrderMe</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="submit-button-container">
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading && <span className="loading-icon"></span>}
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
