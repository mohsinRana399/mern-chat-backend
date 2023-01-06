const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PublicMessageSchema = new Schema(
  {
    content: {
      type: String,
    },
    sender: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const PublicMessage = mongoose.model("broadcasted", PublicMessageSchema);

module.exports = {
  PublicMessage,
};
