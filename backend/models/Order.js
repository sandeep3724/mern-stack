const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  quantity:{
    type:Number,
    required:true,
    min:1
  }
});

const orderSchema = new mongoose.Schema({

  items:{
    type:[orderItemSchema],
    required:true
  },

  totalAmount:{
    type:Number,
    required:true
  },

  email:{                 // ✅ move here
    type:String,
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

module.exports = mongoose.model("Order",orderSchema);