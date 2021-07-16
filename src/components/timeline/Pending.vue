<template>
  <div class="container-fluid">
    <hr/>

    <div class="row no-gutters mt-3">
      <div class="col">
        <b-collapse :id="collapseId" v-model="visible">
          <hero v-if="task.loading"
            icon="spinner"
            title="commons.loading"
            spin
          />
          <div v-else-if="task.error"
            class="text-center my-2"
          >
            <icon :icon="['fas', 'times']"/>
            <span class="ml-1">Error al cargar tarea</span>
          </div>

          <div
            v-else-if="task.data"
          >
            <div
              v-for="(error, index) in errors.global"
              :key="index"
              class="alert custom-alert-danger">
              {{ $t(error.code) || error.detail }}
            </div>

            <div
              class="border-left border-info pl-2 mb-3"
              v-if="task.data.description"
            >
              <app-md-render :raw-string="task.data.description"/>
            </div>

            <form-render
              v-if="task.data.node_type === 'action'"
              :forms="task.data.form_array"
              :prevWork="task.data.prev_work"
              :errors="errors"
              :sending="sending || sent"
              @submit= "submit"
            />

            <data-validator
              v-if="task.data.node_type === 'validation'"
              :fields="task.data.fields"
              :errors="errors"
              :sending="sending || sent"
              @submit= "validate"
            />
          </div>
        </b-collapse>

        <div class="w-100 text-center">
          <a
            v-b-toggle="collapseId"
            href="#"
            v-on:click.prevent="showTask()"
          >
            <span v-if="!visible">
              <icon :icon="['fas', 'caret-down']"/>
              <b>Resolver tarea</b></span>
            <span v-else>
              <icon :icon="['fas', 'caret-up']"/>
              <b>Dejar tarea para despues</b></span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { post } from '../../utils/api';
import formatErrors from '../../utils/formatErrors';

export default {
  props: {
    pointerId: {
      type: String,
      required: true,
    },
    loadIfDoable: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      uuid: Math.random(),
      visible: false,
      errors: {
        global: [],
      },
      sending: false,
      sent: false,

      task: {
        data: null,
        loading: false,
        error: false,
      },

      observer: null,
    };
  },

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },

  computed: {
    collapseId() {
      const vm = this;
      const modalId = `collapse-${vm.uuid}`;

      return modalId;
    },
  },

  methods: {
    validate(validation) {
      const postData = Object.assign({
        execution_id: this.task.data.execution.id,
        node_id: this.task.data.node_id,
      }, validation);

      this.sending = true;
      post('/pointer', postData, 'application/json')
        .then(() => {
          this.sending = false;
          this.sent = true;
          this.$emit('complete');
        })
        .catch((errors) => {
          this.sending = false;
          this.errors = formatErrors(errors);

          if (errors &&
            errors.map(x => x.code)
              .includes('validation.no_live_pointer')
          ) {
            setTimeout(() => this.$emit('complete'), 1000);
          }
        });
    },

    submit(formArray) {
      const postData = {
        execution_id: this.task.data.execution.id,
        node_id: this.task.data.node_id,
        form_array: formArray,
      };

      this.sending = true;
      post('/pointer', postData, 'application/json')
        .then(() => {
          this.sending = false;
          this.sent = true;
          this.$emit('complete');
        })
        .catch((errors) => {
          this.sending = false;
          this.errors = formatErrors(errors);

          if (errors &&
            errors.map(x => x.code)
              .includes('validation.no_live_pointer')
          ) {
            setTimeout(() => this.$emit('complete'), 1000);
          }
        });
    },

    showTask() {
      const vm = this;

      if (vm.task.loading || vm.visible) { return; }
      vm.task.loading = true;
      vm.task.error = false;

      vm.$pointerService.getPointerTask(vm.pointerId)
        .then((tsk) => {
          vm.task.data = tsk;
          vm.task.loading = false;
          vm.task.error = false;
        }).catch((errors) => {
          vm.task.loading = false;
          vm.task.error = true;

          if (
            errors &&
            errors.response &&
            errors.response.status &&
            errors.response.status === 404
          ) {
            vm.$emit('complete');
          }
        });
    },
  },

  mounted() {
    if (this.loadIfDoable) {
      this.observer = new IntersectionObserver((entries) => {
        const task = entries[0];
        if (task.isIntersecting) {
          this.showTask();
          this.visible = true;
          this.observer.disconnect();
        }
      });

      this.observer.observe(this.$el);
    }
  },

  destroyed() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
};
</script>
