import React, { useState } from 'react';
import { login } from '../authService';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(username, password);
            onLogin();
            navigate('/products');
        } catch (error) {
            console.error('Login failed', error);
            setError('Bad credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4">
                <h2 className="card-title text-center">OrderMe</h2>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;