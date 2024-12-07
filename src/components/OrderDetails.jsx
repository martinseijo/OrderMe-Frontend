import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getPendingOrders, updateOrderStatus } from '../authService';

const OrderDetails = ({ table, onBack }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getPendingOrders(table.number);
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('No se pudieron cargar los pedidos.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [table.number]);

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            await updateOrderStatus(orderId, status);
            toast.success(`Pedido actualizado a ${status}`);
            setOrders((prevOrders) =>
                prevOrders.filter((order) => order.id !== orderId)
            );
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('No se pudo actualizar el estado del pedido.');
        }
    };

    if (loading) return <div className="text-center mt-5">Cargando pedidos...</div>;

    return (
        <div className="container mt-4">
            <h3 className="text-center mb-4">Pedidos Pendientes - Mesa {table.number}</h3>
            <button className="btn btn-secondary mb-3" onClick={() => onBack(true)}>
                Volver
            </button>
            <ul className="list-group">
                {orders.map((order) => (
                    <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{order.quantity}x {order.product.name}</strong>
                            <p className="mb-0 text-muted">{order.observations || 'Sin observaciones'}</p>
                        </div>
                        <div>
                            <button
                                className="btn btn-success btn-sm me-2"
                                onClick={() => handleUpdateOrderStatus(order.id, 'SERVED')}
                            >
                                Listo
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleUpdateOrderStatus(order.id, 'CANCELED')}
                            >
                                Cancelar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderDetails;