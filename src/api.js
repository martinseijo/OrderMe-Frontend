import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

// Interceptor para incluir el token en el encabezado
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && !config.url.includes('/auth/login')) {
            config.headers.Authorization = `Bearer ${token}`; // Solo añade el token si no es el login
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        const token = response.data.token;
        localStorage.setItem('token', token);
        return token;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const getUsers = async () => {
    try {
        const response = await api.get('/auth/users'); // Ejemplo de otra solicitud que usa el token
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export default api;