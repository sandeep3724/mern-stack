import React from "react";

function CartItem({ item, increaseQuantity, decreaseQuantity }) {

return (

<div className="cart-item">

<img src={item.image} alt={item.name} className="cart-image" />

<div className="cart-info">

<strong>{item.name}</strong>

<div className="cart-controls">

<button onClick={() => decreaseQuantity(item._id)}>−</button>

<span>{item.quantity}</span>

<button onClick={() => increaseQuantity(item._id)}>+</button>

</div>

<p>₹ {item.price * item.quantity}</p>

</div>

</div>

);

}

export default CartItem;