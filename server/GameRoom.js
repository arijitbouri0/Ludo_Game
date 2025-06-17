export class GameRoom {
  constructor(maxPlayers) {
    this.players = [];
    this.maxPlayers = maxPlayers;
    this.currentTurnIndex = 0;
    this.isGameStarted = false;
    this.lastDice = null;
    this.skipTurnTimeout = null;
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
    return this.getCurrentPlayer();
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

  cleanup() {
    if (this.skipTurnTimeout) {
      clearTimeout(this.skipTurnTimeout);
      this.skipTurnTimeout = null;
    }
  }
}