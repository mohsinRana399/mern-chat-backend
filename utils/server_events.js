var EventEmitter = require("events");

var ServerEmitter = new EventEmitter();
const SERVER_EVENTS = {
  NEW_MESSAGE: "new_message",
  NEW_CONVERSATION_CREATED: "new_conversation_created",
  NEW_GROUP_CREATED: "new_group_created",
  UPDATE_CONVERSATIONS: "update_conversations",
};

module.exports = {
  SERVER_EVENTS,
  ServerEmitter,
};
