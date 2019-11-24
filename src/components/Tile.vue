<template>
    <div class="tile full-width full-height relative-position"
         :data-bomb="tile.bomb"
         :data-marked="tile.marked"
         :data-adjacent="tile.bomb ? null : tile.adjacentBombs"
         :class="{revealed: tile.revealed}"
         :style="style"
         @mouseenter="hover = true"
         @mouseleave="hover = false"
         @click.left.exact="onLeftClick"
         @click.alt="onRevealClick"
         @click.meta="onRevealClick">
    </div>
</template>

<script>
import { MinesweeperTile, TILE_SIZE } from '../game/Minesweeper';

export default {
  name: 'Tile',
  props: {
    tile: {
      type: MinesweeperTile,
      required: true
    }
  },
  computed: {
    style () {
      const colors = [
        'black',
        'blue',
        'green',
        'red',
        'dark-blue',
        'purple',
        'pink',
        'brown'
      ];
      return {
        color: colors[this.tile.adjacentBombs],
        gridRow: this.tile.y + 1,
        gridColumn: this.tile.x + 1,
        width: `${TILE_SIZE}px !important`,
        height: `${TILE_SIZE}px !important`
      };
    }
  },
  methods: {
    onLeftClick () {
      this.$emit('reveal', this.tile);
    },
    onRevealClick () {
      this.$emit('mark', this.tile);
    }
  }
};
</script>

<style lang="scss" scoped>
    .tile {
        transition: box-shadow .2s;
        background-color: $grey-4;
        font-size: 18px;
        cursor: pointer;
        border: 3px solid white;
        border-right-color: $grey-6;
        border-bottom-color: $grey-6;

        &:before {
            position: absolute;
            line-height: 1em;
            padding-top: calc(50% - .5em);
            width: 30px;
            height: 30px;
            text-align: center;
            font-weight: 900;
        }

        &[data-marked]:before {
            content: '🏴‍☠️';
        }

        &.revealed {
            border-width: 1px;
            border-color: $grey-5;
            cursor: unset;

            &[data-bomb]:before {
                background-color: $negative;
                content: '💣';
            }

            &[data-adjacent]:before {
                content: attr(data-adjacent);
            }

        }
    }
</style>