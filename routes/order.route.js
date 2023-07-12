const { getOrders, newOrderIntent , confirmOrder } = require("../controller/order.controller");
const { verifyToken } = require( "../middleware/jwt" )
const router = require( "express" ).Router();

router.get( "/" , verifyToken ,  getOrders  );
router.post( "/create-payment-intent/:id" , verifyToken , newOrderIntent );
router.put( "/" , verifyToken , confirmOrder )
module.exports = router;