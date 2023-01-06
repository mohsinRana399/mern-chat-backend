const { Conversation } = require("../models/conversation");
const { Message } = require("../models/message");
const { Types } = require("mongoose");
const { ObjectId } = Types;

const { SOCKET_EVENTS } = require("./socket_events");
const { PublicMessage } = require("../models/publicMessage");

const handleSockets = async (io, socket) => {
  socket.on(SOCKET_EVENTS.JOIN, async ({ user_id }) => {
    // console.log("joining : ", user_id);
    socket.join(user_id);
  });
  socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, async ({ conversation }) => {
    socket.join(conversation);
  });
  socket.on(
    SOCKET_EVENTS.SOLO_MESSAGE,
    async ({ sender, content, conversation }) => {
      const newMessage = await createNewMessage(sender, content, conversation);
      io.to(conversation).emit(
        SOCKET_EVENTS.SOLO_MESSAGE,
        JSON.stringify(newMessage)
      );
    }
  );
  socket.on(SOCKET_EVENTS.BROADCAST_MESSAGE, async ({ message, sender }) => {
    const newMessage = await createPublicMessage(sender, message);
    io.emit(SOCKET_EVENTS.BROADCAST_MESSAGE, JSON.stringify(newMessage));
  });
};

const createNewMessage = async (sender, content, conversation) => {
  // console.log({ sender, content, conversation });
  const _newMessage = new Message({
    sender,
    conversation,
    content,
  });
  await _newMessage.save();
  const _conversation = await Conversation.findOne({
    _id: new ObjectId(conversation),
  });
  _conversation.lastMessage = content;
  _conversation.lastMessageTime = new Date();
  await _conversation.save();
  return _newMessage;
};
const createPublicMessage = async (sender, content) => {
  // console.log({ sender, content, conversation });
  const _newPublicMessage = new PublicMessage({
    sender,
    content,
  });
  await _newPublicMessage.save();
  return _newPublicMessage;
};
module.exports = { handleSockets };
