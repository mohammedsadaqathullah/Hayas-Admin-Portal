import { useState, useEffect } from "react";

const VegetablesAndFruits = () => {
    const [imageURL, setImageURL] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [quantityOne, setQuantityOne] = useState(0); // Quantity for quantityOne
    const [quantityTwo, setQuantityTwo] = useState(0); // Quantity for quantityTwo
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('https://hayas-backend.onrender.com/vegetables-and-fruits');
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure all fields are filled before submitting
        if (!imageURL || !title || !description) {
            alert("All fields must be filled in.");
            return;
        }

        const productData = {
            imageURL,
            title,
            description,
            quantityOne,  // Store quantityOne
            quantityTwo   // Store quantityTwo
        };

        try {
            let response;
            if (editingProduct) {
                // Update existing product
                response = await fetch(`https://hayas-backend.onrender.com/vegetables-and-fruits/${editingProduct._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productData)
                });
            } else {
                // Create new product
                response = await fetch('https://hayas-backend.onrender.com/vegetables-and-fruits', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productData)
                });
            }

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            if (editingProduct) {
                alert('Product updated successfully');
                setProducts(products.map((product) =>
                    product._id === editingProduct._id ? data.product : product
                ));
            } else {
                alert('Product added successfully');
                setProducts([...products, data.product]);
            }

            // Reset form and state after submit
            setEditingProduct(null);
            setImageURL('');
            setTitle('');
            setDescription('');
            setQuantityOne(0);
            setQuantityTwo(0);
        } catch (error) {
            alert('There was an error with the request');
            console.error('Error:', error);
        }
    };

    const handleEdit = (product) => {
        setImageURL(product.imageURL);
        setTitle(product.title);
        setDescription(product.description);
        setQuantityOne(product.quantityOne);
        setQuantityTwo(product.quantityTwo);
        setEditingProduct(product);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://hayas-backend.onrender.com/vegetables-and-fruits/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedProducts = products.filter((product) => product._id !== id);
                setProducts(updatedProducts);
                alert('Product deleted successfully');
            } else {
                alert('Error deleting product');
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            alert('Error deleting product');
            console.error(error);
        }
    };

    return (
        <div className="groceryAddingContainer">
            <form onSubmit={handleSubmit}>
                <h2>vegetables-and-fruits</h2>
                <div>
                    <label>Image URL:</label>
                    <input
                        type="text"
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Quantity One:</label>
                    <input
                        type="text"
                        value={quantityOne}
                        onChange={(e) => setQuantityOne(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Quantity Two:</label>
                    <input
                        type="text"
                        value={quantityTwo}
                        onChange={(e) => setQuantityTwo(e.target.value)}
                        
                    />
                </div>
                <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
            </form>

            <div className="searchInput">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="groceryBoxes">
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : products.length > 0 ? (
                    products.map((product) => (
                        product && product.imageURL ? (
                            <div className="mainBox" key={product._id}>
                                <div className="card">
                                    <span className="productImage">
                                        <img src={product.imageURL} alt={product.title} />
                                    </span>
                                    <span className="title">
                                        <p>{product.title}</p>
                                    </span>
                                    <div className="description">
                                        <p>{product.description}</p>
                                    </div>
                                    <div className="quantity">
                                        <div>
                                            <span>{product.quantityOne}</span>
                                        </div>
                                        <div>
                                            <span>{product.quantityTwo}</span>
                                        </div>
                                    </div>
                                    <span className="alterbtns">
                                        <button
                                            className="editbtn"
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="deletebtn"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            Delete
                                        </button>
                                    </span>
                                </div>
                            </div>
                        ) : null
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </div>
        </div>
    );
};

export default VegetablesAndFruits;
