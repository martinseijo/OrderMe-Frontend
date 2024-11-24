import React, { useState, useEffect } from 'react';
import { getProducts } from '../authService';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
    const [searchParams] = useSearchParams();
    const username = searchParams.get('username');
    const tableId = searchParams.get('tableId');

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [observations, setObservations] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts(username);
                setProducts(data);
            } catch (error) {
                setError('Failed to fetch products.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [username]);

    const addToCart = (productId) => {
        setCart((prevCart) => ({
            ...prevCart,
            [productId]: (prevCart[productId] || 0) + 1,
        }));
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => {
            const newCart = { ...prevCart };
            if (newCart[productId] > 1) {
                newCart[productId] -= 1;
            } else {
                delete newCart[productId];
            }
            return newCart;
        });
    };

    const handleSubmit = async () => {
        const orderRequest = {
            tableId,
            products: cart,
            observations,
        };

        try {
            const response = await axios.post('http://localhost:8080/orders/create', orderRequest);
            console.log('Order created:', response.data);
        } catch (error) {
            console.error('Error creating order:', error);
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
            <h2 className="text-center my-4">Carta</h2>
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
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => removeFromCart(product.id)}
                                                        disabled={!cart[product.id]}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-2">
                                                        <strong>Cantidad:</strong> {cart[product.id] || 0}
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
            <div className="mt-4">
                <h4>Observaciones</h4>
                <div className="form-group">
                    <label htmlFor="observations">Comentarios:</label>
                    <textarea
                        id="observations"
                        className="form-control"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        placeholder="Añade cualquier observación para el pedido..."
                    />
                </div>
            </div>
            <div className="text-center mt-4">
                <button onClick={handleSubmit} className="btn btn-primary btn-lg">
                    Enviar Pedido
                </button>
            </div>
        </div>
    );
};

export default ProductList;
