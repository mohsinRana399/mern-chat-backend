const router = require("express").Router();
const { Types } = require("mongoose");
const { ObjectId } = Types;
const { Message } = require("../models/message");
const { PublicMessage } = require("../models/publicMessage");
const errorCaught = require("../utils/error_handler");

//send message
router.post("/", async (req, res) => {
  try {
    const { sender, content, conversation } = req.body;
    const _newMessage = new Message({
      sender,
      conversation,
      content,
    });
    await _newMessage.save();

    return res.status(200).json({
      message: _newMessage,
    });
  } catch (error) {
    return errorCaught(res, error);
  }
});
//get conversation message
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allMessages = await Message.find({
      conversation: new ObjectId(id),
    });
    return res.status(200).json({
      allMessages,
    });
  } catch (error) {
    return errorCaught(res, error);
  }
});
//get public messages
router.get("/", async (req, res) => {
  try {
    const allMessages = await PublicMessage.find();
    return res.status(200).json({
      allMessages,
    });
  } catch (error) {
    return errorCaught(res, error);
  }
});
module.exports = router;
