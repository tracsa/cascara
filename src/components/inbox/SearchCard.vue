<template>
  <b-form
    class="w-100"
    @submit.prevent="submit"
  >
    <b-form-group>
      <b-form-input
        v-model="searchForm.searchText"
        placeholder="Título o Id"
        type="search"
      ></b-form-input>
    </b-form-group>

    <b-form-group
      label="¿Que estas buscando?"
    >
      <b-form-radio-group
        id="btn-radios-2"
        v-model="searchForm.objType"
        :options="objTypeOptions"
        button-variant="outline-primary"
        name="radio-btn-outline"
        @input="onObjTypeInput"
        :disabled="typeof fixedArgs.objType !== 'undefined'"
      ></b-form-radio-group>
    </b-form-group>

    <b-form-group
      v-if="(
        searchForm.objType === 'pointer'
      )"
      label="Estado de la tarea"
    >
      <b-form-checkbox-group
        v-model="searchForm.pointerStatus"
        :options="itemStatusOptions"
        switches
        :disabled="typeof fixedArgs.pointerStatus !== 'undefined'"
      ></b-form-checkbox-group>
    </b-form-group>

    <b-form-group>
      <template v-slot:label>
        <span v-if="searchForm.objType === 'pointer'"
        >Estado del flujo de autorización al que pertence la tarea</span>
        <span v-else
        >Estado del flujo de autorización</span>
      </template>

      <b-form-checkbox-group
        v-model="searchForm.executionStatus"
        :options="itemStatusOptions"
        switches
        :disabled="typeof fixedArgs.executionStatus !== 'undefined'"
      ></b-form-checkbox-group>
    </b-form-group>

    <b-form-row>
      <b-form-group
        class="col-6"
        label="Desde"
      >
        <b-form-input
          v-model="searchForm.minDate"
          type="date"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        class="col-6"
        label="Hasta"
      >
        <b-form-input
          v-model="searchForm.maxDate"
          type="date"
        ></b-form-input>
      </b-form-group>
    </b-form-row>

    <b-form-group
      label="¿Buscas algun usuario en particular?"
    >
      <b-form-checkbox
        v-model="searchForm.searchUsers"
        switch
        @input="onUserSearchInput"
        :disabled="typeof fixedArgs.searchUsers !== 'undefined'"
      >Sí, buscar usuario</b-form-checkbox>
    </b-form-group>

    <b-form-group
      v-if="searchForm.searchUsers"
    >
      <user-input
        :label="'Usuarios que realizaron tareas'"
        :placeholder="'Introduce un id de usuario'"
        v-model="searchForm.actoredUsers"
        :disabled="typeof fixedArgs.actoredUsers !== 'undefined'"
      ></user-input>
    </b-form-group>

    <b-form-group
      v-if="(
        searchForm.objType === 'pointer' &&
        searchForm.searchUsers
      )"
    >
      <user-input
        :label="'Usuarios asignados'"
        :placeholder="'Introduce un id de usuario'"
        v-model="searchForm.notifiedUsers"
        :disabled="typeof fixedArgs.notifiedUsers !== 'undefined'"
      ></user-input>
    </b-form-group>

    <b-button
      type="submit"
      variant="secondary"
    >
      <span>
        <icon :icon="['fa', 'search']"/>
        Buscar
      </span>
    </b-button>
  </b-form>
</template>

<script>
export default {
  props: {
    fixedArgs: Object,
    value: Object,
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
      searchForm: null,

      objTypeOptions: [
        { text: 'Flujo de autorización', value: 'execution' },
        { text: 'Tarea', value: 'pointer' },
      ],

      itemStatusOptions: [
        { text: 'En curso', value: 'ongoing' },
        { text: 'Finalizado', value: 'finished' },
        { text: 'Cancelado', value: 'cancelled' },
      ],
    };
  },

  computed: {
    cleanForm() {
      const cleaned = Object.assign({}, this.searchForm);

      if (cleaned.objType === 'execution') {
        delete cleaned.notifiedUsers;
        delete cleaned.pointerStatus;
      }

      if (!cleaned.searchUsers) {
        delete cleaned.notifiedUsers;
        delete cleaned.actoredUsers;
      }

      return cleaned;
    },
  },

  methods: {
    submit() {
      this.$emit('submit', this.cleanForm);
    },

    onObjTypeInput(v) {
      if (v === 'execution') {
        this.searchForm.pointerStatus = this.itemStatusOptions.map(x => x.value);
      }
    },

    onUserSearchInput(v) {
      if (!v) {
        this.searchForm.actoredUsers = null;
        this.searchForm.notifiedUsers = null;
      }
    },
  },

  watch: {
    fixedArgs: {
      immediate: true,
      handler(newVal) {
        this.searchForm = Object.assign({}, this.baseForm, this.value, newVal);
      },
    },

    value: {
      handler(newVal) {
        this.searchForm = Object.assign({}, this.baseForm, newVal, this.fixedArgs);
      },
    },
  },
};
</script>
