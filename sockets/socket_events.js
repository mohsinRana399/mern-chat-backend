const SOCKET_EVENTS = {
  CONNECTION: "connection",
  JOIN: "join_service",
  JOIN_CONVERSATION: "join_conversation",
  SOLO_MESSAGE: "solo_message",
  DISCONNECT: "leave_service",
  UPDATE_CONVERSATIONS: "update_conversations",
  UPDATE_GROUPS: "update_groups",
  BROADCAST_MESSAGE: "broadcast_message",
};

module.exports = {
  SOCKET_EVENTS,
};
