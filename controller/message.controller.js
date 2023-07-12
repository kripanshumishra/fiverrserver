const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model");
const createError = require("../utils/createError");

const createMessage = async (req, res, next) => {
  const { conversationId, desc } = req.body;
  const message = new Message({
    conversation: conversationId,
    desc,
    user: req.userId,
  });
  try {
    const convo = await Conversation.findOne( { id: conversationId } );
    if ( req.userId !== convo.buyer.toString() && req.userId !== convo.seller.toString() )   return next ( createError( 401 , "Not authorized !" ) ) ;
    const savedmsg = await message.save();
    await Conversation.findOneAndUpdate(
      {
        id: conversationId,
      },
      {
        $set: {
          readByBuyer: !req.isSeller,
          readBySeller: req.isSeller,
          lastMessage: desc,
        },
      },
      {
        new: true, // returns the updated document
      }
    );
    res.status(200).send(savedmsg);
  } catch (error) {
    console.log("createMessage()", error);
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversation: req.params.id });
    res.status(200).send(messages);
  } catch (error) {
    console.log("getMessages()", error);
    next(error);
  }
};


module.exports = { getMessages , createMessage }