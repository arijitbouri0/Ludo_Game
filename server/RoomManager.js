import { v4 as uuidv4 } from 'uuid';
import { DICE_ROLLED, PIECE_MOVED, PIECE_UNLOCKED, PLAYER_JOINED, START_GAME, TURN_CHANGED } from "./constants/events.js";
import { GameRoom } from './GameRoom.js';

export class RoomManager {
  constructor(io) {
    this.io = io;
    this.rooms = {};
    this.skipTurnTimeouts = new Map();
  }

  findOrCreateRoom(playerCount) {
    let targetRoomId = Object.keys(this.rooms).find(id => !this.rooms[id].isFull());
    if (!targetRoomId) {
      targetRoomId = this.createRoom(playerCount);
    }
    return targetRoomId;
  }

  createRoom(playerCount) {
    const roomId = uuidv4();
    this.rooms[roomId] = new GameRoom(playerCount);
    return roomId;
  }

  getRoom(roomId) {
    return this.rooms[roomId];
  }

  getRoomIdByUsername(username) {
    return Object.keys(this.rooms).find(id =>
      this.rooms[id].players.some(p => p.name === username)
    );
  }

  handleJoinRoom(roomId, playerName, socket) {
    const room = this.getRoom(roomId);
    if (!room || room.isFull()) {
      return { success: false, message: "Room full or doesn't exist" };
    }
    room.addPlayer({ name: playerName });
    socket.join(roomId);

    this.io.to(roomId).emit(PLAYER_JOINED, playerName);

    if (room.isFull()) {
      room.startGame();
      this.io.to(roomId).emit(START_GAME, { players: room.players });
    }

    return { success: true };
  }

  handleRollDice(username, noUnlockedPieces) {
    const roomId = this.getRoomIdByUsername(username);
    if (!roomId) return;
    const room = this.getRoom(roomId);
    if (!room || !room.isGameStarted) return;

    const currentPlayer = room.getCurrentPlayer();
    if (currentPlayer.name !== username) return;

    this.clearRoomTimeout(roomId);

    const diceValue = Math.floor(Math.random() * 6) + 1;
    room.setLastDice(diceValue);

    this.io.to(roomId).emit(DICE_ROLLED, {
      value: diceValue,
      by: username,
    });

    const hasBonus = diceValue === 6;

    if (!hasBonus && noUnlockedPieces) {
      this.changeTurn(roomId, true);
    } else {
      this.setTurnTimeout(roomId, username);
    }
  }

  handleUnlockPiece(id, by) {
    const roomId = this.getRoomIdByUsername(by);
    if (!roomId) return;

    const room = this.getRoom(roomId);
    if (!room || room.getCurrentPlayer().name !== by || room.lastDice !== 6) return;

    this.clearRoomTimeout(roomId);
    this.io.to(roomId).emit(PIECE_UNLOCKED, { id });
    this.setTurnTimeout(roomId, by);
  }

  handleMovePiece(id, by) {
    const roomId = this.getRoomIdByUsername(by);
    if (!roomId) return;
    const room = this.getRoom(roomId);
    if (!room || room.getCurrentPlayer().name !== by) return;
    this.io.to(roomId).emit(PIECE_MOVED, { id, dice: room.lastDice });
  }
  handleCutPiece(pieceId, by) {
    const roomId = this.getRoomIdByUsername(by);
    if (!roomId) return;
    const room = this.getRoom(roomId);
    if (!room) return;
    socket.to(roomId).emit("PIECE_CUTED", { pieceId });
  }

  handleFinishedMove(by) {
    const roomId = this.getRoomIdByUsername(by);
    if (!roomId) return;
    const room = this.getRoom(roomId);
    if (!room) return;

    this.clearRoomTimeout(roomId);
    this.changeTurn(roomId);
  }

  handleDisconnect(username) {
    const roomId = this.removePlayerFromRoom(username);
    if (!roomId) return;

    const room = this.getRoom(roomId);

    if (!room || room.players.length === 0) {
      this.clearRoomTimeout(roomId);
      delete this.rooms[roomId];
    }
  }

  changeTurn(roomId, forceChange = false) {
    const room = this.getRoom(roomId);
    if (!room) return;
    const currentPlayer = room.getCurrentPlayer();
    const hasBonus = !forceChange && room.lastDice === 6;

    if (!hasBonus) {
      room.nextTurn();
      const newPlayer = room.getCurrentPlayer();
      this.io.to(roomId).emit(TURN_CHANGED, {
        to: newPlayer.name,
        from: currentPlayer.name,
        hasBonus: false
      });
    } else {
      this.io.to(roomId).emit(TURN_CHANGED, {
        to: currentPlayer.name,
        from: currentPlayer.name,
        hasBonus: true
      });
      this.setTurnTimeout(roomId, currentPlayer.name);
    }
  }

  setTurnTimeout(roomId, username) {
    const timeoutId = setTimeout(() => {
      const room = this.getRoom(roomId);
      if (room?.getCurrentPlayer().name === username) {
        this.changeTurn(roomId, true);
      }
      this.skipTurnTimeouts.delete(roomId);
    }, 10000);
    this.skipTurnTimeouts.set(roomId, timeoutId);
  }

  clearRoomTimeout(roomId) {
    clearTimeout(this.skipTurnTimeouts.get(roomId));
    this.skipTurnTimeouts.delete(roomId);
  }

  removePlayerFromRoom(username) {
    const roomId = this.getRoomIdByUsername(username);
    if (!roomId) return null;

    const room = this.getRoom(roomId);
    if (!room) return null;

    const index = room.players.findIndex(p => p.name === username);
    if (index !== -1) {
      room.players.splice(index, 1);
      if (room.currentTurnIndex >= room.players.length) {
        room.currentTurnIndex = 0;
      }
    }

    return roomId;
  }
}
