import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.1.138:8080',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && !config.url.includes('/auth/login') && !config.url.includes('/products')) {
            config.headers.Authorization = `Bearer ${token}`; 
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


export const getProducts = async (username) => {
    try {
        const response = await api.post('/products', { username });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const createOrder = async (orderRequest) => {
    try {
        const response = await api.post('/orders/create', orderRequest);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export default api;