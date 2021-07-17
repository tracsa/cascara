<template>
  <b-form
    class="w-100"
    @submit.prevent="submit"
  >
    <b-form-group>
      <b-form-input
        v-model="value.searchText"
        placeholder="Título o Id"
        type="search"
      ></b-form-input>
    </b-form-group>

    <b-form-group
      label="¿Que estas buscando?"
      v-if="typeof fixedArgs.objType === 'undefined'"
    >
      <b-form-radio-group
        id="btn-radios-2"
        v-model="value.objType"
        :options="objTypeOptions"
        button-variant="outline-primary"
        name="radio-btn-outline"
        buttons
        @input="onObjTypeInput"
      ></b-form-radio-group>
    </b-form-group>

    <b-form-group
      v-if="(
        typeof fixedArgs.pointerStatus === 'undefined' &&
        value.objType === 'pointer'
      )"
      label="Estado de la tarea"
    >
      <b-form-checkbox-group
        v-model="value.pointerStatus"
        :options="itemStatusOptions"
        switches
      ></b-form-checkbox-group>
    </b-form-group>

    <b-form-group
      v-if="typeof fixedArgs.executionStatus === 'undefined'"
    >
      <template v-slot:label>
        <span v-if="value.objType === 'pointer'"
        >Estado del flujo de autorización al que pertence la tarea</span>
        <span v-else
        >Estado del flujo de autorización</span>
      </template>

      <b-form-checkbox-group
        v-model="value.executionStatus"
        :options="itemStatusOptions"
        switches
      ></b-form-checkbox-group>
    </b-form-group>

    <b-form-row>
      <b-form-group
        class="col-6"
        label="Desde"
      >
        <b-form-input
          v-model="value.minDate"
          type="date"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        class="col-6"
        label="Hasta"
      >
        <b-form-input
          v-model="value.maxDate"
          type="date"
        ></b-form-input>
      </b-form-group>
    </b-form-row>

    <b-form-group
      label="¿Buscas algun usuario en particular?"
      v-if="(
        typeof fixedArgs.actoredUsers === 'undefined' &&
        typeof fixedArgs.notifiedUsers === 'undefined'
      )"
    >
      <b-form-checkbox
        v-model="searchUsers"
        switch
        @input="onUserSearchInput"
      >Sí, buscar usuario</b-form-checkbox>
    </b-form-group>

    <b-form-group
      v-if="(
        typeof fixedArgs.actoredUsers === 'undefined' &&
        searchUsers
      )"
    >
      <user-input
        :label="'Usuarios que realizaron tareas'"
        :placeholder="'Introduce un id de usuario'"
        v-model="value.actoredUsers"
      ></user-input>
    </b-form-group>

    <b-form-group
      v-if="(
        typeof fixedArgs.notifiedUsers === 'undefined' &&
        searchUsers
      )"
    >
      <user-input
        :label="'Usuarios asignados'"
        :placeholder="'Introduce un id de usuario'"
        v-model="value.notifiedUsers"
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
      objTypeOptions: [
        { text: 'Flujo de autorización', value: 'execution' },
        { text: 'Tarea', value: 'pointer' },
      ],

      itemStatusOptions: [
        { text: 'En curso', value: 'ongoing' },
        { text: 'Finalizado', value: 'finished' },
        { text: 'Cancelado', value: 'cancelled' },
      ],

      searchUsers: !!this.value.actoredUsers || !!this.value.notifiedUsers,
    };
  },

  methods: {
    submit() {
      this.$emit('submit', this.value);
    },

    onObjTypeInput(v) {
      if (v === 'execution') {
        this.value.pointerStatus = this.itemStatusOptions.map(x => x.value);
      }
    },

    onUserSearchInput(v) {
      if (!v) {
        this.value.actoredUsers = null;
        this.value.notifiedUsers = null;
      }
    },
  },
};
</script>
