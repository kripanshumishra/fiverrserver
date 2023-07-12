const { createReview, getReview, deleteReview } = require("../controller/review.controller");

const router = require( "express" ).Router();
const { verifyToken } = require( "../middleware/jwt" )

router.post( "/" , verifyToken , createReview );
router.get( "/:gigId" , getReview ) ;
router.delete( "/:id" , verifyToken,  deleteReview ) ;

module.exports = router;