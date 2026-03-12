import React from "react";
import { useNavigate } from "react-router-dom";

import CartItem from "../components/CartItem";

function CartPage({ cart, setCart }) {

const navigate = useNavigate();

const increaseQuantity = (id) => {

setCart(
cart.map((item) =>
item._id === id
? { ...item, quantity: item.quantity + 1 }
: item
)
);

};

const decreaseQuantity = (id) => {

const item = cart.find((i) => i._id === id);

if (item.quantity === 1) {

setCart(cart.filter((i) => i._id !== id));

} else {

setCart(
cart.map((i) =>
i._id === id
? { ...i, quantity: i.quantity - 1 }
: i
)
);

}

};

const totalAmount = cart.reduce(
(total, item) => total + item.price * item.quantity,
0
);

return (

<div className="container">

<button onClick={() => navigate("/")}>
⬅ Back to Menu
</button>

<h2>🛒 Cart</h2>

{cart.map((item) => (

<CartItem
key={item._id}
item={item}
increaseQuantity={increaseQuantity}
decreaseQuantity={decreaseQuantity}
/>

))}

<h2>Total: ₹ {totalAmount}</h2>

</div>

);

}

export default CartPage;