import { configDotenv } from "dotenv";
configDotenv();

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import { corsOptions } from "./constants/config.js";
import { CREATE_OR_FIND_ROOM, JOIN_ROOM, PLAYER_JOINED, ROOM_UPDATE, START_GAME } from "./constants/events.js";
import { socketAuthenticater } from "./middleware/auth.js";
import { errorMiddleware } from "./middleware/error.js";
import { roomManager } from "./RoomManager.js";
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

app.set("io", io)

const userSocketIDs = new Map();
const onlineUsers = new Set();

app.get("/", (req, res) => {
  return res.send("hello from arijit");
});

app.use("/api/user", userRouters);


io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.resume,
    async (err) => await socketAuthenticater(err, socket, next)
  )
})


io.on("connection", (socket) => {
  const user = socket.user;
  userSocketIDs.set(user._id, socket.id);
  socket.on(CREATE_OR_FIND_ROOM, ({ playerCount }, callback) => {
    let targetRoomId = null;
    for (const [id, room] of Object.entries(roomManager.rooms)) {
      if (!room.isFull()) {
        targetRoomId = id;
        break;
      }
    }
    if (!targetRoomId) {
      targetRoomId = roomManager.createRoom(playerCount);
    }
    callback({ roomId: targetRoomId });
  });
  socket.on(JOIN_ROOM, ({ roomId }, callback) => {
    const playerName = socket?.user.username;

    const success = roomManager.joinRoom(roomId, { name: playerName });
    if (success) {
      socket.join(roomId);
      io.to(roomId).emit(PLAYER_JOINED, playerName);
      const room = roomManager.getRoom(roomId);
      if (room) {
        io.to(roomId).emit(ROOM_UPDATE, { players: room.players });
        if (room.isFull()) {
          room.startGame();
          io.to(roomId).emit(START_GAME, { players: room.players });
        }
      }
      callback({ success: true });
    } else {
      callback({ success: false, message: "Room full or doesn't exist" });
    }
  });

  const skipTurnTimeouts = new Map();
  socket.on("ROLL_DICE", ({ noUnlockedPieces }) => {
    const username = socket?.user?.username;
    const roomId = roomManager.getRoomIdByUsername(username);
    if (!roomId) return;
    const room = roomManager.getRoom(roomId);
    if (!room || !room.isGameStarted) return;

    const currentPlayer = room.getCurrentPlayer();
    if (currentPlayer.name !== username) return;

    const diceValue = Math.floor(Math.random() * 6) + 1;
    room.setLastDice(diceValue);

    io.to(roomId).emit("DICE_ROLLED", {
      value: diceValue,
      by: username,
    });

    const hasBonus = diceValue === 6;
    if (!hasBonus && noUnlockedPieces) {
      room.nextTurn();
      const newPlayer = room.getCurrentPlayer();
      io.to(roomId).emit("TURN_SKIPPED", { by: username });
      io.to(roomId).emit("TURN_CHANGED", { to: newPlayer.name });
      return;
    }

    if (!hasBonus) {
      const timeoutId = setTimeout(() => {
        const stillPlayer = room.getCurrentPlayer();
        if (stillPlayer.name === username) {
          room.nextTurn();
          const newPlayer = room.getCurrentPlayer();
          io.to(roomId).emit("TURN_SKIPPED", { by: username });
          io.to(roomId).emit("TURN_CHANGED", { to: newPlayer.name });
        }
      }, 10000);
      skipTurnTimeouts.set(roomId, timeoutId);
    }
  });
  socket.on("UNLOCK_PIECE", ({ id, by }) => {
    const roomId = roomManager.getRoomIdByUsername(by);
    if (!roomId) return;
    const room = roomManager.getRoom(roomId);
    if (!room || room.getCurrentPlayer().name !== by) return;
    io.to(roomId).emit("PIECE_UNLOCKED", { id });
  });

  socket.on("MOVE_PIECE", ({ id, by }) => {
    const roomId = roomManager.getRoomIdByUsername(by);
    if (!roomId) return;
    const room = roomManager.getRoom(roomId);
    if (!room || room.getCurrentPlayer().name !== by) return;

    io.to(roomId).emit("PIECE_MOVED", { id, dice: room.lastDice });
    const hasBonus = room.lastDice === 6;
    if (hasBonus) {
      const timeoutId = setTimeout(() => {
        const stillPlayer = room.getCurrentPlayer();
        if (stillPlayer.name === by) {
          room.nextTurn();
          const newPlayer = room.getCurrentPlayer();
          io.to(roomId).emit("TURN_SKIPPED", { by });
          io.to(roomId).emit("TURN_CHANGED", { to: newPlayer.name });
        }
      }, 10000);
      skipTurnTimeouts.set(roomId, timeoutId);
    }
  });

  socket.on("FINISHED_MOVE", ({ by }) => {
    const roomId = roomManager.getRoomIdByUsername(by);
    if (!roomId) return;
    const room = roomManager.getRoom(roomId);
    if (!room) return;
    if (room.lastDice !== 6) {
      const newPlayer = room.getCurrentPlayer();
      io.to(roomId).emit("TURN_ENDED", { by });
      io.to(roomId).emit("TURN_CHANGED", { to: newPlayer.name });
    }
    io.to(roomId).emit("TURN_ENDED", { by });
  });


  socket.on("PLAYER_ACTION", ({ by }) => {
    const roomId = roomManager.getRoomIdByUsername(by);
    if (!roomId) return;
    const timeoutId = skipTurnTimeouts.get(roomId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      skipTurnTimeouts.delete(roomId);
    }
  });
  // DISCONNECT
  socket.on("disconnect", () => {
    const username = socket?.user?.username;
    const roomId = roomManager.removePlayerFromRoom(username);
    if (roomId) {
      const room = roomManager.getRoom(roomId);
      console.log(`${username} left room `);
      io.to(roomId).emit(ROOM_UPDATE, { players: room?.players || [] });
      if (!room || room.players.length === 0) {
        console.log(`Room ${roomId} deleted`);
      }
    }
    userSocketIDs.delete(socket.user._id);
  });

});



app.use(errorMiddleware);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server Runing", port);
});
