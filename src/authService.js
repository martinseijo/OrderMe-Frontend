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

export const getUserTables = async () => {
    try {
        const response = await api.get('/tables'); 
        return response.data;
    } catch (error) {
        console.error('Error fetching tables:', error);
        throw error;
    }
};

export const getPendingCounts = async () => {
    try {
        const response = await api.get('/orders/pending/count');
        return response.data; 
    } catch (error) {
        console.error('Error fetching pending counts:', error);
        throw error;
    }
};

export const getPendingOrders = async (tableNumber) => {
    try {
        const response = await api.get(`/orders/pending/${tableNumber}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await api.post('/orders/update', { orderId, status });
        return response.data;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};