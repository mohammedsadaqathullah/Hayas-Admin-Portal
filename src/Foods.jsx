import { useState, useEffect } from "react";

const Foods = () => {
    const [imageURL, setImageURL] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [quantityOne, setQuantityOne] = useState(0); // Replace halfKg with quantityOne
    const [quantityTwo, setQuantityTwo] = useState(0); // Replace oneKg with quantityTwo
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const result = products.filter((product) =>
            product?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product?.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(result);
    }, [searchTerm, products]);

    const fetchProducts = () => {
        fetch('https://hayas-backend.onrender.com/food')
            .then((response) => response.text())
            .then((data) => {
                try {
                    const parsedData = data ? JSON.parse(data) : [];
                    setProducts(parsedData);
                    setFilteredProducts(parsedData);
                    setLoading(false);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            imageURL,
            title,
            description,
            quantityOne, // Use quantityOne
            quantityTwo  // Use quantityTwo
        };

        if (editingProduct) {
            try {
                const response = await fetch(`https://hayas-backend.onrender.com/food/${editingProduct._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productData)
                });

                if (response.ok) {
                    const data = await response.json();
                    alert('Product updated successfully');
                    setProducts(products.map((product) =>
                        product._id === editingProduct._id ? data.product : product
                    ));
                    setFilteredProducts(filteredProducts.map((product) =>
                        product._id === editingProduct._id ? data.product : product
                    ));
                    setEditingProduct(null);
                    fetchProducts();

                    setImageURL('');
                    setTitle('');
                    setDescription('');
                    setQuantityOne(0);
                    setQuantityTwo(0);
                } else {
                    alert('Error updating product');
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                alert('Error updating product');
                console.error(error);
            }
        } else {
            try {
                const response = await fetch('https://hayas-backend.onrender.com/food', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productData)
                });

                if (response.ok) {
                    const data = await response.json();
                    alert('Product added successfully');
                    setProducts([...products, data.product]);
                    setFilteredProducts([...filteredProducts, data.product]);
                    fetchProducts();

                    setImageURL('');
                    setTitle('');
                    setDescription('');
                    setQuantityOne(0);
                    setQuantityTwo(0);
                } else {
                    alert('Error adding product');
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                alert('Error adding product');
                console.error(error);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://hayas-backend.onrender.com/food/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedProducts = products.filter((product) => product._id !== id);
                setProducts(updatedProducts);
                setFilteredProducts(updatedProducts);
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

    const handleEdit = (product) => {
        setImageURL(product.imageURL);
        setTitle(product.title);
        setDescription(product.description);
        setQuantityOne(product.quantityOne);  // Adjust for quantityOne
        setQuantityTwo(product.quantityTwo);  // Adjust for quantityTwo
        setEditingProduct(product);
    };

    return (
        <div className="groceryAddingContainer">
            <form onSubmit={handleSubmit}>
                <h2>Foods</h2>
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
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
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

export default Foods;
