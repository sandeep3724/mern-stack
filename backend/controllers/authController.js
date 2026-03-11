import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* REGISTER */

export const register = async(req,res)=>{

try{

const {name,email,password} = req.body;

const hashedPassword = await bcrypt.hash(password,10);

const user = new User({
name,
email,
password:hashedPassword
});

await user.save();

res.json({message:"User registered"});

}catch(err){
res.status(500).json(err);
}

};

/* LOGIN */

export const login = async(req,res)=>{

try{

const {email,password} = req.body;

const user = await User.findOne({email});

if(!user){
return res.status(400).json({message:"User not found"});
}

const valid = await bcrypt.compare(password,user.password);

if(!valid){
return res.status(400).json({message:"Invalid password"});
}

const token = jwt.sign(
{id:user._id},
process.env.JWT_SECRET,
{expiresIn:"1d"}
);

res.json({
token,
user:{
id:user._id,
email:user.email,
role:user.role
}
});

}catch(err){
res.status(500).json(err);
}

};