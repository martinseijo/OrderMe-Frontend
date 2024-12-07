import React, { useState, useEffect } from 'react';
import { getUserTables, getPendingCounts } from '../authService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrderDetails from './OrderDetails';
import { useNavigate } from 'react-router-dom';

const UserTables = () => {
    const [tables, setTables] = useState([]);
    const [pendingCounts, setPendingCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const navigate = useNavigate();

    const fetchPendingCounts = async () => {
        try {
            const data = await getPendingCounts();
            setPendingCounts(data || {});
        } catch (error) {
            toast.error('No se pudo cargar la cantidad de pedidos pendientes.');
        }
    };

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
        if (tables.length > 0) {
            fetchPendingCounts();
            const interval = setInterval(fetchPendingCounts, 3000);
            return () => clearInterval(interval);
        }
    }, [tables]);

    const handleBack = (refresh = false) => {
        setSelectedTable(null);
        if (refresh) fetchPendingCounts();
    };

    if (loading) return <div className="text-center mt-5">Cargando mesas...</div>;

    if (error) return <div className="alert alert-danger text-center mt-5">{error}</div>;

    if (selectedTable)
        return <OrderDetails table={selectedTable} onBack={handleBack} />;

    return (
        <div className="container mt-4">
            <ToastContainer />
            <h2 className="text-center my-4">Mesas Asignadas</h2>
            <div className="d-flex justify-content-end mb-3">
                <button
                    className="btn btn-warning me-2"
                    onClick={() => navigate('/edit-products')}
                >
                    Editar Productos
                </button>
                <button
                    className="btn btn-warning"
                    onClick={() => navigate('/edit-tables')}
                >
                    Editar Mesas
                </button>
            </div>
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-primary">
                                <tr>
                                    <th>Mesa</th>
                                    <th>Nombre</th>
                                    <th>Pedidos Pendientes</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tables.length > 0 ? (
                                    tables.map((table) => (
                                        <tr key={table.id}>
                                            <td>Mesa {table.number}</td>
                                            <td>
                                                {table.name || (
                                                    <em className="text-muted">Sin nombre</em>
                                                )}
                                            </td>
                                            <td>
                                                {pendingCounts[table.number] > 0 ? (
                                                    <span
                                                        style={{
                                                            backgroundColor: 'red',
                                                            color: 'white',
                                                            borderRadius: '50%',
                                                            padding: '0.3em 0.6em',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {pendingCounts[table.number]}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted">Sin pedidos</span>
                                                )}
                                            </td>
                                            <td>
                                                {pendingCounts[table.number] > 0 && (
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => setSelectedTable(table)}
                                                    >
                                                        Ver
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted">
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
