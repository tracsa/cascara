<template>
  <div>
    <b-nav
      class="mb-2"
      vertical
      pills
    >
      <b-nav-item
        href="#"
        v-on:click.prevent="$emit('click-feed', item.value)"
        v-for="(item, index) in searchOptions"
        :key="index"
        :active="item.value === selectedSearch"
      >{{ item.label }}</b-nav-item>
    </b-nav>
  </div>
</template>

<script>
export default {
  props: {
    selectedSearch: {
      type: String,
    },
    searchOptions: {
      type: Array,
      required: true,
    },
  },
};
</script>
