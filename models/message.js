const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    content: {
      type: String,
    },
    sender: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "user",
    },
    conversation: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "conversation",
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("message", MessageSchema);

module.exports = {
  Message,
};
