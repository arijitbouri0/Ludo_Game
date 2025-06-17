import { configDotenv } from "dotenv";
configDotenv();
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import { corsOptions } from "./constants/config.js";
import { CREATE_OR_FIND_ROOM, CUT_PIECE, FINISHED_MOVE, JOIN_ROOM, MOVE_PIECE, PLAYER_JOINED, ROLL_DICE, ROOM_UPDATE, START_GAME, UNLOCK_PIECE } from "./constants/events.js";
import { socketAuthenticater } from "./middleware/auth.js";
import { errorMiddleware } from "./middleware/error.js";
import { RoomManager } from "./RoomManager.js";
import userRouters from "./router/user.router.js";

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const url = process.env.MONGODB_URI;
connectDB(url);

const io = new Server(server, {
  cors: corsOptions,
});

app.set("io", io);

const userSocketIDs = new Map();
const roomManager = new RoomManager(io);

app.get("/", (req, res) => {
  return res.send("hello from arijit");
});

app.use("/api/user", userRouters);

io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.resume,
    async (err) => await socketAuthenticater(err, socket, next)
  );
});

io.on("connection", (socket) => {
  const user = socket.user;
  userSocketIDs.set(user._id, socket.id);

  socket.on(CREATE_OR_FIND_ROOM, ({ playerCount }, callback) => {
    const roomId = roomManager.findOrCreateRoom(playerCount);
    callback({ roomId });
  });

  socket.on(JOIN_ROOM, ({ roomId }, callback) => {
    const result = roomManager.handleJoinRoom(roomId, socket.user.username, socket);
    callback(result);
  });

  socket.on(ROLL_DICE, ({ noUnlockedPieces }) => {
    roomManager.handleRollDice(socket.user.username, noUnlockedPieces);
  });

  socket.on(UNLOCK_PIECE, ({ id, by }) => {
    roomManager.handleUnlockPiece(id, by);
  });

  socket.on(MOVE_PIECE, ({ id, by }) => {
    roomManager.handleMovePiece(id, by);
  });
  socket.on(CUT_PIECE, ({by, pieceId }) => {
    roomManager.handleCutPiece( by,pieceId,socket);
  });
  socket.on(FINISHED_MOVE, ({ by }) => {
    roomManager.handleFinishedMove(by);
  });

  socket.on("disconnect", () => {
    const username = socket?.user?.username;
    roomManager.handleDisconnect(username);
    userSocketIDs.delete(socket.user._id);
  });
});

app.use(errorMiddleware);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server Running", port);
});