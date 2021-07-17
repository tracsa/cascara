<template>
  <div
    class="container-fluid p-0"
    style="max-width: 1270px;"
    ref="inboxTop"
  >
    <div class="row no-gutters"
      v-if="!showRight"
    >
      <div class="col">
        <slot name="top">
          <div class="px-3 py-2 text-center">
            <h3>{{ title }}</h3>
            <p>{{ description }}</p>
          </div>
          <hr/>

        </slot>
      </div>
    </div>

    <div class="row no-gutters">
      <div v-if="showLeft"
        :class="{
          'col-2': showRight,
          'col-3': !showRight,
          'pr-2': showCenter,
        }"
      >
        <slot name="left">
          <app-inbox-sidebar
            :selected-search="feed"
            v-on:click-feed="selectFeed($event)"
          />
        </slot>
      </div>

      <div v-if="showCenter"
        :class="{
          'col-3': showLeft && showRight,
          'col-4': !showLeft && showRight,
          'col-9': showLeft && !showRight,
          'col-12': !showLeft && !showRight,
          'pl-2': showLeft,
          'pr-2': showRight,
        }"
      >
        <slot name="center">
          <div class="container-fluid p-0">
            <div class="row no-gutters mb-3">
              <div class="col">
                <b-card>
                  <div>Buscar en <b>"{{ title }}"</b></div>

                  <hr/>

                  <app-inbox-search-card
                    :fixed-args="fixedPayload"
                    v-model="searchForm"
                    v-on:submit="submitForm"
                  />
                </b-card>
              </div>
            </div>

            <hero v-if="listItems.loading"
              icon="spinner"
              title="commons.loading"
              spin
            />
            <div v-else-if="listItems.error"
              class="text-center my-2"
            >
              <icon :icon="['fas', 'times']"/>
              <span class="ml-1">Error al cargar elementos</span>
            </div>

            <div
              v-else
            >
              <div class="row no-gutters mb-3"
                v-if="!listItems.data.length"
              >
                <div class="col">
                  <h4 class="text-center">No hay elementos para mostrar</h4>
                </div>
              </div>
              <div v-else>
                <div class="col text-right">
                  <span>Mostrando <b>{{ listItems.data.length }}</b>
                  de <b>{{ listItems.totalCount }}</b></span>
                </div>
              </div>

              <div class="row no-gutters mb-3"
                v-for="item in listItems.data"
                :key="item.id"
              >
                <div class="col">
                  <component
                    :is="itemComponent(item)"
                    :execution='item'
                    :pointer='item'
                    :show-execution='true'
                    :show-detail="!showRight"
                    :load-if-doable="false"
                    v-on:complete="reloadPointer(item.id)"
                    v-on:click-execution="selectExecution($event);"
                    v-on:click-username="selectUser($event);"
                  >
                    <template v-slot:content
                      v-if="item.execution && item.execution.id"
                    >
                      <timeline-summary
                        :execution-id="item.execution.id"
                      />
                    </template>
                  </component>
                </div>
              </div>

              <hero v-if="olderItems.loading"
                icon="spinner"
                title="commons.loading"
                spin
              />
              <div class="row no-gutters mb-3"
                v-else-if="listItems.data.length < listItems.totalCount"
              >
                <div class="col">
                  <button
                    type="button"
                    class="btn btn-primary w-100"
                    @click="loadMore"
                  >Cargar más</button>
                </div>
              </div>
            </div>
          </div>
        </slot>
      </div>

      <div v-if="showRight"
        :class="{
          'col-7': showLeft && showCenter,
          'col-8': !showLeft && showCenter,
          'col-12': !showLeft && !showCenter,
          'pl-2': showCenter,
        }"
      >
        <slot name="right">

          <div>
            <h3
              class="text-center"
            >Flujo de autorizacion</h3>

            <div
              class="text-right my-2"
            >
              <a
                href="#"
                v-on:click.prevent="selectExecution()"
              >
                <icon :icon="['fas', 'arrow-circle-left']"/>
                <span class="ml-1">Volver al buscador</span>
              </a>
            </div>

            <app-inbox-execution-timeline
              :execution-id="executionId"
              v-on:complete="reloadPointer($event)"
              v-on:click-username="selectUser($event);"
            />
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';

