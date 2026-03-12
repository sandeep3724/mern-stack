const Order = require("../models/Order");


/* ================= CREATE ORDER ================= */

exports.createOrder = async(req,res)=>{

try{

const {items,totalAmount} = req.body;

const order = new Order({
items,
totalAmount,
email
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

/* ================= UPDATE ORDER STATUS ================= */

exports.updateOrderStatus = async(req,res)=>{

try{

const {status} = req.body;

const order = await Order.findByIdAndUpdate(
req.params.id,
{status},
{new:true}
);

if(!order){
return res.status(404).json({message:"Order not found"});
}

res.json(order);

}catch(err){

console.error(err);
res.status(500).json({message:"Failed to update order status"});

}

};