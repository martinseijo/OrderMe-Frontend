import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getServedOrders, markOrdersAsPaid } from '../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Bill = () => {
    const [searchParams] = useSearchParams();
    const tableNumber = searchParams.get('tableId');
    const username = searchParams.get('username');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const fetchCalled = useRef(false);

    useEffect(() => {
        const fetchServedOrders = async () => {
            try {
                const data = await getServedOrders(username, tableNumber);
                console.log('Respuesta del servidor:', data);
                setOrders(data || []);
            } catch (error) {
                setError('Error al obtener los pedidos servidos.');
            } finally {
                setLoading(false);
            }
        };

        // Evita múltiples llamadas al servidor
        if (!fetchCalled.current) {
            fetchCalled.current = true;
            fetchServedOrders();
        }
    }, [tableNumber, username]);

    const calculateTotal = () => {
        return orders
            .reduce((total, order) => total + order.product.price * order.quantity, 0)
            .toFixed(2);
    };

    const handlePay = async () => {
        const orderIds = orders.map((order) => order.id);
        try {
            await markOrdersAsPaid(orderIds);
            toast.success('Cuenta pagada con éxito. ¡Gracias!');
            setOrders([]); // Limpia los pedidos después del pago
        } catch {
            toast.error('Error al procesar el pago. Inténtalo de nuevo.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container">
            <ToastContainer />
            <h2 className="text-center my-4">Cuenta de la Mesa {tableNumber}</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario (€)</th>
                        <th>Total (€)</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.product.name}</td>
                                <td>{order.quantity}</td>
                                <td>{order.product.price.toFixed(2)}</td>
                                <td>{(order.product.price * order.quantity).toFixed(2)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No hay pedidos servidos.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="text-end">
                <h4>Total: {calculateTotal()} €</h4>
            </div>
            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Volver
                </button>
                <button className="btn btn-primary" onClick={handlePay}>
                    Pagar
                </button>
            </div>
        </div>
    );
};

export default Bill;