import { EventBus } from '../event-bus';

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    feed: {
      type: String,
      required: true,
    },
    executionId: String,
    query: String,
    notified: Array,
    actored: Array,
    fixedPayload: Object,
    payload: Object,
  },

  data() {
    return {
      baseForm: {
        searchText: '',
        objType: 'execution',
        pointerStatus: ['ongoing', 'finished', 'cancelled'],
        executionStatus: ['ongoing', 'finished', 'cancelled'],
        minDate: null,
        maxDate: null,
        searchUsers: false,
        notifiedUsers: null,
        actoredUsers: null,
      },

      searchForm: null, // built based on prop

      listItems: {
        data: [],
        loading: false,
        error: false,
        totalCount: 0,
      },

      recentItems: {
        loading: false,
        error: false,
      },

      olderItems: {
        loading: false,
        error: false,
      },
    };
  },

  computed: {
    showLeft() {
      return (
        (this.showRight === false && (this.$mq === 'md' || this.$mq === 'lg')) ||
        (this.showRight === true && (this.$mq === 'lg'))
      );
    },

    showCenter() {
      return (
        this.showRight === false ||
        (this.showRight === true && (this.$mq === 'md' || this.$mq === 'lg'))
      );
    },

    showRight() {
      return !!this.executionId;
    },
  },

  methods: {
    handleMessage() {
      this.loadRecent();
    },

    handleSelectSearch: _.debounce(function handleSelectSearch(form) {
      const vm = this;
      vm.searchForm = form;

      vm.listItems.data = [];
      vm.listItems.loading = true;
      vm.listItems.error = false;

      const payload = {
        ...vm.searchForm,
      };

      if (payload.minDate) {
        payload.minDate = moment(payload.minDate).toISOString();
      }

      if (payload.maxDate) {
        payload.maxDate = moment(payload.maxDate).add(1, 'days').toISOString();
      }

      let serviceCallback = null;
      if (payload.objType === 'pointer') {
        serviceCallback = vm.$pointerService.getPointers;
      } else if (payload.objType === 'execution') {
        serviceCallback = vm.$executionService.getExecutions;
      }

      serviceCallback(payload)
        .then(({ items, totalCount }) => {
          const currentItems = vm.listItems.data.map(x => x.id);
          items.forEach((x) => {
            if (!currentItems.includes(x.id)) {
              vm.listItems.data.push(x);
            }
          });

          vm.listItems.data.sort((a, b) => {
            const dateA = moment(a.started_at);
            const dateB = moment(b.started_at);

            if (dateA < dateB) { return 1; }
            if (dateA > dateB) { return -1; }
            return 0;
          });

          vm.listItems.totalCount = totalCount;
          vm.listItems.loading = false;
        }).catch(() => {
          vm.listItems.loading = false;
          vm.listItems.error = true;
        });
    }, 250),

    reloadPointer: _.debounce(function reloadPointer(ptrId) {
      const vm = this;
      vm.$pointerService.getPointer(ptrId)
        .then((data) => {
          const index = vm.listItems.data
            .findIndex(x => x.id === ptrId);

          if (index >= 0) {
            vm.listItems.data.splice(index, 1, data);
          }
        }).catch(() => {
        });

      vm.loadRecent();
    }, 250),

    loadRecent: _.debounce(function loadRecent() {
      const vm = this;

      vm.recentItems.loading = true;
      vm.recentItems.error = false;

      const payload = {
        ...vm.searchForm,
      };

      if (payload.minDate && vm.listItems.data.length) {
        if (payload.minDate > vm.listItems.data[0]) {
          payload.minDate = moment(payload.minDate).toISOString();
        } else {
          payload.minDate = moment(vm.listItems.data[0].started_at).toISOString();
        }
      } else if (vm.listItems.data.length) {
        payload.minDate = moment(vm.listItems.data[0].started_at).toISOString();
      }

      if (payload.maxDate) {
        payload.maxDate = moment(payload.maxDate).add(1, 'days').toISOString();
      }

      let serviceCallback = null;
      if (payload.objType === 'pointer') {
        serviceCallback = vm.$pointerService.getPointers;
      } else if (payload.objType === 'execution') {
        serviceCallback = vm.$executionService.getExecutions;
      }

      serviceCallback(payload)
        .then(({ items }) => {
          const currentItems = vm.listItems.data.map(x => x.id);
          items.forEach((x) => {
            if (!currentItems.includes(x.id)) {
              vm.listItems.data.push(x);
              vm.listItems.totalCount += 1;
            }
          });

          vm.listItems.data.sort((a, b) => {
            const dateA = moment(a.started_at);
            const dateB = moment(b.started_at);

            if (dateA < dateB) { return 1; }
            if (dateA > dateB) { return -1; }
            return 0;
          });

          vm.recentItems.loading = false;
        }).catch(() => {
          vm.recentItems.loading = false;
          vm.recentItems.error = true;
        });
    }, 250),

    loadMore: _.debounce(function loadMore() {
      const vm = this;

      vm.olderItems.loading = true;
      vm.olderItems.error = false;

      const payload = {
        ...vm.searchForm,
      };

      if (payload.minDate) {
        payload.minDate = moment(payload.minDate).toISOString();
      }

      if (payload.maxDate && vm.listItems.data.length) {
        const listLength = vm.listItems.data.length;

        if (vm.listItems.data[listLength - 1] > payload.maxDate) {
          payload.maxDate = moment(payload.maxDate).add(1, 'days').toISOString();
        } else {
          payload.maxDate = moment(vm.listItems.data[listLength - 1].started_at).toISOString();
        }
      } else if (vm.listItems.data.length) {
        const listLength = vm.listItems.data.length;
        payload.maxDate = moment(vm.listItems.data[listLength - 1].started_at).toISOString();
      }

      let serviceCallback = null;
      if (payload.objType === 'pointer') {
        serviceCallback = vm.$pointerService.getPointers;
      } else if (payload.objType === 'execution') {
        serviceCallback = vm.$executionService.getExecutions;
      }

      serviceCallback(payload)
        .then(({ items }) => {
          const currentItems = vm.listItems.data.map(x => x.id);
          items.forEach((x) => {
            if (!currentItems.includes(x.id)) {
              vm.listItems.data.push(x);
            }
          });

          vm.listItems.data.sort((a, b) => {
            const dateA = moment(a.started_at);
            const dateB = moment(b.started_at);

            if (dateA < dateB) { return 1; }
            if (dateA > dateB) { return -1; }
            return 0;
          });

          vm.olderItems.loading = false;
        }).catch(() => {
          vm.olderItems.loading = false;
          vm.olderItems.error = true;
        });
    }, 250),

    itemComponent(obj) {
      // case execution
      const k = '_type';
      if (obj[k] === 'execution') {
        return 'app-execution-card';
      }
      // case pointer
      return 'app-pointer-card';
    },

    selectFeed(newFeed) {
      const newRoute = {
        name: this.$route.name,
        params: { ...this.$route.params },
        query: { ...this.$route.query },
      };

      newRoute.query.feed = newFeed;

      this.$router.push(newRoute);
    },

    selectExecution(newExecution) {
      const newRoute = {
        name: this.$route.name,
        params: { ...this.$route.params },
        query: { ...this.$route.query },
      };

      if (newExecution) {
        newRoute.query.exe = newExecution;

        const el = this.$refs.inboxTop;
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        delete newRoute.query.exe;
      }

      this.$router.push(newRoute);
    },

    selectUser(username) {
      const newRoute = {
        name: this.$route.name,
        params: { ...this.$route.params },
        query: { ...this.$route.query },
      };

      newRoute.query.feed = 'general';

      newRoute.query.objType = 'pointer';
      newRoute.query.searchUsers = true;
      newRoute.query.notifiedUsers = username;
      newRoute.query.actoredUsers = username;

      this.$router.push(newRoute);
    },

    submitForm(form) {
      this.searchForm = form;
      this.updateUrl(form);
      this.handleSelectSearch(form);
    },

    updateUrl(form) {
      const newRoute = {
        name: this.$route.name,
        params: { ...this.$route.params },
        query: { ...this.$route.query },
      };

      if (form.searchText) {
        newRoute.query.searchText = form.searchText;
      } else {
        delete newRoute.query.searchText;
      }

      if (form.objType) {
        newRoute.query.objType = form.objType;
      } else {
        delete newRoute.query.objType;
      }

      if (Array.isArray(form.pointerStatus)
        && form.pointerStatus.length) {
        newRoute.query.pointerStatus = form.pointerStatus.join(',');
      } else {
        delete newRoute.query.pointerStatus;
      }

      if (Array.isArray(form.executionStatus)
        && form.executionStatus.length) {
        newRoute.query.executionStatus = form.executionStatus.join(',');
      } else {
        delete newRoute.query.executionStatus;
      }

      if (form.minDate) {
        newRoute.query.minDate = form.minDate;
      } else {
        delete newRoute.query.minDate;
      }

      if (form.maxDate) {
        newRoute.query.maxDate = form.maxDate;
      } else {
        delete newRoute.query.maxDate;
      }

      if (form.searchUsers) {
        newRoute.query.searchUsers = form.searchUsers;
      } else {
        delete newRoute.query.searchUsers;
      }

      if (Array.isArray(form.actoredUsers)
        && form.actoredUsers.length) {
        newRoute.query.actoredUsers = form.actoredUsers.join(',');
      } else {
        delete newRoute.query.actoredUsers;
      }

      if (Array.isArray(form.notifiedUsers)
        && form.notifiedUsers.length) {
        newRoute.query.notifiedUsers = form.notifiedUsers.join(',');
      } else {
        delete newRoute.query.notifiedUsers;
      }

      Object.keys(this.fixedPayload).forEach((k) => {
        delete newRoute.query[k];
      });

      this.$router.push(newRoute);
    },
  },

  mounted() {
    EventBus.$on('execution_update', this.handleMessage);
    EventBus.$on('execution_delete', this.handleMessage);
    EventBus.$on('execution_patch', this.handleMessage);
    EventBus.$on('execution_create', this.handleMessage);
  },

  beforeDestroy() {
    EventBus.$off('execution_update', this.handleMessage);
    EventBus.$off('execution_delete', this.handleMessage);
    EventBus.$off('execution_patch', this.handleMessage);
    EventBus.$off('execution_create', this.handleMessage);
  },

  watch: {
    fixedPayload: {
      immediate: true,
      handler(newVal, oldVal) {
        if (
          !oldVal ||
          (JSON.stringify(newVal) !== JSON.stringify(oldVal))
        ) {
          this.handleSelectSearch(Object.assign({}, this.baseForm, this.payload, newVal));
        }
      },
    },
    payload: {
      handler(newVal, oldVal) {
        if (
          !oldVal ||
          (JSON.stringify(newVal) !== JSON.stringify(oldVal))
        ) {
          this.handleSelectSearch(Object.assign({}, this.baseForm, newVal, this.fixedPayload));
        }
      },
    },
  },
};
</script>
