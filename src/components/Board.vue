<template>
    <q-card class="board bg-grey-2 q-mx-auto non-selectable" :style="style">
        <template v-for="y in height">
            <template v-for="x in width">
                <slot name="tile" v-bind:x="x" v-bind:y="y" />
            </template>
        </template>
    </q-card>
</template>

<script>

export default {
  name: 'Board',
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    size: {
      type: Number,
      required: true
    }
  },
  computed: {
    style () {
      return {
        width: `${this.width * this.size}px`,
        height: `${this.height * this.size}px`
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.board{
    display: grid;
}
</style>
