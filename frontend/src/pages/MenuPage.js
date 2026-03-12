import React, { useEffect, useState } from "react";
import axios from "axios";

import Header from "../components/Header";
import ProductCard from "../components/ProductCard";

function MenuPage({ cart, setCart }) {

const [products, setProducts] = useState([]);

useEffect(() => {
fetchProducts();
}, []);

const fetchProducts = async () => {

const res = await axios.get(
""https://mern-stack-qrcp.onrender.com/api/products""
);

setProducts(res.data);

};

const handleAddToCart = (product) => {

const existing = cart.find(
(item) => item._id === product._id
);

if (existing) {

setCart(
cart.map((item) =>
item._id === product._id
? { ...item, quantity: item.quantity + 1 }
: item
)
);

} else {

setCart([...cart, { ...product, quantity: 1 }]);

}

};

return (

<div className="container">

<Header cart={cart} />

<div className="products-grid">

{products.map((item) => (

<ProductCard
key={item._id}
item={item}
handleAddToCart={handleAddToCart}
/>

))}

</div>

</div>

);

}

export default MenuPage;