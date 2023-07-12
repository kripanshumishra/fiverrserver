const  mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select:false,
    },
    img: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    desc: {
      type: String,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    total_orders:{
      type:Number, 
      default: 0 
    }
  },
  {
    timestamps: true,
  }
);


module.exports= mongoose.model ( "User" , userSchema  )