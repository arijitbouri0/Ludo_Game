// RoomManager.ts
import { v4 as uuidv4 } from 'uuid';
import { GameRoom } from './GameRoom.js';

class RoomManager {
    rooms = {};
    createRoom(playerCount) {
        const roomId = uuid(); // unique ID
        this.rooms[roomId] = new GameRoom(playerCount);
        return roomId;
    }

    joinRoom(roomId, playerInfo) {
        const room = this.rooms[roomId];
        if (room && !room.isFull()) {
            room.addPlayer(playerInfo);
            return true;
        }
        return false;
    }
    getRoom(roomId) {
        return this.rooms[roomId];
    }

    removePlayerFromRoom(playerName) {
        for (const [roomId, room] of Object.entries(this.rooms)) {
            const index = room.players.findIndex((p) => p.name === playerName);
            if (index !== -1) {
                room.players.splice(index, 1);
                if (room.players.length === 0) {
                    delete this.rooms[roomId];
                }
                return roomId;
            }
        }
        return null;
    }

    getRoomIdByUsername(username) {
        for (const [roomId, room] of Object.entries(this.rooms)) {
            if (room.players.some((p) => p.name === username)) {
                return roomId;
            }
        }
        return null;
    }
}

function uuid() {
    return uuidv4();
}

export const roomManager = new RoomManager();