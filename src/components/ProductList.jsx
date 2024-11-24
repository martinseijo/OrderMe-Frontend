import React, { useState, useEffect } from 'react';
import { getProducts } from '../authService';

const ProductList = ({ username }) => {
    const [products, setProducts] = useState([]);
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container">
            <h2 className="text-center">Product List</h2>
            <div className="row">
                {products.map((product) => (
                    <div className="col-md-4" key={product.id}>
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.description}</p>
                                <p className="card-text"><strong>Price:</strong> ${product.price}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;