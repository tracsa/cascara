<template>
  <div class="container-fluid">
    <hr/>

    <div class="row no-gutters mt-3">
      <div class="col">
        <b-collapse :id="collapseId" v-model="visible">
          <hero v-if="forms.loading"
            icon="spinner"
            title="commons.loading"
            spin
          />
          <div v-else-if="forms.error"
            class="text-center my-2"
          >
            <icon :icon="['fas', 'times']"/>
            <span class="ml-1">Error al cargar detalle</span>
          </div>

          <div class="container p-0"
            v-else
          >
            <div class="row no-gutters">
              <div class="col">
                <b-form-checkbox
                  class="text-right mb-3"
                  v-model="hideEmptyInputs"
                  name="check-button"
                  switch
                >
                  <span>Ocultar campos vacios</span>
                </b-form-checkbox>

                <div
                  class="border-left border-primary pl-2 mb-3"
                  v-for="(form,fIndex) in listForms"
                  v-bind:key="fIndex"
                >
                  <div>
                    <router-link
                      :to="{
                        name: 'dashboard',
                        query: { feed: 'userTasks', u: form.user.identifier },
                      }"
                    >
                      <icon :icon="['fa', 'user']" class="mr-1"/>
                      <b>{{ form.user.fullname }}</b>
                    </router-link>
                    <span> llenó la siguiente información:</span>
                  </div>

                  <div
                    class="border-left border-secondary pl-2 mb-3"
                    v-for="(input,iIndex) in listInputs(form.inputs)"
                    v-bind:key="iIndex"
                  >
                    <small
                      :class="{ 'text-muted': isEmptyField(input)}"
                    >{{ input.label }}</small><br/>

                    <p
                      :class="{ 'text-muted': isEmptyField(input) }"
                    ><value-render :input="input"/><br/></p>
                  </div>
                </div>

                <div
                  class="text-center mb-3"
                  v-if="!listForms.length"
                >
                  <span>No hay información para mostrar</span>
                </div>
              </div>
            </div>
          </div>
        </b-collapse>

        <div class="w-100 text-center">
          <a
            v-b-toggle="collapseId"
            href="#"
            v-on:click.prevent="showForms()"
          >
            <span v-if="!visible">
              <icon :icon="['fas', 'caret-down']"/>
              Mostrar detalle</span>
            <span v-else>
              <icon :icon="['fas', 'caret-up']"/>
              Ocultar detalle</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import PointerTranslate from '../../utils/pointerTranslate';

export default {
  props: {
    executionId: {
      type: String,
      required: true,
    },
    pointerId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      uuid: Math.random(),
      visible: false,
      hideEmptyInputs: false,

      forms: {
        data: [],
        loading: false,
        error: false,
      },
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

    listForms() {
      const vm = this;
      return vm.forms.data.filter(form => vm.listInputs(form.inputs).length);
    },
  },

  methods: {
    listInputs(inputs) {
      const vm = this;

      return inputs
        .filter(input => !input.hidden)
        .filter(input => !vm.hideEmptyInputs || !vm.isEmptyField(input));
    },

    isEmptyField(input) {
      return (input.value === null || input.value_caption === '');
    },

    showForms() {
      const vm = this;

      if (vm.forms.loading || vm.visible) { return; }
      vm.forms.loading = true;
      vm.forms.error = false;

      vm.$executionService.getExecution(vm.executionId)
        .then((exe) => {
          vm.$pointerService.getPointer(vm.pointerId)
            .then((ptr) => {
              vm.forms.loading = false;
              vm.forms.data = PointerTranslate(ptr, exe).forms;
            }).catch(() => {
              vm.forms.loading = false;
              vm.forms.error = true;
            });
        }).catch(() => {
          vm.forms.loading = false;
          vm.forms.error = true;
        });
    },
  },
};
</script>
