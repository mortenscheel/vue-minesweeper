<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated class="bg-white text-grey-10 absolute">
            <q-toolbar>
                <q-btn
                        flat
                        round
                        dense
                        icon="mdi-settings"
                        @click="drawer = !drawer"/>
                <q-space />
                <div class="text-h6 flex items-center">
                    <q-icon class="q-mr-sm" :name="stateIcon" />
                    {{ title }}
                </div>
                <q-space />
                <div v-if="gameState">💣 {{ markedCount }} / {{ bombCount }}</div>
            </q-toolbar>
        </q-header>
        <q-drawer
                v-model="drawer"
                side="left"
                bordered
                content-class="bg-white">
            <q-item-label header>
                Game settings
            </q-item-label>
            <div class="column q-col-gutter-sm q-px-sm">
                <div class="col">
                    <div class="row q-col-gutter-sm">
                        <div class="col">
                            <q-input v-model.number="settings.width"
                                     filled
                                     type="number"
                                     label="Width"
                                     min="1"
                                     :max="maxCols"
                                     dense/>
                        </div>
                        <div class="col">
                            <q-input v-model.number="settings.height"
                                     filled
                                     type="number"
                                     label="Height"
                                     min="1"
                                     :max="maxRows"
                                     dense/>
                        </div>
                    </div>
                </div>
                <div class="col col-shrink">
                    <q-input v-model.number="settings.bombs"
                             filled
                             type="number"
                             label="Bomb count"
                             min="1"
                             dense/>
                </div>
                <div class="col col-shrink">
                    <q-btn color="positive" unelevated class="full-width" label="start" @click="createGame()"/>
                </div>
            </div>
        </q-drawer>
        <q-page-container>
            <q-page class="flex flex-center bg-grey-1" padding>
                <board ref="board" v-if="gameState" :width="game.width" :height="game.height">
                    <template v-slot:tile="{x,y}">
                        <tile :tile="game.getTileAt(x - 1, y - 1)"
                              :class="tileClasses"
                              @reveal="revealTile"
                              @mark="markTile"/>
                    </template>
                </board>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script>
import Board from './Board';
import Tile from './Tile';
import Minesweeper, { DEAD, PLAYING, TILE_SIZE, WON } from '../game/Minesweeper';

export default {
  name: 'Game',
  components: { Tile, Board },
  data () {
    return {
      drawer: false,
      game: null,
      settings: {
        width: 11,
        height: 10,
        bombs: 10
      },
      started: null,
      elapsed: null,
      timer: null
    };
  },
  computed: {
    title () {
      switch (this.gameState) {
        case PLAYING:
          return `${this.elapsed}s`;
        case WON:
          return `Finished in ${this.elapsed}s`;
        case DEAD:
          return `Game over after ${this.elapsed}s`;
        default:
          return 'Click to begin';
      }
    },
    gameState () {
      if (!this.game) {
        return null;
      }
      return this.game.state;
    },
    markedCount () {
      if (!this.game) {
        return 0;
      }
      return this.game.markedCount();
    },
    bombCount () {
      if (!this.game) {
        return 0;
      }
      return this.game.bombCount;
    },
    stateIcon () {
      switch (this.gameState) {
        case PLAYING:
          return `mdi-timer`;
        case WON:
          return `mdi-check-bold`;
        case DEAD:
          return 'mdi-skull';
        default:
          return 'mdi-timer-sand';
      }
    },
    maxRows () {
      return Math.floor((this.$q.screen.height - 50 - 32) / TILE_SIZE);
    },
    maxCols () {
      return Math.floor(this.$q.screen.width / TILE_SIZE);
    },
    tileClasses () {
      return {
        'cursor-not-allowed': [DEAD, WON].indexOf(this.gameState) !== -1
      };
    }
  },
  watch: {
    'game.state' (state) {
      switch (state) {
        case PLAYING:
          this.startTimer();
          break;
        case WON:
        case DEAD:
          this.stopTimer();
          break;
      }
    }
  },
  created () {
    // Create initial game according to screen size
    const width = Math.floor(this.maxCols * 0.8);
    const height = Math.floor(this.maxRows * 0.8);
    const bombs = Math.floor((width * height) / 8);
    this.settings = { width, height, bombs };
    this.createGame();
  },
  methods: {
    revealTile (tile) {
      if (!this.started) {
        this.startGame();
      }
      this.game.revealTileRecursive(tile);
    },
    markTile (tile) {
      if (!this.started) {
        this.startGame();
      }
      if (this.game.markedCount() < this.game.bombCount) {
        this.game.markTile(tile);
      }
    },
    createGame () {
      this.game = new Minesweeper(this.settings.width, this.settings.height, this.settings.bombs);
      this.started = null;
      this.elapsed = null;
      if (this.timer) {
        this.stopTimer();
      }
      global.game = this.game;
    },
    startTimer () {
      this.started = Date.now();
      this.timer = setInterval(() => {
        this.updateElapsed();
      }, 100);
      this.updateElapsed();
    },
    stopTimer () {
      clearInterval(this.timer);
      this.timer = null;
    },
    updateElapsed () {
      const ms = Date.now() - this.started;
      this.elapsed = Number(ms / 1000).toFixed(1);
    },
    startGame () {
      this.game.start();
    }
  }

};
</script>

<style scoped>

</style>
