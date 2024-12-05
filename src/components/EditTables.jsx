import React, { useState, useEffect } from 'react';
import { getUserTables, addTable, updateTable, deleteTable } from '../authService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const EditTables = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const data = await getUserTables();
                setTables(data);
            } catch (error) {
                toast.error('Error al cargar las mesas.');
            } finally {
                setLoading(false);
            }
        };
        fetchTables();
    }, []);

    const handleInputChange = (index, key, value) => {
        const updatedTables = [...tables];
        updatedTables[index][key] = value;
        setTables(updatedTables);
    };

    const handleAddTable = () => {
        const newTableLocal = {
            id: `temp-${Date.now()}`,
            number: '',
            name: '',
            description: '',
        };
        setTables((prev) => [...prev, newTableLocal]);
    };

    const handleSaveTable = async (id, updatedTable) => {
        try {
            const stringId = String(id);

            if (stringId.startsWith('temp-')) {
                const updatedTableWithNullId = { ...updatedTable, id: null };
                const addedTable = await addTable(updatedTableWithNullId);
                setTables((prev) =>
                    prev.map((table) =>
                        table.id === id ? addedTable : table
                    )
                );
                toast.success('Mesa añadida con éxito.');
            } else {
                const tableToSave = {
                    number: updatedTable.number,
                    name: updatedTable.name,
                    description: updatedTable.description,
                };
                const savedTable = await updateTable(id, tableToSave);
                setTables((prev) =>
                    prev.map((table) => (table.id === id ? savedTable : table))
                );
                toast.success('Mesa actualizada con éxito.');
            }
        } catch (error) {
            console.error('Error al guardar la mesa:', error);
            toast.error('Error al guardar los cambios de la mesa.');
        }
    };

    const handleDeleteTable = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta mesa?')) return;
        try {
            await deleteTable(id);
            setTables((prev) => prev.filter((table) => table.id !== id));
            toast.success('Mesa eliminada con éxito.');
        } catch (error) {
            toast.error('Error al eliminar la mesa.');
        }
    };

    const handleBack = () => {
        navigate('/tables'); 
    };

    if (loading) {
        return <div className="text-center mt-5">Cargando mesas...</div>;
    }

    return (
        <div className="container mt-4">
            <ToastContainer />
            <h2 className="text-center my-4">Editar Mesas</h2>
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-secondary" onClick={handleBack}>
                    Volver
                </button>
                <button className="btn btn-success" onClick={handleAddTable}>
                    + Añadir Mesa
                </button>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    {tables.map((table, index) => (
                        <div key={table.id} className="d-flex align-items-center mb-3">
                            <input
                                type="number"
                                className="form-control me-2"
                                value={table.number || ''}
                                onChange={(e) =>
                                    handleInputChange(index, 'number', e.target.value)
                                }
                                placeholder="Número de Mesa"
                            />
                            <input
                                type="text"
                                className="form-control me-2"
                                value={table.name || ''}
                                onChange={(e) =>
                                    handleInputChange(index, 'name', e.target.value)
                                }
                                placeholder="Nombre"
                            />
                            <input
                                type="text"
                                className="form-control me-2"
                                value={table.description || ''}
                                onChange={(e) =>
                                    handleInputChange(index, 'description', e.target.value)
                                }
                                placeholder="Descripción"
                            />
                            <button
                                className="btn btn-primary me-2"
                                onClick={() => handleSaveTable(table.id, table)}
                            >
                                Guardar
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDeleteTable(table.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EditTables;
