<template>
  <transition name="s-zoom-in-top" @after-leave="doDestroy">
    <div
      v-show="showPopper"
      class="s-autocomplete-suggestion"
      :class="{ 'is-loading': parent.loading }"
      :style="{ width: dropdownWidth }"
    >
      <s-scrollbar
        tag="ul"
        wrap-class="s-autocomplete-suggestion__wrap"
        view-class="s-autocomplete-suggestion__list"
      >
        <li v-if="parent.loading"><i class="s-icon-loading"></i></li>
        <template v-for="(item, index) in suggestions" v-else>
          <li
            v-if="!parent.customItem"
            :class="{'highlighted': parent.highlightedIndex === index}"
            @click="select(item)"
          >
            {{item.value}}
          </li>
          <component
            v-else
            :class="{'highlighted': parent.highlightedIndex === index}"
            @click="select(item)"
            :is="parent.customItem"
            :item="item"
            :index="index">
          </component>
        </template>
      </s-scrollbar>
    </div>
  </transition>
</template>
<script>
  import Popper from '../../../extra/utils/vue-popper';
  import Emitter from '../../../extra/mixins/emitter';
  import sScrollbar from '../../scrollbar';
  export default {
    mixins: [Popper, Emitter],

    componentName: 'sAutocompleteSuggestions',

    data() {
      return {
        parent: this.$parent,
        dropdownWidth: ''
      };
    },

    components:{
      sScrollbar
    },

    props: {
      suggestions: Array,
      options: {
        default() {
          return {
            forceAbsolute: true,
            gpuAcceleration: false
          };
        }
      }
    },

    methods: {
      select(item) {
        this.dispatch('sAutocomplete', 'item-click', item);
      }
    },

    updated() {
      this.$nextTick(_ => {
        this.updatePopper();
      });
    },

    mounted() {
      this.popperElm = this.$el;
      this.referenceElm = this.$parent.$refs.input.$refs.input;
    },

    created() {
      this.$on('visible', (val, inputWidth) => {
        this.dropdownWidth = inputWidth + 'px';
        this.showPopper = val;
      });
    }
  };
</script>
