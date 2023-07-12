const router = require( "express" ).Router() ; 
const { getConversations , getOneConversation , createConversation , updateConversation } = require("../controller/conversation.controller");
const { verifyToken } = require( "../middleware/jwt" ) ; 
/*
    user can create unique conversation if there isn't any conversation b/w buyer and seller 
*/


router.get( "/" , verifyToken , getConversations ) ;
router.get( "/:id" , verifyToken , getOneConversation );
router.post( "/" , verifyToken , createConversation ) ;
router.put( "/:id" , verifyToken , updateConversation );





module.exports = router;