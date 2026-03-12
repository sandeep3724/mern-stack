import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

import Login from "./Login";
import Register from "./Register";
import AdminDashboard from "./AdminDashboard";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QRCodeCanvas } from "qrcode.react";
import emailjs from "@emailjs/browser";

function App() {

const API = "https://mern-stack-qrcp.onrender.com/api";

/* ================= AUTH ================= */

const [isLoggedIn, setIsLoggedIn] = useState(
!!localStorage.getItem("token")
);

const role = localStorage.getItem("role");

const handleLogout = () => {

localStorage.removeItem("token");
localStorage.removeItem("role");
setIsLoggedIn(false);

};

/* ================= STATES ================= */

const [page,setPage] = useState("menu");

const [formData,setFormData] = useState({
name:"",
price:"",
category:"Veg",
description:"",
image:""
});

const [products,setProducts] = useState([]);
const [orders,setOrders] = useState([]);
const [editingId,setEditingId] = useState(null);
const [cart,setCart] = useState([]);
const [search,setSearch] = useState("");
const [showPayment,setShowPayment] = useState(false);
const [email,setEmail] = useState("");

/* ================= TOTAL ================= */

const totalItems = cart.reduce((t,i)=>t+i.quantity,0);

const totalAmount = cart.reduce(
(t,i)=>t + Number(i.price)*i.quantity,
0
);

/* ================= EMAIL ================= */

const sendEmail = ()=>{

if(!email){
toast.warning("Enter your email");
return;
}

emailjs.send(
"service_sp0etxl",
"template_y2r1hsn",
{
user_name: "Customer",
email: email,
restaurant_name: "WHICH Restaurant",
amount: totalAmount
},
"40yZeRBtJNJtJvhIb"
)
.then(()=>{
toast.success("Confirmation email sent 📧");
})
.catch((error)=>{
console.log(error);
toast.error("Failed to send email");
});

};

/* ================= FETCH ================= */

const fetchProducts = async () => {

try{

const res = await axios.get(`${API}/products`);
setProducts(res.data);

}catch{

toast.error("Failed to load products");

}

};

const fetchOrders = async () => {

try{

const res = await axios.get(`${API}/orders`);
setOrders(res.data);

}catch{

toast.error("Failed to load orders");

}

};

useEffect(()=>{

if(isLoggedIn){

fetchProducts();
fetchOrders();

}

},[isLoggedIn]);

/* ================= SEARCH ================= */

const filteredProducts = products.filter(item=>

item.name.toLowerCase().includes(search.toLowerCase()) ||
item.category.toLowerCase().includes(search.toLowerCase())

);

/* ================= DELETE ================= */

const handleDelete = async(id)=>{

if(!window.confirm("Delete this product?")) return;

try{

await axios.delete(`${API}/products/${id}`);

setProducts(prev=>prev.filter(item=>item._id!==id));

toast.success("Product deleted");

}catch{

toast.error("Delete failed");

}

};

/* ================= EDIT ================= */

const handleEdit=(item)=>{

setFormData({

name:item.name,
price:item.price,
category:item.category,
description:item.description,
image:item.image || ""

});

setEditingId(item._id);

window.scrollTo({top:0,behavior:"smooth"});

};

/* ================= CART ================= */

const handleAddToCart=(product)=>{

const existing = cart.find(i=>i._id===product._id);

if(existing){

setCart(prev=>
prev.map(item=>
item._id===product._id
? {...item,quantity:item.quantity+1}
:item
)
);

}else{

setCart(prev=>[
...prev,
{...product,quantity:1}
]);

}

toast.success(`${product.name} added`);

};

const increaseQuantity=(id)=>{

setCart(prev=>
prev.map(item=>
item._id===id
? {...item,quantity:item.quantity+1}
:item
)
);

};

const decreaseQuantity=(id)=>{

const item = cart.find(i=>i._id===id);

if(!item) return;

if(item.quantity===1){

setCart(prev=>prev.filter(i=>i._id!==id));

}else{

setCart(prev=>
prev.map(i=>
i._id===id
? {...i,quantity:i.quantity-1}
:i
)
);

}

};

/* ================= ORDER ================= */

const placeOrder = async () => {

if(cart.length === 0){
toast.warning("Cart empty");
return;
}

if(!email){
toast.warning("Enter email first");
return;
}

const orderData = {
 items: cart.map(item=>({
   name:item.name,
   price:item.price,
   quantity:item.quantity,
   email:email
 })),
 totalAmount
};

try{

await axios.post(`${API}/orders`,orderData);

sendEmail();

toast.success("Order placed successfully 🎉");

setCart([]);
setShowPayment(false);

}catch(err){

console.error(err);
toast.error("Order failed");

}

};

/* ================= FORM ================= */

const handleChange=(e)=>{

const {name,value}=e.target;

setFormData(prev=>({

...prev,
[name]:value

}));

};

const handleSubmit = async(e)=>{

e.preventDefault();

try{

if(editingId){

const res = await axios.put(
`${API}/products/${editingId}`,
formData
);

setProducts(prev=>
prev.map(item=>
item._id===editingId ? res.data : item
)
);

toast.info("Product updated");

setEditingId(null);

}else{

const res = await axios.post(
`${API}/products`,
formData
);

setProducts(prev=>[...prev,res.data]);

toast.success("Product added");

}

setFormData({

name:"",
price:"",
category:"Veg",
description:"",
image:""

});

}catch{

toast.error("Save failed");

}

};

/* ================= DASHBOARD ================= */

const Dashboard = () => (

<div className="container">

<h1 className="title">🍽️ Restaurant Menu</h1>

<button onClick={handleLogout} className="logout-btn">
Logout
</button>

<div className="category-row">

<button onClick={()=>setPage("menu")}>
🍽 Menu
</button>

<button
className="cart-btn"
onClick={()=>setPage("cart")}
>
🛒 Cart ({totalItems})
</button>

<button
className="orders-btn"
onClick={()=>setPage("orders")}
>
📜 Orders
</button>

</div>

{/* ================= MENU ================= */}

{page==="menu" && (

<>

{role==="admin" && (

<form onSubmit={handleSubmit}>

<h2>{editingId ? "Edit Item" : "Add New Item"}</h2>

<input
name="name"
placeholder="Item Name"
value={formData.name}
onChange={handleChange}
required
/>

<input
type="number"
name="price"
placeholder="Price"
value={formData.price}
onChange={handleChange}
required
/>

<select
name="category"
value={formData.category}
onChange={handleChange}
>

<option value="Veg">Veg</option>
<option value="NonVeg">NonVeg</option>

</select>

<input
name="description"
placeholder="Description"
value={formData.description}
onChange={handleChange}
required
/>

<input
name="image"
placeholder="Image URL"
value={formData.image}
onChange={handleChange}
/>

<button type="submit">
{editingId ? "Update Item" : "Add Item"}
</button>

</form>

)}

<input
className="search-bar"
placeholder="Search food..."
value={search}
onChange={e=>setSearch(e.target.value)}
/>

<div className="products-grid">

{filteredProducts.map(item=>(

<div key={item._id} className="card">

{item.image && (
<img src={item.image} alt={item.name} />
)}

<div className="card-content">

<h3>{item.name}</h3>
<p>₹ {item.price}</p>
<p>{item.category}</p>
<p>{item.description}</p>

<div className="card-buttons">

<button
className="add-btn"
onClick={()=>handleAddToCart(item)}
>
Add 🛒
</button>

{role==="admin" && (

<>

<button
className="edit-btn"
onClick={()=>handleEdit(item)}
>
Edit
</button>

<button
className="delete-btn"
onClick={()=>handleDelete(item._id)}
>
Delete
</button>

</>

)}

</div>

</div>

</div>

))}

</div>

</>

)}

{/* ================= CART ================= */}

{page==="cart" && (

<div className="cart-layout">

<div className="cart-items">

<h2>Cart</h2>

{cart.length===0 && <p>Your cart is empty</p>}

{cart.map(item=>(

<div key={item._id} className="cart-item">

{item.image && (
<img src={item.image} alt={item.name} />
)}

<div className="cart-info">

<strong>{item.name}</strong>

<div className="cart-controls">

<button onClick={()=>decreaseQuantity(item._id)}>-</button>
<span>{item.quantity}</span>
<button onClick={()=>increaseQuantity(item._id)}>+</button>

</div>

<p>₹ {item.price * item.quantity}</p>

</div>

</div>

))}

</div>

<div className="order-summary-box">

<h3>Order Summary</h3>

<p>Total Items: {totalItems}</p>

<h2>Total: ₹ {totalAmount}</h2>

<div className="email-box">

<input
type="email"
placeholder="Enter your email for confirmation"
value={email}
onChange={(e)=>{
setEmail(e.target.value);
}}
autoComplete="off"
/>

<button onClick={sendEmail}>
Send Confirmation Mail 📧
</button>

</div>

<button
className="order-btn"
onClick={()=>setShowPayment(true)}
disabled={cart.length===0}
>
Pay via QR 📱
</button>

</div>

{showPayment && (

<div className="qr-payment">

<h3>Scan & Pay</h3>

<QRCodeCanvas
value={`upi://pay?pa=7989291892@ybl&pn=Restaurant&am=${totalAmount}&cu=INR`}
size={220}
/>

<p>Amount: ₹ {totalAmount}</p>

<button
className="pay-btn"
onClick={placeOrder}
>
I Paid ✅
</button>

<button
className="cancel-btn"
onClick={()=>setShowPayment(false)}
>
Cancel
</button>

</div>

)}

</div>

)}

{/* ================= ORDERS ================= */}

{page==="orders" && (

<div className="order-history">

<h2>Order History</h2>

{orders.map(order=>(

<div key={order._id} className="order-card">

{order.items.map((item,i)=>(
<p key={i}>{item.name} × {item.quantity}</p>
))}

<p><strong>Total: ₹ {order.totalAmount}</strong></p>
<p>{new Date(order.createdAt).toLocaleString()}</p>

</div>

))}

</div>

)}

</div>

);

/* ================= ROUTER ================= */

return(

<>

<Routes>

<Route
path="/login"
element={<Login setIsLoggedIn={setIsLoggedIn}/>}
/>

<Route
path="/register"
element={<Register/>}
/>

<Route
path="/"
element={
isLoggedIn
? <Dashboard/>
: <Navigate to="/login"/>
}
/>

<Route
path="/admin"
element={
role==="admin"
? <AdminDashboard/>
: <Navigate to="/"/>
}
/>

</Routes>

<ToastContainer position="top-right" autoClose={2000}/>

</>

);

}

export default App;