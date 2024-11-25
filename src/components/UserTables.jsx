import React, { useState, useEffect } from 'react';
import { getUserTables, getPendingCounts } from '../authService';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const UserTables = () => {
    const [tables, setTables] = useState([]);
    const [pendingCounts, setPendingCounts] = useState({});
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

    useEffect(() => {
        const fetchPendingCounts = async () => {
            try {
                const data = await getPendingCounts(); // Usa la función del servicio
                setPendingCounts(data); // Actualiza los pedidos pendientes
            } catch (error) {
                toast.error('No se pudo cargar la cantidad de pedidos pendientes.');
            }
        };
    
        if (tables.length > 0) {
            fetchPendingCounts();
            const interval = setInterval(fetchPendingCounts, 60000); // Ejecuta cada 60 segundos
            return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
        }
    }, [tables]);

    if (loading) return <div className="text-center mt-5">Cargando mesas...</div>;

    if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

    return (
        <div className="container mt-4">
            <ToastContainer />
            <h2 className="text-center my-4">Mesas Asignadas</h2>
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-primary">
                                <tr>
                                    <th>Mesa</th>
                                    <th>Nombre</th>
                                    <th>Pedidos Pendientes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tables.length > 0 ? (
                                    tables.map((table, index) => (
                                        <tr key={index}>
                                            <td>Mesa {table.number}</td>
                                            <td>{table.name || <em className="text-muted">Sin asignar</em>}</td>
                                            <td>
                                                {pendingCounts[table.number] > 0 ? (
                                                    <div
                                                        style={{
                                                            position: 'relative',
                                                            display: 'inline-block',
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                backgroundColor: 'red',
                                                                color: 'white',
                                                                borderRadius: '50%',
                                                                padding: '0.3em 0.6em',
                                                                fontSize: '0.9em',
                                                                fontWeight: 'bold',
                                                            }}
                                                        >
                                                            {pendingCounts[table.number]}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">Sin pedidos</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center text-muted">
                                            No hay mesas asignadas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserTables;
