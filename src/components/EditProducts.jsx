import React, { useState, useEffect } from 'react';
import { getUserProducts, addProduct, updateProduct, deleteProduct, getProductTypes } from '../authService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const EditProducts = () => {
    const [products, setProducts] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductsAndTypes = async () => {
            try {
                const [productsData, productTypesData] = await Promise.all([
                    getUserProducts(),
                    getProductTypes(),
                ]);
                setProducts(productsData);
                setProductTypes(productTypesData);
            } catch (error) {
                toast.error('Error al cargar productos o tipos de productos.');
            } finally {
                setLoading(false);
            }
        };
        fetchProductsAndTypes();
    }, []);

    const handleInputChange = (index, key, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][key] = value;
        setProducts(updatedProducts);
    };

    const handleAddProduct = () => {
        const newProduct = {
            id: `temp-${Date.now()}`,
            name: '',
            description: '',
            price: '',
            productType: { id: '' },
        };
        setProducts((prev) => [...prev, newProduct]);
    };

    const handleSaveProduct = async (id, updatedProduct) => {
        try {
            const stringId = String(id);

            if (stringId.startsWith('temp-')) {
                const productToCreate = { ...updatedProduct, id: null };
                const createdProduct = await addProduct(productToCreate);
                setProducts((prev) =>
                    prev.map((product) => (product.id === id ? createdProduct : product))
                );
                toast.success('Producto añadido con éxito.');
            } else {
                const productToUpdate = {
                    name: updatedProduct.name,
                    description: updatedProduct.description,
                    price: updatedProduct.price,
                    productType: { id: updatedProduct.productType.id },
                };
                const updated = await updateProduct(id, productToUpdate);
                setProducts((prev) =>
                    prev.map((product) => (product.id === id ? updated : product))
                );
                toast.success('Producto actualizado con éxito.');
            }
        } catch (error) {
            console.error('Error al guardar el producto:', error);
            toast.error('Error al guardar el producto.');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await deleteProduct(id);
            setProducts((prev) => prev.filter((product) => product.id !== id));
            toast.success('Producto eliminado con éxito.');
        } catch (error) {
            toast.error('Error al eliminar el producto.');
        }
    };

    const handleBack = () => {
        navigate('/tables');
    };

    if (loading) {
        return <div className="text-center mt-5">Cargando productos...</div>;
    }

    return (
        <div className="container mt-4">
            <ToastContainer />
            <h2 className="text-center my-4">Editar Productos</h2>
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-secondary" onClick={handleBack}>
                    Volver
                </button>
                <button className="btn btn-success" onClick={handleAddProduct}>
                    + Añadir Producto
                </button>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-primary">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Precio</th>
                                    <th>Tipo de Producto</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={product.id}>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={product.name || ''}
                                                onChange={(e) =>
                                                    handleInputChange(index, 'name', e.target.value)
                                                }
                                                placeholder="Nombre"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={product.description || ''}
                                                onChange={(e) =>
                                                    handleInputChange(index, 'description', e.target.value)
                                                }
                                                placeholder="Descripción"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={product.price || ''}
                                                onChange={(e) =>
                                                    handleInputChange(index, 'price', e.target.value)
                                                }
                                                placeholder="Precio"
                                            />
                                        </td>
                                        <td>
                                            <select
                                                className="form-select"
                                                value={product.productType?.id || ''}
                                                onChange={(e) =>
                                                    handleInputChange(index, 'productType', {
                                                        id: e.target.value,
                                                    })
                                                }
                                            >
                                                <option value="" disabled>
                                                    Seleccione un tipo
                                                </option>
                                                {productTypes.map((type) => (
                                                    <option key={type.id} value={type.id}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-primary me-2"
                                                onClick={() => handleSaveProduct(product.id, product)}
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDeleteProduct(product.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProducts;