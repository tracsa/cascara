<template>
  <div>
    <hero v-if="execution.loading"
      icon="spinner"
      title="commons.loading"
      spin
    />
    <div v-else-if="execution.error"
      class="text-center my-2"
    >
      <icon :icon="['fas', 'times']"/>
      <span class="ml-1">Error al cargar flujo de autorización</span>
    </div>

    <div
      v-else-if="execution.data"
    >
      <app-execution-card
        :execution="execution.data"
        :show-detail="true"
        v-on:click-username="$emit('click-username', $event);"
      />

      <hr class="my-4"/>

      <div
        v-if="execution.data.status !== 'ongoing'"
      >
        <div class="card text-white shadow"
          :class="{
            'bg-success': execution.data.status === 'finished',
            'bg-danger': execution.data.status === 'cancelled',
          }"
        >
          <div class="card-body text-center py-2">
            <b>
              <span v-if="execution.data.status === 'cancelled'"
              >Flujo cancelado</span>
              <span v-else-if="execution.data.status === 'finished'"
              >Flujo finalizado</span>
            </b>
            <br/>
            <span>{{ execution.started_at|fmtDate('LLLL') }}</span>
          </div>
        </div>

        <div
          class="text-center py-2"
        >
          <icon :icon="['fas', 'arrow-alt-circle-up']"/>
        </div>
      </div>

      <hero v-if="pointers.loading"
        icon="spinner"
        title="commons.loading"
        spin
      />
      <div v-else-if="pointers.error"
        class="text-center my-2"
      >
        <icon :icon="['fas', 'times']"/>
        <span class="ml-1">Error al cargar linea de tiempo</span>
      </div>

      <div
        v-else
      >
        <div
          v-for="item in pointers.data" :key="item.id"
        >
          <app-pointer-card
            :pointer='item'
            :show-detail="true"
            v-on:complete="$emit('complete', item.id), reloadExecution()"
            v-on:click-username="$emit('click-username', $event);"
          />

          <div
            class="text-center py-2"
          >
            <icon :icon="['fas', 'arrow-alt-circle-up']"/>
          </div>
        </div>

        <div class="card text-white bg-info shadow">
          <div class="card-body text-center py-2">
            <b>Flujo iniciado</b>
            <br/>
            <span>{{ execution.data.started_at|fmtDate('LLLL') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';

import { EventBus } from '../../event-bus';

export default {
  props: {
    executionId: {
      required: true,
    },
  },

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },

  data() {
    return {
      execution: {
        data: null,
        loading: false,
        error: false,
      },

      recentExecution: {
        loading: false,
        error: false,
      },

      pointers: {
        data: [],
        loading: false,
        error: false,
        totalCount: 0,
      },

      recentPointers: {
        loading: false,
        error: false,
      },
    };
  },

  methods: {
    handleMessage(msg) {
      if (this.execution && this.execution.data && msg.execution_id === this.execution.data.id) {
        this.reloadExecution();
      }
    },

    reloadExecution: _.debounce(function reloadExecution() {
      const vm = this;
      const executionId = vm.execution.data.id;

      vm.recentExecution.loading = true;
      vm.recentExecution.error = false;

      vm.$executionService.getExecution(executionId)
        .then((exe) => {
          vm.execution.data = exe;
          vm.recentExecution.loading = false;
          vm.fetchRecentPointers();
        }).catch(() => {
          vm.recentExecution.loading = false;
          vm.recentExecution.error = true;
        });
    }, 250),

    fetchExecution: _.debounce(function fetchExecution(executionId) {
      const vm = this;

      vm.execution.loading = true;
      vm.execution.error = false;

      vm.$executionService.getExecution(executionId)
        .then((exe) => {
          vm.execution.data = exe;
          vm.execution.loading = false;

          vm.fetchPointers(executionId);
        }).catch(() => {
          vm.execution.loading = false;
          vm.execution.error = true;
        });
    }, 250),

    fetchPointers: _.debounce(function fetchPointers(executionId) {
      const vm = this;

      vm.pointers.loading = true;
      vm.pointers.error = false;

      vm.$pointerService.getPointers({
        executionIds: [executionId],
        onlyUserAndPatch: true,
        limit: 100,
      })
        .then(({ items, totalCount }) => {
          vm.pointers.loading = false;
          vm.pointers.data = items;
          vm.pointers.totalCount = totalCount;
        })
        .catch(() => {
          vm.pointers.loading = false;
          vm.pointers.error = true;
        });
    }, 250),

    fetchRecentPointers: _.debounce(function fetchRecentPointers() {
      const vm = this;
      const executionId = vm.execution.data.id;

      vm.recentPointers.loading = true;
      vm.recentPointers.error = false;

      vm.$pointerService.getPointers({
        executionIds: [executionId],
        onlyUserAndPatch: true,
        limit: 100,
      }).then(({ items, totalCount }) => {
        vm.recentPointers.loading = false;
        vm.pointers.data = items;
        vm.pointer.totalCount = totalCount;
      }).catch(() => {
        vm.recentPointers.loading = false;
        vm.recentPointers.error = true;
      });
    }, 250),
  },

  mounted() {
    EventBus.$on('execution_update', this.handleMessage);
    EventBus.$on('execution_delete', this.handleMessage);
    EventBus.$on('execution_patch', this.handleMessage);
  },

  beforeDestroy() {
    EventBus.$off('execution_update', this.handleMessage);
    EventBus.$off('execution_delete', this.handleMessage);
    EventBus.$off('execution_patch', this.handleMessage);
  },

  watch: {
    executionId: {
      handler(newVal) {
        const vm = this;
        vm.fetchExecution(newVal);
      },
      immediate: true,
    },
  },
};
</script>
