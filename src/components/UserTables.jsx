import React, { useState, useEffect } from 'react';
import { getUserTables } from '../authService'; // Servicio para obtener las mesas
import { toast, ToastContainer } from 'react-toastify'; // Notificaciones
import 'react-toastify/dist/ReactToastify.css'; // Estilos de Toastify

const UserTables = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const data = await getUserTables();
                setTables(data);
            } catch (error) {
                console.error('Error fetching user tables:', error);
                setError('Hubo un problema al cargar las mesas.');
                toast.error('No se pudo cargar la lista de mesas.');
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    if (loading) return <div className="text-center mt-5">Cargando mesas...</div>;

    if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

    return (
        <div className="container mt-4">
            <ToastContainer /> {/* Contenedor para notificaciones */}
            <h2 className="text-center my-4">Mesas Asignadas</h2>
            <ul className="list-group">
                {tables.map((table, index) => (
                    <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <span>
                            <strong>Mesa:</strong> {table.number}
                        </span>
                        {table.name && <span className="text-muted">{table.name}</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserTables;
