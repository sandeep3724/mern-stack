import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Admin.css";

import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
);

function AdminDashboard(){

const API = "https://mern-stack-qrcp.onrender.com/api";

const [products,setProducts] = useState([]);
const [orders,setOrders] = useState([]);
const [editingId,setEditingId] = useState(null);

const totalRevenue = orders.reduce(
  (total,order) => total + order.totalAmount,
  0
);

const chartData = {
labels: ["Orders", "Menu Items", "Revenue"],
datasets: [
{
label: "Restaurant Stats",
data: [orders.length, products.length, totalRevenue],
backgroundColor: [
"#007bff",
"#28a745",
"#ffc107"
]
}
]
};

const [formData,setFormData] = useState({
name:"",
price:"",
category:"Veg",
description:"",
image:""
});

/* ================= FETCH DATA ================= */

const fetchProducts = async ()=>{
try{
const res = await axios.get(`${API}/products`);
setProducts(res.data);
}catch{
toast.error("Failed to load products");
}
};

const fetchOrders = async ()=>{
try{
const res = await axios.get(`${API}/orders`);
setOrders(res.data);
}catch{
toast.error("Failed to load orders");
}
};

useEffect(()=>{
fetchProducts();
fetchOrders();
},[]);

/* ================= FORM CHANGE ================= */

const handleChange=(e)=>{
const {name,value}=e.target;

setFormData(prev=>({
...prev,
[name]:value
}));
};

/* ================= ADD / UPDATE PRODUCT ================= */

const handleSubmit = async(e)=>{
e.preventDefault();

try{

if(editingId){

const res = await axios.put(
`${API}/products/${editingId}`,
formData
);

setProducts(prev =>
prev.map(p => p._id === editingId ? res.data : p)
);

toast.info("Menu item updated");

setEditingId(null);

}else{

const res = await axios.post(`${API}/products`,formData);

setProducts(prev => [...prev,res.data]);

toast.success("Menu item added");

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

/* ================= DELETE PRODUCT ================= */

const handleDelete = async(id)=>{

if(!window.confirm("Delete item?")) return;

try{

await axios.delete(`${API}/products/${id}`);

setProducts(prev => prev.filter(p => p._id !== id));

toast.success("Item deleted");

}catch{

toast.error("Delete failed");

}

};

/* ================= EDIT PRODUCT ================= */

const handleEdit = (item)=>{

setFormData({
name:item.name,
price:item.price,
category:item.category,
description:item.description,
image:item.image
});

setEditingId(item._id);

window.scrollTo({top:0,behavior:"smooth"});

};

/* ================= UPDATE ORDER STATUS ================= */

const updateStatus = async(id,status)=>{

try{

const res = await axios.put(
`${API}/orders/${id}/status`,
{status}
);

setOrders(prev =>
prev.map(o => o._id === id ? res.data : o)
);

toast.success("Status updated");

}catch{

toast.error("Failed to update status");

}

};

/* ================= DASHBOARD ================= */

return(

<div className="admin-layout">

{/* SIDEBAR */}

<div className="sidebar">

<h2>🍽 Admin</h2>

<button>Dashboard</button> <button>Menu</button> <button>Orders</button>

</div>

{/* MAIN CONTENT */}

<div className="admin-main">

<h1 className="title"> WHICH Restaurant </h1>

{/* STATS */}

<div className="stats">

<div className="card">
<h3>📦 Total Orders</h3>
<p>{orders.length}</p>
</div>

<div className="card">
<h3>🍽 Menu Items</h3>
<p>{products.length}</p>
</div>

<div className="card">
<h3>💰 Revenue</h3>
<p>₹ {totalRevenue}</p>
</div>

</div>


<div className="chart-card">

<h2>Dashboard Overview</h2>

<Bar data={chartData} />

</div>


{/* ADD MENU FORM */}

<div className="form-card">

<h2>{editingId ? "Edit Menu Item" : "Add Menu Item"}</h2>

<form onSubmit={handleSubmit}>

<input
name="name"
placeholder="Food Name"
value={formData.name}
onChange={handleChange}
required
/>

<input
name="price"
type="number"
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

</div>

{/* MENU TABLE */}

<div className="table-card">

<h2>Menu Items</h2>

<table>

<thead>
<tr>
<th>Image</th>
<th>Name</th>
<th>Category</th>
<th>Price</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

{products.map(item=>(

<tr key={item._id}>

<td>
{item.image && <img src={item.image} alt="" width="50"/>}
</td>

<td>{item.name}</td>

<td>{item.category}</td>

<td>₹ {item.price}</td>

<td>

<button
className="edit-btn"
onClick={()=>handleEdit(item)}

>

Edit </button>

<button
className="delete-btn"
onClick={()=>handleDelete(item._id)}

>

Delete </button>

</td>

</tr>
))}

</tbody>

</table>

</div>

{/* ORDERS TABLE */}

<div className="table-card">

<h2>Orders</h2>

<table>

<thead>

<tr>
<th>Items</th>
<th>Total</th>
<th>Status</th>
<th>Change Status</th>
</tr>

</thead>

<tbody>

{orders.map(order=>(

<tr key={order._id}>

<td>

{order.items.map((i,index)=>(

<div key={index}>
{i.name} × {i.quantity}
</div>
))}

</td>

<td>₹ {order.totalAmount}</td>

<td>{order.status}</td>

<td>

<select
value={order.status}
onChange={(e)=>updateStatus(order._id,e.target.value)}

>

<option value="Pending">Pending</option>
<option value="Preparing">Preparing</option>
<option value="Delivered">Delivered</option>

</select>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</div>

);

}

export default AdminDashboard;
