<template>
  <div>
    <label :for="inputId">{{ label }}</label>
    <b-form-tags
      :disabled="disabled"
      :placeholder="actualPlaceholder"
      :value="value"
      @input="onInput"
      :add-button-text="'Agregar'"
      :duplicate-tag-text="'Id duplicado'"
    ></b-form-tags>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
    },
    label: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
  },

  data() {
    return {
      uuid: Math.random(),
    };
  },

  computed: {
    inputId() {
      return `input-${this.uuid}`;
    },

    actualPlaceholder() {
      if (this.disabled) {
        return '';
      }

      return this.placeholder;
    },
  },

  methods: {
    onInput: function onInput(v) {
      this.$emit('input', v);
    },
  },
};
</script>
