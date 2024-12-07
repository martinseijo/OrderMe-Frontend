import React, { useState, useEffect } from 'react';
import { getProducts } from '../authService.js';
import { createOrder } from '../api.js';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
    const [searchParams] = useSearchParams();
    const username = searchParams.get('username');
    const tableId = searchParams.get('tableId');

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts(username);
                setProducts(data);
            } catch (error) {
                toast.error('Error al obtener productos.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [username]);

    const addToCart = (productId) => {
        setCart((prevCart) => ({
            ...prevCart,
            [productId]: {
                quantity: (prevCart[productId]?.quantity || 0) + 1,
                observations: prevCart[productId]?.observations || '',
            },
        }));
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => {
            const newCart = { ...prevCart };
            if (newCart[productId]?.quantity > 1) {
                newCart[productId].quantity -= 1;
            } else {
                delete newCart[productId];
            }
            return newCart;
        });
    };

    const updateObservation = (productId, newObservation) => {
        setCart((prevCart) => ({
            ...prevCart,
            [productId]: {
                ...prevCart[productId],
                observations: newObservation,
            },
        }));
    };

    const handleSubmit = async () => {
        const orderRequest = {
            tableId,
            products: Object.entries(cart).map(([productId, { quantity, observations }]) => ({
                productId: parseInt(productId, 10),
                quantity,
                observations,
            })),
        };
    
        try {
            await createOrder(orderRequest); 
            toast.success('¡Pedido realizado con éxito!');
            setCart({});
        } catch (error) {
            toast.error('Hubo un problema al realizar el pedido. Inténtalo de nuevo.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    const productTypes = ['Entrantes', 'Tapas', 'Raciones', 'Postres', 'Bebidas'];

    const groupedProducts = productTypes.map((type) => ({
        type,
        items: products.filter((product) => product.productType.name === type),
    }));

    return (
        <div className="container">
            <ToastContainer />
            <h2 className="text-center my-4">Carta</h2>
            <div className="d-flex justify-content-end mb-3">
                <button
                    className="btn btn-warning me-2"
                    onClick={() => navigate(`/bill?username=${username}&tableId=${tableId}`)}
                >
                    Ver Cuenta
                </button>
            </div>
            {groupedProducts.map(
                (group) =>
                    group.items.length > 0 && (
                        <div key={group.type}>
                            <h3 className="my-4">{group.type}</h3>
                            <div className="row">
                                {group.items.map((product) => (
                                    <div className="col-md-4" key={product.id}>
                                        <div className="card mb-4 shadow-sm">
                                            <div className="card-body">
                                                <h5 className="card-title">{product.name}</h5>
                                                <p className="card-text">{product.description}</p>
                                                <p className="card-text">
                                                    <strong>Price:</strong> {product.price.toFixed(2)} €
                                                </p>
                                                <textarea
                                                    className="form-control mb-2"
                                                    placeholder="Observaciones"
                                                    value={cart[product.id]?.observations || ''}
                                                    onChange={(e) => updateObservation(product.id, e.target.value)}
                                                />
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => removeFromCart(product.id)}
                                                        disabled={!cart[product.id]}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-2">
                                                        <strong>Cantidad:</strong> {cart[product.id]?.quantity || 0}
                                                    </span>
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => addToCart(product.id)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
            )}

            <div className="text-center mt-4">
                <button onClick={handleSubmit} className="btn btn-primary btn-lg">
                    Enviar Pedido
                </button>
            </div>
        </div>
    );
};

export default ProductList;