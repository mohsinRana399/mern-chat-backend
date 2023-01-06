const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ConversationSchema = new Schema(
  {
    title: {
      type: String,
    },
    type: {
      type: String,
    },
    lastMessage: {
      type: String,
    },
    lastMessageTime: {
      type: Date,
    },
    participants: [
      {
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "user",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("conversation", ConversationSchema);

module.exports = {
  Conversation,
};
