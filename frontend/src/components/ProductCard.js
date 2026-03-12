import React from "react";

function ProductCard({ item, handleAddToCart, handleEdit, handleDelete }) {

return (

<div className="card">

{item.image && <img src={item.image} alt={item.name} />}

<div className="card-content">

<h3>{item.name}</h3>

<p><strong>₹ {item.price}</strong></p>

<p>{item.category}</p>

<p>{item.description}</p>

<div className="card-buttons">

<button
className="add-btn"
onClick={() => handleAddToCart(item)}
>
Add 🛒
</button>

<button
className="edit-btn"
onClick={() => handleEdit(item)}
>
Edit ✏️
</button>

<button
className="delete-btn"
onClick={() => handleDelete(item._id)}
>
Delete ❌
</button>

</div>

</div>

</div>

);

}

export default ProductCard;