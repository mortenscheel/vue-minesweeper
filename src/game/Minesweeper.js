export const CREATED = 0;
export const INITIALIZED = 1;
export const PLAYING = 2;
export const WON = 3;
export const DEAD = 4;

export const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default class Minesweeper {
  /** @type {Number} */
  width;
  /** @type {Number} */
  height;
  /** @type {MinesweeperTile[]} */
  tiles;
  /** @type {Number} */
  tileCount;
  /** @type {Number} */
  bombCount;
  /** @type {Number} */
  state;

  constructor (width, height, bombCount) {
    this.width = width;
    this.height = height;
    this.tileCount = width * height;
    this.bombCount = bombCount;
    this.state = CREATED;
    this.initTiles();
  }

  initTiles () {
    let tiles = new Array(this.tileCount);
    for (let i = 0; i < tiles.length; i++) {
      const coord = this.getCoordinate(i);
      tiles[i] = new MinesweeperTile(coord.x, coord.y, i);
    }
    let bombsPlaced = 0;
    while (bombsPlaced < this.bombCount) {
      const idx = randomIntegerInRange(0, this.tileCount - 1);
      if (!tiles[idx].bomb) {
        tiles[idx].bomb = true;
        bombsPlaced++;
      }
    }
    this.tiles = tiles;
    this.tiles = tiles.map(tile => {
      tile.adjacentBombs = this.countAdjacentBombs(tile) || null;
      return tile;
    });
    this.state = INITIALIZED;
  }

  isGameWon () {
    // All unrevealed tiles must be bombs
    return this.tiles.filter(tile => !tile.revealed)
      .every(tile => tile.bomb);
  }

  revealTileRecursive (tile) {
    tile.revealed = true;
    if (tile.bomb) {
      this.state = DEAD;
      return;
    }
    // Only recurse if adjacent marks is equal to adjacent bombs
    const neighbors = this.getNeighbors(tile);
    const marks = neighbors.reduce((result, tile) => {
      if (tile.marked) {
        result++;
      }
      return result;
    }, 0);
    const recurse = !tile.adjacentBombs || marks === tile.adjacentBombs;
    if (recurse) {
      this.getNeighbors(tile).forEach(neighbor => {
        if (!neighbor.revealed && !neighbor.bomb) {
          if (!neighbor.adjacentBombs) {
            this.revealTileRecursive(neighbor);
          } else {
            neighbor.revealed = true;
          }
        }
      });
    }
    if (this.isGameWon()) {
      this.state = WON;
    }
  }

  markTile (tile) {
    if (!tile.revealed) {
      tile.marked = !tile.marked;
    }
  }

  start () {
    this.state = PLAYING;
  }

  getTileAt (x, y) {
    return this.tiles[this.getIndex(x, y)];
  }

  getIndex (x, y) {
    return y * this.width + x;
  }

  getCoordinate (index) {
    const x = index % this.width;
    const y = Math.floor(index / this.width);
    return { x, y };
  }

  countAdjacentBombs (tile) {
    return this.getNeighbors(tile).reduce((result, tile) => {
      if (tile.bomb) {
        result++;
      }
      return result;
    }, 0);
  }

  markedCount () {
    return this.tiles.reduce((result, tile) => {
      if (tile.marked) {
        result++;
      }
      return result;
    }, 0);
  }

  getNeighbors (tile) {
    const neighbors = [];
    const { x, y } = tile;
    const up = y > 0;
    const down = y < this.height - 1;
    const left = x > 0;
    const right = x < this.width - 1;
    if (up && left) {
      neighbors.push(this.getTileAt(x - 1, y - 1));
    }
    if (up) {
      neighbors.push(this.getTileAt(x, y - 1));
    }
    if (up && right) {
      neighbors.push(this.getTileAt(x + 1, y - 1));
    }
    if (right) {
      neighbors.push(this.getTileAt(x + 1, y));
    }
    if (down && right) {
      neighbors.push(this.getTileAt(x + 1, y + 1));
    }
    if (down) {
      neighbors.push(this.getTileAt(x, y + 1));
    }
    if (down && left) {
      neighbors.push(this.getTileAt(x - 1, y + 1));
    }
    if (left) {
      neighbors.push(this.getTileAt(x - 1, y));
    }
    if (neighbors.some(tile => !tile)) {
      debugger;
    }
    return neighbors;
  }
}

export class MinesweeperTile {
  /** @type {Number} */
  x;
  /** @type {Number} */
  y;
  /** @type {Number} */
  index;
  /** @type {Boolean} */
  bomb;
  /** @type {Boolean} */
  revealed;
  /** @type {Boolean} */
  marked;
  /** @type {Number} */
  adjacentBombs;

  constructor (x, y, index) {
    this.index = index;
    this.x = x;
    this.y = y;
    this.bomb = false;
    this.revealed = false;
    this.marked = false;
  }
}
