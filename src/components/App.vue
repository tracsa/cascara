<template>
  <div class="h-100">
    <app-header />

    <b-alert
      variant="danger"
      class="w-25 mx-auto text-center"
      v-model="showAlert"
    >
      <icon :icon="['fas', 'plug']"/>
      {{ $t('commons.offline') }}
    </b-alert>

    <router-view />
  </div>
</template>

<script>
import { EventBus } from '../event-bus';

export default {
  data() {
    return {
      online: true,
      showAlert: false,
      sseClient: null,
      sse: { cleanup: true },
    };
  },

  mounted() {
    const vm = this;

    if (process.env.SSE_ENABLED) {
      vm.sseClient = vm.$sse.create({
        format: 'json',
        polyfill: true,
        url: `${process.env.CACAHUATE_URL}/stream`,
        withCredentials: false,
      });

      vm.sseClient.on('error', () => {
        vm.online = false;
        vm.showAlert = true;
      });

      vm.sseClient.on('execution_update', this.handleUpdate);
      vm.sseClient.on('execution_delete', this.handleDelete);
      vm.sseClient.on('execution_patch', this.handlePatch);
      vm.sseClient.on('execution_create', this.handleCreate);

      vm.sseClient.connect().then(() => {
        vm.online = true;
        vm.showAlert = false;
      }).catch(() => {
        vm.online = false;
        vm.showAlert = true;
      });
    }
  },

  methods: {
    handleUpdate(evt) {
      EventBus.$emit('execution_update', evt);
    },
    handleDelete(evt) {
      EventBus.$emit('execution_delete', evt);
    },
    handlePatch(evt) {
      EventBus.$emit('execution_patch', evt);
    },
    handleCreate(evt) {
      EventBus.$emit('execution_create', evt);
    },
  },

  beforeDestroy() {
    if (this.sseClient) {
      this.sseClient.disconnect();
    }
  },
};
</script>
