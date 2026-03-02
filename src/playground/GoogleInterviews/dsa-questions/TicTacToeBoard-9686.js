class TicTacToeBoard{
    constructor(n, players, k=3){
        this.playersCount = players.length
        this.n = n
        this.k = k
        this.players = players
        if(this.playersCount < 2) throw new Error("No.of Players are not sufficient")
        if(n<3) throw new Error("Grid size is not sufficient")
        
        this.grid = Array.from({length: n}, ()=> Array(n).fill(null))

        this.rows = Array.from({length: n}, ()=> Array(this.playersCount).fill(0))
        this.cols = Array.from({length: n}, ()=> Array(this.playersCount).fill(0))
        this.diags = Array(this.playersCount).fill(0)
        this.antiDiags = Array(this.playersCount).fill(0)

        this.totalMoves = 0
        this.currentPlayerIndex = 0

        this.playersMap = new Map() // { player, index}
        this.players.forEach((p, i)=>{
            this.playersMap.set(p, i)
        })

        this.gameOver = false
        this.winner = null
    }

    _countDir(row, col, pId, dr, dc) {
        let r = row + dr, c = col + dc;
        let count = 0
    
        while (
          r >= 0 && r < this.n &&
          c >= 0 && c < this.n &&
          this.grid[r][c] === pId
        ) {
          count++
          r += dr
          c += dc
        }
        return count
    }

    _isWonForNBoard(row, col, pId){
        return (
            this.rows[row][pId] === this.n ||
            this.cols[col][pId] === this.n ||
            this.diags[pId] === this.n ||
            this.antiDiags[pId] === this.n
        )
    }

    _isWonForKBoard(row, col, pId){
        const dirs = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diag
            [1, -1],  // anti-diag
        ]
    
        for (const [dr, dc] of dirs) {
            const streak = 1 + this._countDir(row, col, pId, dr, dc) + this._countDir(row, col, pId, -dr, -dc) // 1 + count(ForwardDirn) + count(BackwardDirn) 
            if (streak >= this.k) return true
        }
        return false
    }

    play(player, row, col){
        if(this.gameOver || this.winner) return "Game Over!"

        if(!this.playersMap.has(player)) throw new Error("Player doesnt exist")
        if(this.currentPlayerIndex !== this.playersMap.get(player)) return "Not this player's turn"

        if(row<0 || row>= this.n || col<0 || col>= this.n) throw new Error("Invalid move")

        if(this.grid[row][col] !== null) return "Position is already taken"

        const playerIndex = this.playersMap.get(player)
        this.grid[row][col] = playerIndex
        this.totalMoves++

        this.rows[row][playerIndex]++
        this.cols[col][playerIndex]++
        if(row === col) this.diags[playerIndex]++
        if(row+col === this.n-1) this.antiDiags[playerIndex]++
        
        const isWon = this.k === this.n ? this._isWonForNBoard(row, col, playerIndex) : this._isWonForKBoard(row, col, playerIndex)
        if(isWon) {
            this.gameOver = true
            this.winner = player    
            return `Game Over, ${player} Won`
        }

        if(this.totalMoves === this.n ** 2) {
            this.gameOver = true
            return "Game Over, Draw!"
        }

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.playersCount

        return `Moved, now it's ${this.players[this.currentPlayerIndex]} turn`
    }

    snapshot() {
        return {
          n: this.n,
          k: this.k,
          players: this.players,
          currentPlayer: this.players[this.currentPlayerIndex],
          totalMoves: this.totalMoves,
          gameOver: this.gameOver,
          winner: this.winner,
          grid: this.grid,
        }
    }
}

class GameManager {
    constructor() {
      this.games = new Map() // gameId -> TicTacToeGame
      this.nextId = 1
    }
  
    createGame({ n, players, k = 3 }) {
      const gameId = String(this.nextId++)
      const game = new TicTacToeBoard(n, players, k)
      this.games.set(gameId, game)
      return gameId
    }
  
    getGame(gameId) {
      const game = this.games.get(gameId)
      if (!game) throw new Error("Game not found")
      return game
    }
  
    playMove(gameId, player, row, col) {
      const game = this.getGame(gameId)
      return game.play(player, row, col)
    }
  
    getState(gameId) {
      return this.getGame(gameId).snapshot()
    }
  
    deleteGame(gameId) {
      this.games.delete(gameId)
    }
}

const gm = new GameManager();

// game 1: classic 3x3, k=3
const g1 = gm.createGame({ n: 3, players: ["X", "O"], k: 3 });

// game 2: 5x5, win with 4 in a row
const g2 = gm.createGame({ n: 5, players: ["A", "B", "C"], k: 4 });

console.log("g1:", gm.playMove(g1, "X", 0, 0));
console.log("g2:", gm.playMove(g2, "A", 2, 2));

console.log("g1:", gm.playMove(g1, "O", 1, 1));
console.log("g2:", gm.playMove(g2, "B", 0, 0));

console.log("g1 state:", gm.getState(g1));
console.log("g2 state:", gm.getState(g2));