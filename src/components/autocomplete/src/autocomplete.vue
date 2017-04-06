<template>
  <div class="s-autocomplete" v-clickoutside="handleClickoutside">
    <s-input
      ref="input"
      :value="value"
      :disabled="disabled"
      :placeholder="placeholder"
      :name="name"
      :size="size"
      :icon="icon"
      :on-icon-click="onIconClick"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown.up.native.prevent="highlight(highlightedIndex - 1)"
      @keydown.down.native.prevent="highlight(highlightedIndex + 1)"
      @keydown.enter.stop.native="handleKeyEnter"
    >
      <template slot="prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </template>
      <template slot="append" v-if="$slots.append">
        <slot name="append"></slot>
      </template>
    </s-input>
    <s-autocomplete-suggestions
      :class="[popperClass ? popperClass : '']"
      ref="suggestions"
      :suggestions="suggestions"
    >
    </s-autocomplete-suggestions>
  </div>
</template>
<script>
  import sInput from '../../input';
  import Clickoutside from '../../../extra/utils/clickoutside';
  import sAutocompleteSuggestions from './autocomplete-suggestions.vue';
  import Emitter from '../../../extra/mixins/emitter';

  export default {
    name: 'sAutocomplete',

    mixins: [Emitter],

    componentName: 'sAutocomplete',

    components: {
      sInput,
      sAutocompleteSuggestions
    },

    directives: { Clickoutside },

    props: {
      popperClass: String,
      placeholder: String,
      disabled: Boolean,
      name: String,
      size: String,
      value: String,
      autofocus: Boolean,
      fetchSuggestions: Function,
      triggerOnFocus: {
        type: Boolean,
        default: true
      },
      customItem: String,
      icon: String,
      onIconClick: Function
    },
    data() {
      return {
        isFocus: false,
        suggestions: [],
        loading: false,
        highlightedIndex: -1
      };
    },
    computed: {
      suggestionVisible() {
        const suggestions = this.suggestions;
        let isValidData = Array.isArray(suggestions) && suggestions.length > 0;
        return (isValidData || this.loading) && this.isFocus;
      }
    },
    watch: {
      suggestionVisible(val) {
        this.broadcast('sAutocompleteSuggestions', 'visible', [val, this.$refs.input.$refs.input.offsetWidth]);
      }
    },
    methods: {
      getData(queryString) {
        this.loading = true;
        this.fetchSuggestions(queryString, (suggestions) => {
          this.loading = false;
          if (Array.isArray(suggestions)) {
            this.suggestions = suggestions;
          } else {
            console.error('autocomplete suggestions must be an array');
          }
        });
      },
      handleChange(value) {
        this.$emit('input', value);
        if (!this.triggerOnFocus && !value) {
          this.suggestions = [];
          return;
        }
        this.getData(value);
      },
      handleFocus() {
        this.isFocus = true;
        if (this.triggerOnFocus) {
          this.getData(this.value);
        }
      },
      handleBlur() {
        // 因为 blur 事件处理优先于 select 事件执行
        setTimeout(_ => {
          this.isFocus = false;
        }, 100);
      },
      handleKeyEnter() {
        if (this.suggestionVisible && this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
          this.select(this.suggestions[this.highlightedIndex]);
        }
      },
      handleClickoutside() {
        this.isFocus = false;
      },
      select(item) {
        this.$emit('input', item.value);
        this.$emit('select', item);
        this.$nextTick(_ => {
          this.suggestions = [];
        });
      },
      highlight(index) {
        if (!this.suggestionVisible || this.loading) { return; }
        if (index < 0) index = 0;
        if (index >= this.suggestions.length) {
          index = this.suggestions.length - 1;
        }
        const suggestion = this.$refs.suggestions.$el.querySelector('.s-autocomplete-suggestion__wrap');
        const suggestionList = suggestion.querySelectorAll('.s-autocomplete-suggestion__list li');

        let highlightItem = suggestionList[index];
        let scrollTop = suggestion.scrollTop;
        let offsetTop = highlightItem.offsetTop;

        if (offsetTop + highlightItem.scrollHeight > (scrollTop + suggestion.clientHeight)) {
          suggestion.scrollTop += highlightItem.scrollHeight;
        }
        if (offsetTop < scrollTop) {
          suggestion.scrollTop -= highlightItem.scrollHeight;
        }

        this.highlightedIndex = index;
      }
    },
    mounted() {
      this.$on('item-click', item => {
        this.select(item);
      });
    },
    beforeDestroy() {
      this.$refs.suggestions.$destroy();
    }
  };
</script>

<style>
  @charset "UTF-8";
  @import "../../theme-default/common/var.css";

  @component-namespace s {
    @b autocomplete {
      position: relative;
      display: inline-block;
    }
    @b autocomplete-suggestion {
      margin: 5px 0;
      box-shadow: 0 0 6px 0 rgba(0,0,0,0.04), 0 2px 4px 0 rgba(0,0,0,0.12);

      @e wrap {
        max-height: 280px;
        overflow: auto;
        background-color: var(--color-white);
        border: 1px solid var(--color-base-gray);
        padding: 6px 0;
        border-radius: 2px;
        box-sizing: border-box;
      }

      @e list {
        margin: 0;
        padding: 0;
      }

    & li {
        list-style: none;
        line-height: 36px;
        padding: 0 10px;
        margin: 0;
        cursor: pointer;
        color: var(--color-extra-light-black);
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

    &:hover {
       background-color: var(--select-option-hover-background);
     }
    &.highlighted {
       background-color: var(--color-primary);
       color: var(--color-white);
     }
    &:active {
       background-color: darken(var(--color-primary), 0.2);
     }
    &.divider {
       margin-top: 6px;
       border-top: 1px solid var(--color-base-gray);
     }
    &.divider:last-child {
       margin-bottom: -6px;
     }
    }

    @when loading {
      li {
        text-align: center;
        height: 100px;
        line-height: 100px;
        font-size: 20px;
        color: #999;
      @utils-vertical-center;

    &:hover {
       background-color: var(--color-white);
     }
    }

  & .s-icon-loading {
      vertical-align: middle;
    }
  }
  }
  }

</style>
