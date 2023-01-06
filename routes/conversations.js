const router = require("express").Router();
const { Types } = require("mongoose");
const { ObjectId } = Types;
const { Conversation } = require("../models/conversation");
const errorCaught = require("../utils/error_handler");
const { ServerEmitter, SERVER_EVENTS } = require("../utils/server_events");

//start conversation
router.post("/", async (req, res) => {
  try {
    const { receiver, sender } = req.body;
    const _conversation = new Conversation({
      participants: [receiver, sender],
      lastMessageTime: new Date(),
      lastMessage: "",
    });
    await _conversation.save();

    const newConversation = await _conversation.populate(
      "participants",
      "name"
    );
    ServerEmitter.emit(SERVER_EVENTS.NEW_CONVERSATION_CREATED, {
      sendTo: receiver,
      conversation: newConversation,
    });
    return res.status(200).json({
      newConversation,
      message: "Conversation started",
    });
  } catch (error) {
    return errorCaught(res, error);
  }
});
//start group conversation
router.post("/group", async (req, res) => {
  try {
    const { participants, initiator, title } = req.body;
    const _conversation = new Conversation({
      participants: [...participants, initiator],
      lastMessageTime: new Date(),
      lastMessage: "",
      title,
      type: "GROUP",
    });
    await _conversation.save();

    const newConversation = await _conversation.populate(
      "participants",
      "name"
    );
    ServerEmitter.emit(SERVER_EVENTS.NEW_GROUP_CREATED, {
      sendTo: participants,
      conversation: newConversation,
    });
    return res.status(200).json({
      newConversation,
      message: "Conversation started",
    });
  } catch (error) {
    return errorCaught(res, error);
  }
});
//get conversations
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allConversations = await Conversation.find({
      participants: new ObjectId(id),
    }).populate("participants", "name");
    return res.status(200).json({
      allConversations,
      message: "Conversation started",
    });
  } catch (error) {
    return errorCaught(res, error);
  }
});
//get groups
router.get("/group/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allConversations = await Conversation.find({
      participants: new ObjectId(id),
      type: "GROUP",
    }).populate("participants", "name");
    return res.status(200).json({
      allConversations,
      message: "Conversation started",
    });
  } catch (error) {
    return errorCaught(res, error);
  }
});
module.exports = router;
