const router = require( "express" ).Router();
const { login , logout , register , getMe } = require( '../controller/auth.controller' );
const { verifyToken } = require( "../middleware/jwt" );

router.post( "/register" , register ) ;
router.post( "/login" , login ) ;
router.post( "/logout" , logout ) ;
router.get( "/me" , verifyToken,  getMe ) ;


module.exports = router ;