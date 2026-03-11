const Order = require("../models/Order");


/* ================= CREATE ORDER ================= */

exports.createOrder = async(req,res)=>{

try{

const {items,totalAmount} = req.body;

const order = new Order({
items,
totalAmount
});

await order.save();

res.status(201).json(order);

}catch(err){

console.error(err);
res.status(500).json({message:"Failed to create order"});

}

};


/* ================= GET ORDERS ================= */

exports.getOrders = async(req,res)=>{

try{

const orders = await Order.find().sort({createdAt:-1});

res.json(orders);

}catch(err){

console.error(err);
res.status(500).json({message:"Failed to fetch orders"});

}

};