const mongoose = require("mongoose");

/* ================= ORDER ITEM SCHEMA ================= */

const orderItemSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  email:{
    type:String,
    required:true
  },  
  quantity:{
    type:Number,
    required:true,
    min:1
  }
});

/* ================= ORDER SCHEMA ================= */

const orderSchema = new mongoose.Schema({

  items:{
    type:[orderItemSchema],
    required:true
  },

  totalAmount:{
    type:Number,
    required:true
  },

  status:{
    type:String,
    enum:["Pending","Preparing","Delivered"],
    default:"Pending"
  }

},{
  timestamps:true
});

/* ================= MODEL ================= */

module.exports = mongoose.model("Order",orderSchema);