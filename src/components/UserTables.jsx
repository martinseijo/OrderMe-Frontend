import React, { useState, useEffect } from 'react';
import { getUserTables } from '../authService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                                </tr>
                            </thead>
                            <tbody>
                                {tables.length > 0 ? (
                                    tables.map((table, index) => (
                                        <tr key={index}>
                                            <td>Mesa {table.number}</td>
                                            <td>{table.name || <em className="text-muted">Sin asignar</em>}</td>
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
