<template>
  <div
    class="card no-body text-dark bg-light py-3 shadow overflow-auto"
  >
    <div class="container-fluid">
      <div class="d-flex justify-content-between">
        <small class="text-muted">Tarea</small>
        <small class="text-muted">{{ pointer.id }}</small>
      </div>

      <div class="row no-gutters">
        <div
          class="col"
          :class="{ 'text-truncate': extended }"
        >
          <b><app-md-render :raw-string="pointerName"/></b><br/>
          <router-link
            v-if="extended"
            :to="{
              name: 'dashboard',
              query: {
                e: pointer.execution.id,
              },
            }"
          >
            <small>En <b><app-md-render :raw-string="executionName"/></b></small>
          </router-link>
        </div>
      </div>

      <div class="row no-gutters">
        <div class="col text-right">
          <small
            class="text-muted"
            :title="pointer.started_at|fmtDate('LLLL')"
          >
            <span>Creada el {{ pointer.started_at|fmtDate('LLLL') }}</span>
          </small>
        </div>
      </div>

      <div class="row no-gutters">
        <div class="col text-right">
          <small
            class="text-muted"
            :title="pointer.finished_at|fmtDate('LLLL')"
            v-if="pointer.finished_at"
          >
            <span v-if="pointer.state === 'finished'"
            >Finalizada el {{ pointer.finished_at|fmtDate('LLLL') }}</span>
            <span v-else-if="pointer.state === 'cancelled'"
            >Cancelada el {{ pointer.finished_at|fmtDate('LLLL') }}</span>
          </small>

          <span
            v-else
          >
            <span class="badge badge-warning">En curso</span>
          </span>
        </div>
      </div>

      <div class="row no-gutters">
        <div class="col my-2">
          <a
            v-if="assignees.length"
            href="#"
            v-on:click.prevent
            :id="assigneesPopoverId"
            tabindex="0"
          >
            <icon :icon="['fas', 'user-tag']"/>
            <small>
              <span><b>Asignada a {{ assignees.length }}</b></span>
            </small>
          </a>

          <app-users-popover
            v-if="assignees.length"
            :target="assigneesPopoverId"
            :title="'Usuarios asignados'"
            :users="assignees"
          />

          <span v-else>
            <small>Sin usuarios asignados</small>
          </span>
        </div>
      </div>

      <div class="row no-gutters">
        <div class="col">
          <app-users-popover
            v-if="actors.length"
            :target="actorsPopoverId"
            :title="'Usuarios que realizaron tareas'"
            :users="actors"
          />

          <a
            v-if="actors.length"
            href="#"
            @click.prevent
            :id="actorsPopoverId"
          >
            <icon :icon="['fas', 'user-tie']" class="mr-1"/>

            <small>
              <b>Realizada por {{ actors.length }}</b>
            </small>
          </a>
        </div>
      </div>

      <div class="row no-gutters">
        <div class="col">
          <timeline-action
            v-if="['finished', 'cancelled'].includes(pointer.state)"
            :pointer-id="pointer.id"
            :execution-id="pointer.execution.id"
          />

          <timeline-pending
            v-else-if="isDoableByUser"
            :pointer-id="pointer.id"
          />

          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { getAuthUser } from '../../utils/auth';

export default {
  props: {
    pointer: {
      type: Object,
      required: true,
    },
    extended: {
      type: Boolean,
      default: false,
    },
  },

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },

  data() {
    return {
      uuid: Math.random(),
    };
  },

  computed: {
    pointerName() {
      if (!this.pointer.node) {
        return '';
      }

      if (!['action', 'validation'].includes(this.pointer.node.type)) {
        return '[Tarea de sistema]';
      }

      return this.pointer.node.name;
    },

    executionName() {
      if (!this.pointer.execution) {
        return '';
      }

      return this.pointer.execution.name;
    },

    assignees() {
      return this.pointer.notified_users.map(user => ({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
      })).sort((a, b) => (a.fullname > b.fullname ? 1 : -1));
    },

    assigneesPopoverId() {
      const vm = this;
      return `assignees-popover-${vm.uuid}`;
    },

    actors() {
      if (!this.pointer.actor_list) {
        return null;
      }

      const rawList = this.pointer.actor_list.map(item => item.actor);
      return rawList
        .filter((obj, index) => {
          const id = obj.identifier;
          return rawList.map(item => item.identifier).indexOf(id) === index;
        });
    },

    actorsPopoverId() {
      const vm = this;
      return `actors-popover-${vm.uuid}`;
    },

    isDoableByUser() {
      const user = getAuthUser();
      return this.pointer.state === 'ongoing' &&
        this.pointer.notified_users
          .map(x => x.identifier).includes(user.username);
    },
  },
};
</script>

<style scoped>
.custom-card-border {
  border-left-style:solid;
  border-left-width: 4px;
};
</style>