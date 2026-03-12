import React from "react";
import { useNavigate } from "react-router-dom";

function Header({ cart }) {

const navigate = useNavigate();

const totalItems = cart.reduce(
(total, item) => total + item.quantity,
0
);

return (

<div className="header">

<h1>🍽 Restaurant Menu</h1>

<button
className="cart-btn"
onClick={() => navigate("/cart")}
>
🛒 Cart ({totalItems})
</button>

</div>

);

}

export default Header;