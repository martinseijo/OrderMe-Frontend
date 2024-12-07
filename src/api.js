import axios from 'axios';

const api = axios.create({
    baseURL: 'https://orderme.onrender.com',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (
            token &&
            !config.url.includes('/auth/login') &&
            !config.url.includes('/products/public') &&
            !config.url.includes('/orders/create') &&
            !config.url.includes('/orders/served') &&
            !config.url.includes('/public/paid')
        ) {
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
        const response = await api.post('/products/public', { username });
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

export const getServedOrders = async (username, tableNumber) => {
    try {
        const response = await api.get(`/orders/served/${username}/${tableNumber}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching served orders:', error);
        throw error;
    }
};

export const markOrdersAsPaid = async (orderIds) => {
    try {
        await api.post('/orders/public/paid', orderIds);
    } catch (error) {
        console.error('Error marking orders as paid:', error);
        throw error;
    }
};
export default api;