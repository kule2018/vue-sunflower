<template>
  <div class="s-collapse-item" :class="{'is-active': isActive}">
    <div class="s-collapse-item-header" @click="handleHeaderClick">
      <i class="s-collapse-item-header-arrow s-icon-arrow-right"></i>
      <slot name="title">{{title}}</slot>
    </div>
    <collapse-transition>
      <div class="s-collapse-item-wrap" v-show="isActive">
        <div class="s-collapse-item-content">
          <slot></slot>
        </div>
      </div>
    </collapse-transition>
  </div>
</template>
<script>
  import Emitter from '../../extra/mixins/emitter'
  import CollapseTransition from '../../extra/transitions/collapse-transition'

  export default {
    name: 's-collapse-item',

    componentName: 's-collapse-item',

    mixins: [Emitter],

    components: {
      CollapseTransition
    },

    data() {
      return {
        contentWrapStyle: {
          height: 'auto',
          display: 'block'
        },
        contentHeight: 0
      }
    },

    props: {
      title: String,
      name: {
        type: [String, Number],
        default() {
          return this._uid
        }
      }
    },

    computed: {
      isActive() {
        return this.$parent.activeNames.indexOf(this.name) > -1
      }
    },

    watch: {
      'isActive'(value) {

      }
    },

    methods: {
      handleHeaderClick() {
        this.dispatch('s-collapse', 'item-click', this)
      }
    },

    mounted() {

    }

  }
</script>
<style>
  .s-collapse-item:last-child {
    margin-bottom: -1px
  }

  .s-collapse-item.is-active>.s-collapse-item-header .s-collapse-item-header-arrow {
    transform: rotate(90deg)
  }

  .s-collapse-item-header {
    height: 43px;
    line-height: 43px;
    padding-left: 15px;
    background-color: #fff;
    color: #48576a;
    cursor: pointer;
    border-bottom: 1px solid #dfe6ec;
    font-size: 13px
  }

  .s-collapse-item-header-arrow {
    margin-right: 8px;
    transition: transform .3s
  }

  .s-collapse-item-wrap {
    will-change: height;
    background-color: #fbfdff;
    overflow: hidden;
    box-sizing: border-box;
    border-bottom: 1px solid #dfe6ec
  }

  .s-collapse-item-content {
    padding: 10px 15px;
    font-size: 13px;
    color: #1f2d3d;
    line-height: 1.769230769230769
  }
</style>