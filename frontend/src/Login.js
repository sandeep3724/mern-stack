import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {

const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {

e.preventDefault();
setLoading(true);

try {

const res = await axios.post(
"https://mern-stack-qrcp.onrender.com/api/auth/login",
{
email,
password
}
);

/* ================= STORE AUTH ================= */

const token = res.data.token;
const role = res.data.user?.role;

localStorage.setItem("token", token);
localStorage.setItem("role", role);

/* ================= SUCCESS ================= */

toast.success("Login successful 🎉");

setIsLoggedIn(true);

/* ================= REDIRECT ================= */

if(role === "admin"){
navigate("/admin");
}else{
navigate("/");
}

}
catch(err){

const message = err.response?.data?.message;

if(message === "User not found"){
toast.error("User not registered. Please register first!");
}
else if(message === "Invalid password"){
toast.error("Incorrect password ❌");
}
else{
toast.error("Login failed. Please try again.");
}

}
finally{
setLoading(false);
}

};

return (

<div className="auth-page">

<div className="auth-card">

<h2 className="auth-title">Login</h2>

<form onSubmit={handleSubmit}>

<div className="form-group">

<label>Email</label>

<input
type="email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

</div>

<div className="form-group">

<label>Password</label>

<input
type="password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

</div>

<button 
className="auth-btn"
type="submit" 
disabled={loading}
>

{loading ? "Logging in..." : "Login"}

</button>

<p className="auth-switch">
New user?
</p>

<button
type="button"
className="link-btn"
onClick={()=>navigate("/register")}
>
Register
</button>

</form>

</div>

</div>

);

}

export default Login;
