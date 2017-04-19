<template>
  <form class="s-form" :class="[
    labelPosition ? 's-form-label-' + labelPosition : '',
    { 's-form-inline': inline }
  ]">
    <slot></slot>
  </form>
</template>
<script>
  export default {
    name: 's-form',
    componentName: 'SForm',
    props: {
      model: Object,
      rules: Object,
      labelPosition: String,
      labelWidth: String,
      labelSuffix: {
        type: String,
        default: ''
      },
      inline: Boolean,
      showMessage: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      rules() {
        this.validate();
      }
    },
    data() {
      return {
        fields: []
      };
    },
    created() {
      this.$on('el.form.addField', (field) => {
        if (field) {
          this.fields.push(field);
        }
      });
      /* istanbul ignore next */
      this.$on('el.form.removeField', (field) => {
        if (field.prop) {
          this.fields.splice(this.fields.indexOf(field), 1);
        }
      });
    },
    methods: {
      resetFields() {
        this.fields.forEach(field => {
          field.resetField();
        });
      },
      validate(callback) {
        let valid = true;
        let count = 0;
        this.fields.forEach((field, index) => {
          field.validate('', errors => {
            if (errors) {
              valid = false;
            }
            if (typeof callback === 'function' && ++count === this.fields.length) {
              callback(valid);
            }
          });
        });
      },
      validateField(prop, cb) {
        var field = this.fields.filter(field => field.prop === prop)[0];
        if (!field) { throw new Error('must call validateField with valid prop string!'); }

        field.validate('', cb);
      }
    }
  };
</script>
<style>
  .s-form-item-content:after,.s-form-item-content:before { display: table; content: "" }
  .s-form-item-content:after { clear: both }
  .s-form-item:after,.s-form-item:before { display: table; content: "" }
  .s-form-item:after { clear: both }
  .s-form-label-left .s-form-item-label { text-align: left }
  .s-form-label-top .s-form-item-label { float: none; display: inline-block; padding: 0 0 10px }
  .s-form-inline .s-form-item { display: inline-block; margin-right: 10px; vertical-align: top }
  .s-form-inline .s-form-item-label { float: none; display: inline-block }
  .s-form-inline .s-form-item-content { display: inline-block }
  .s-form-inline.s-form-label-top .s-form-item-content { display: block }
  .s-form-item { margin-bottom: 22px }
  .s-form-item .s-form-item { margin-bottom: 0 }
  .s-form-item .s-form-item .s-form-item-content { margin-left: 0!important }
  .s-form-item.is-error .s-input-group-append .s-input-inner,.s-form-item.is-error .s-input-group-prepend .s-input-inner,.s-form-item.is-error .s-input-inner { border-color: transparent }
  .s-form-item.is-error .s-input-inner,.s-form-item.is-error .s-textarea-inner { border-color: #ff4949 }
  .s-form-item.is-required .s-form-item-label:before { content: "*"; color: #ff4949; margin-right: 4px }
  .s-form-item-label { text-align: right; vertical-align: middle; float: left; font-size: 14px; color: #48576a; line-height: 1; padding: 11px 12px 11px 0; box-sizing: border-box }
  .s-form-item-content { line-height: 36px; position: relative; font-size: 14px }
  .s-form-item-error { color: #ff4949; font-size: 12px; line-height: 1; padding-top: 4px; position: absolute; top: 100%; left: 0 }
</style>
