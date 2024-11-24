import api from './api'; // Instancia configurada de Axios

export const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        const token = response.data.token;
        localStorage.setItem('token', token); // Guarda el token
        return token;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData); // Usa la misma instancia `api`
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};

export const getUsers = async () => {
    try {
        const response = await api.get('/users'); // Usando la misma instancia `api`
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};


export const getProducts = async (username) => {
    try {
        const response = await api.post('/products', { username });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};