/*
-> create the new order
-> confirm the order
-> view all the orders related to user

*/

const createError = require("../utils/createError");
const Order = require("../models/order.model");
const Gig = require("../models/gig.model");
const User = require( "../models/user.model" ) ; 
const Stripe = require( "stripe" ) ; 


const getOrders = async (req, res, next) => {
  try {
    const query = { 
      isCompleted : true , 
      ...(req.isSeller ? {
        seller : req.userId
    } : {
        buyer : req.userId
    }) };
    const orders = await Order.find( query );
    res.status( 200 ).send( orders )
  } catch (error) {
    console.log("getOrder()", error);
    next(error);
  }
};

const newOrderIntent = async ( req , res , next ) =>{
  const stripe = new Stripe ( process.env.STRIPE ) ;

    try {
        const gig = await Gig.findById( req.params.id );
        if ( req.isSeller ) return next ( createError( 403 , "sellers are not allowed to make order" ) )
        const paymentIntent = await stripe.paymentIntents.create({
          amount : gig.price * 100 , 
          currency : "inr", 
          automatic_payment_methods: {
            enabled: true,
          },
        })
        const order = new Order( {
            gigId : gig._id , 
            price : gig.price,
            img : gig.cover,
            title : gig.title, 
            buyer : req.userId,
            seller : gig.user , 
            payment_intent : paymentIntent.id ,

        } );
        await order.save()
        res.status( 200 ).send({
          clientSecret : paymentIntent.client_secret
        });
    } catch (error) {
        console.log( "newOrder()" , error );
        next ( error );
    }
};

const confirmOrder = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );
    await User.findByIdAndUpdate(orders.seller , {
      $inc : {
        total_orders : 1
      }
    })

    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};

module.exports  = { newOrderIntent , getOrders , confirmOrder };