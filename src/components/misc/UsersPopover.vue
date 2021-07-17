<template>
  <b-popover
    triggers="click blur"
    placement="bottomleft"
    boundary="viewport"
    :target="target"
    :title="title"
  >
    <div>
      <div
        v-for="user in users"
        class="mt-2"
        :key="user.identifier"
      >
        <component
          href="#"
          :is="user.identifier ? 'a' : 'span'"
          v-on:click.prevent="handleUsernameClick(user.identifier)"
        >
          <icon :icon="['fa', 'user']" class="mr-1"/>
          <b>{{ user.fullname }}</b>
        </component>

        <br/>
        <a :href="'mailto:' + user.email"
          v-if="user.email"
        >{{ user.email }}</a>
      </div>
    </div>
  </b-popover>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    target: {
      type: String,
      required: true,
    },
  },

  methods: {
    handleUsernameClick(username) {
      if (username) {
        this.$emit('click-username', username);
      }
    },
  },
};
</script>
