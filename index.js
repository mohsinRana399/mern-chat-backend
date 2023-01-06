require("dotenv").config();
const socketIo = require("socket.io");
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.ATLAS_URI;
const { SOCKET_EVENTS } = require("./sockets/socket_events");
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const mongoose = require("mongoose");
const { handleSockets } = require("./sockets/socket");
const { ServerEmitter, SERVER_EVENTS } = require("./utils/server_events");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(routes);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});
const http = require("http").createServer(app);

http.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
const io = socketIo(http, {
  cors: {
    methods: ["GET", "PATCH", "POST", "PUT"],
    origin: true,
  },
});

io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
  console.log("socket connected");
  handleSockets(io, socket);
});

ServerEmitter.on(
  SERVER_EVENTS.NEW_CONVERSATION_CREATED,
  async ({ sendTo, conversation }) => {
    io.to(sendTo).emit(SOCKET_EVENTS.UPDATE_CONVERSATIONS, {
      conversation,
    });
  }
);
ServerEmitter.on(
  SERVER_EVENTS.NEW_GROUP_CREATED,
  async ({ sendTo, conversation }) => {
    sendTo?.forEach((element) => {
      io.to(element).emit(SOCKET_EVENTS.UPDATE_GROUPS, {
        conversation,
      });
    });
  }
);
