import { useState, useEffect } from "react";

const Foods = () => {
    const [imageURL, setImageURL] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [halfKg, setHalfKg] = useState('');
    const [oneKg, setOneKg] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]); // To hold the filtered products
    const [loading, setLoading] = useState(true);  // Add loading state
    const [editingProduct, setEditingProduct] = useState(null);  // To track which product is being edited
    const [searchTerm, setSearchTerm] = useState(''); // Search term state

    useEffect(() => {
        // Fetch all products from backend
        fetch('https://hayas-backend.onrender.com/food')
            .then((response) => response.text())  // Use response.text() to handle empty response
            .then((data) => {
                // console.log('Fetched data:', data);  // Log the raw data
                try {
                    const parsedData = data ? JSON.parse(data) : [];  // Parse data only if it's not empty
                    setProducts(parsedData);
                    setFilteredProducts(parsedData);  // Initially, set all products as filtered
                    setLoading(false);  // Data is fetched, set loading to false
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    setLoading(false);  // Handle error gracefully
                }
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                setLoading(false);  // In case of error, stop loading
            });
    }, []);

    useEffect(() => {
        // Filter products based on the search term
        const result = products.filter((product) =>
            product?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product?.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(result);  // Update the filtered products state
    }, [searchTerm, products]);  // Re-run whenever searchTerm or products change

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            imageURL,
            title,
            description,
            halfKg,
            oneKg
        };

        if (editingProduct) {
            // If editing, update the product
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
                    // Update the product in the state
                    setProducts(products.map((product) =>
                        product._id === editingProduct._id ? data.product : product
                    ));
                    setFilteredProducts(filteredProducts.map((product) =>
                        product._id === editingProduct._id ? data.product : product
                    ));
                    setEditingProduct(null);  // Reset editing product
                } else {
                    alert('Error updating product');
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                alert('Error updating product');
                console.error(error);
            }
        } else {
            // If adding new product
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
                    setProducts([...products, data.product]);  // Add the new product to state
                    setFilteredProducts([...filteredProducts, data.product]); // Add the new product to filtered list
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
            const response = await fetch(`https://hayas-backend.onrender.com/grocery/${id}`, {
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
        setHalfKg(product.halfKg);
        setOneKg(product.oneKg);
        setEditingProduct(product);  // Set the product to be edited
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
                    <label>Price for Half Kg:</label>
                    <input
                        type="number"
                        value={halfKg}
                        onChange={(e) => setHalfKg(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Price for One Kg:</label>
                    <input
                        type="number"
                        value={oneKg}
                        onChange={(e) => setOneKg(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
            </form>
            <div className="searchInput">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
                />
            </div>

            <div className="groceryBoxes">
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        product && product.imageURL ? ( // Ensure product and imageURL are not undefined
                            <div className="mainBox" key={product._id}>
                                <div className="card">
                                    <span className="productImage">
                                        <img src={product.imageURL} alt={product.title} />
                                    </span>
                                    <span className="title">
                                        <p>{product.title}</p>
                                    </span>
                                    <span className="description">
                                        <p>{product.description}</p>
                                    </span>
                                    <span className="addbtn">
                                        <span>
                                            <button> - </button>
                                        </span>
                                        <span>
                                            <span>{product.halfKg}</span>Rs / 500gm
                                        </span>
                                        <span>
                                            <button> + </button>
                                        </span>
                                    </span>
                                    <span className="addbtn">
                                        <span>
                                            <button> - </button>
                                        </span>
                                        <span>
                                            <span>{product.oneKg}</span>Rs / 1kg
                                        </span>
                                        <span>
                                            <button> + </button>
                                        </span>
                                    </span>
                                    <span className="alterbtns">
                                        <span>
                                            <button
                                                className="editbtn"
                                                onClick={() => handleEdit(product)}  // Trigger handleEdit when clicked
                                            >
                                                Edit
                                            </button>
                                        </span>
                                        <span>
                                            <button
                                                className="deletebtn"
                                                onClick={() => handleDelete(product._id)}  // Call handleDelete on delete button click
                                            >
                                                Delete
                                            </button>
                                        </span>
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
