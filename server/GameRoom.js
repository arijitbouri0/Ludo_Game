export class GameRoom {
  players = [];
  maxPlayers;
  currentTurnIndex = 0;
  isGameStarted = false;
  lastDice = null;

  constructor(maxPlayers) {
    this.maxPlayers = maxPlayers;
  }

  addPlayer(player) {
    this.players.push(player); 
  }

  isFull() {
    return this.players.length >= this.maxPlayers;
  }

  startGame() {
    if (this.isFull()) {
      this.isGameStarted = true;
    }
  }

  getCurrentPlayer() {
    return this.players[this.currentTurnIndex];
  }

  nextTurn() {
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
  }

  setLastDice(value) {
    this.lastDice = value;
  }

  getLastDice() {
    return this.lastDice;
  }

  removePlayerByName(name) {
    const index = this.players.findIndex((p) => p.name === name);
    if (index !== -1) {
      this.players.splice(index, 1);
      if (this.currentTurnIndex >= this.players.length) {
        this.currentTurnIndex = 0;
      }
      return true;
    }
    return false;
  }
}
