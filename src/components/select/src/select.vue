<template>
  <div
    class="s-select"
    v-clickoutside="handleClose">
    <div
      class="s-select__tags"
      v-if="multiple"
      @click.stop="toggleMenu"
      ref="tags"
      :style="{ 'max-width': inputWidth - 32 + 'px' }">
      <transition-group @after-leave="resetInputHeight">
        <s-tag
          v-for="item in selected"
          :key="item.value"
          closable
          :hit="item.hitState"
          type="primary"
          @close="deleteTag($event, item)"
          close-transition>
          <span class="s-select__tags-text">{{ item.currentLabel }}</span>
        </s-tag>
      </transition-group>

      <input
        type="text"
        class="s-select__input"
        :class="`is-${ size }`"
        @focus="visible = true"
        :disabled="disabled"
        @keyup="managePlaceholder"
        @keydown="resetInputState"
        @keydown.down.prevent="navigateOptions('next')"
        @keydown.up.prevent="navigateOptions('prev')"
        @keydown.enter.prevent="selectOption"
        @keydown.esc.prevent="visible = false"
        @keydown.delete="deletePrevTag"
        v-model="query"
        :debounce="remote ? 300 : 0"
        v-if="filterable"
        :style="{ width: inputLength + 'px', 'max-width': inputWidth - 42 + 'px' }"
        ref="input">
    </div>
    <s-input
      ref="reference"
      v-model="selectedLabel"
      type="text"
      :placeholder="currentPlaceholder"
      :name="name"
      :size="size"
      :disabled="disabled"
      :readonly="!filterable || multiple"
      :validate-event="false"
      @focus="handleFocus"
      @click="handleIconClick"
      @mousedown.native="handleMouseDown"
      @keyup.native="debouncedOnInputChange"
      @keydown.native.down.prevent="navigateOptions('next')"
      @keydown.native.up.prevent="navigateOptions('prev')"
      @keydown.native.enter.prevent="selectOption"
      @keydown.native.esc.prevent="visible = false"
      @keydown.native.tab="visible = false"
      @paste.native="debouncedOnInputChange"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
      :icon="iconClass">
    </s-input>
    <transition
      name="s-zoom-in-top"
      @after-leave="doDestroy"
      @after-enter="handleMenuEnter">
      <s-select-menu
        ref="popper"
        v-show="visible && emptyText !== false">
        <s-scrollbar
          tag="ul"
          wrap-class="s-select-dropdown__wrap"
          view-class="s-select-dropdown__list"
          :class="{ 'is-empty': !allowCreate && filteredOptionsCount === 0 }"
          v-show="options.length > 0 && !loading">
          <s-option
            :value="query"
            created
            v-if="showNewOption">
          </s-option>
          <slot></slot>
        </s-scrollbar>
        <p class="s-select-dropdown__empty" v-if="emptyText && !allowCreate">{{ emptyText }}</p>
      </s-select-menu>
    </transition>
  </div>
</template>

<script type="text/babel">
  import Emitter from '../../../extra/mixins/emitter';
  import Locale from '../../../extra/mixins/locale';
  import sInput from '../../input';
  import sSelectMenu from './select-dropdown.vue';
  import sOption from './option.vue';
  import sTag from '../../tag';
  import sScrollbar from '../../scrollbar';
  import debounce from '../../../extra/throttle-debounce/debounce';
  import Clickoutside from '../../../extra/utils/clickoutside';
  import { addClass, removeClass, hasClass } from '../../../extra/utils/dom';
  import { addResizeListener, removeResizeListener } from '../../../extra/utils/resize-event';
  import { t } from '../../../extra/locale';
  import merge from '../../../extra/utils/merge';
  const sizeMap = {
    'large': 42,
    'small': 30,
    'mini': 22
  };

  export default {
    mixins: [Emitter, Locale],

    name: 'sSelect',

    componentName: 'sSelect',

    computed: {
      iconClass() {
        let criteria = this.clearable &&
          !this.disabled &&
          this.inputHovering &&
          !this.multiple &&
          this.value !== undefined &&
          this.value !== '';
        return criteria ? 'circle-close is-show-close' : (this.remote && this.filterable ? '' : 'caret-top');
      },

      debounce() {
        return this.remote ? 300 : 0;
      },

      emptyText() {
        if (this.loading) {
          return this.loadingText || this.t('el.select.loading');
        } else {
          if (this.remote && this.query === '' && this.options.length === 0) return false;
          if (this.filterable && this.options.length > 0 && this.filteredOptionsCount === 0) {
            return this.noMatchText || this.t('el.select.noMatch');
          }
          if (this.options.length === 0) {
            return this.noDataText || this.t('el.select.noData');
          }
        }
        return null;
      },

      showNewOption() {
        let hasExistingOption = this.options.filter(option => !option.created)
          .some(option => option.currentLabel === this.query);
        return this.filterable && this.allowCreate && this.query !== '' && !hasExistingOption;
      }
    },

    components: {
      sInput,
      sSelectMenu,
      sOption,
      sTag,
      sScrollbar
    },

    directives: { Clickoutside },

    props: {
      name: String,
      value: {},
      size: String,
      disabled: Boolean,
      clearable: Boolean,
      filterable: Boolean,
      allowCreate: Boolean,
      loading: Boolean,
      popperClass: String,
      remote: Boolean,
      loadingText: String,
      noMatchText: String,
      noDataText: String,
      remoteMethod: Function,
      filterMethod: Function,
      multiple: Boolean,
      multipleLimit: {
        type: Number,
        default: 0
      },
      placeholder: {
        type: String,
        default() {
          return t('el.select.placeholder');
        }
      }
    },

    data() {
      return {
        options: [],
        cachedOptions: [],
        createdOption: null,
        createdSelected: false,
        selected: this.multiple ? [] : {},
        isSelect: true,
        inputLength: 20,
        inputWidth: 0,
        cachedPlaceHolder: '',
        optionsCount: 0,
        filteredOptionsCount: 0,
        dropdownUl: null,
        visible: false,
        selectedLabel: '',
        hoverIndex: -1,
        query: '',
        bottomOverflow: 0,
        topOverflow: 0,
        optionsAllDisabled: false,
        inputHovering: false,
        currentPlaceholder: ''
      };
    },

    watch: {
      placeholder(val) {
        this.cachedPlaceHolder = this.currentPlaceholder = val;
      },

      value(val) {
        if (this.multiple) {
          this.resetInputHeight();
          if (val.length > 0 || (this.$refs.input && this.query !== '')) {
            this.currentPlaceholder = '';
          } else {
            this.currentPlaceholder = this.cachedPlaceHolder;
          }
        }
        this.setSelected();
        if (this.filterable && !this.multiple) {
          this.inputLength = 20;
        }
        this.$emit('change', val);
        this.dispatch('sFormItem', 'el.form.change', val);
      },

      query(val) {
        this.$nextTick(() => {
          if (this.visible) this.broadcast('ElSelectDropdown', 'updatePopper');
        });
        this.hoverIndex = -1;
        if (this.multiple && this.filterable) {
          this.inputLength = this.$refs.input.value.length * 15 + 20;
          this.managePlaceholder();
          this.resetInputHeight();
        }
        if (this.remote && typeof this.remoteMethod === 'function') {
          this.hoverIndex = -1;
          this.remoteMethod(val);
          this.broadcast('sOption', 'resetIndex');
        } else if (typeof this.filterMethod === 'function') {
          this.filterMethod(val);
          this.broadcast('ElOptionGroup', 'queryChange');
        } else {
          this.filteredOptionsCount = this.optionsCount;
          this.broadcast('sOption', 'queryChange', val);
          this.broadcast('ElOptionGroup', 'queryChange');
        }
      },

      visible(val) {
        if (!val) {
          this.$refs.reference.$el.querySelector('input').blur();
          this.handleIconHide();
          this.broadcast('ElSelectDropdown', 'destroyPopper');
          if (this.$refs.input) {
            this.$refs.input.blur();
          }
          this.query = '';
          this.selectedLabel = '';
          this.inputLength = 20;
          this.resetHoverIndex();
          this.$nextTick(() => {
            if (this.$refs.input &&
              this.$refs.input.value === '' &&
              this.selected.length === 0) {
              this.currentPlaceholder = this.cachedPlaceHolder;
            }
          });
          if (!this.multiple) {
            this.getOverflows();
            if (this.selected) {
              if (this.filterable && this.allowCreate &&
                this.createdSelected && this.createdOption) {
                this.selectedLabel = this.createdOption.currentLabel;
              } else {
                this.selectedLabel = this.selected.currentLabel;
              }
              if (this.filterable) this.query = this.selectedLabel;
            }
          }
        } else {
          this.handleIconShow();
          this.broadcast('ElSelectDropdown', 'updatePopper');
          if (this.filterable) {
            this.query = this.selectedLabel;
            if (this.multiple) {
              this.$refs.input.focus();
            } else {
              if (!this.remote) {
                this.broadcast('sOption', 'queryChange', '');
                this.broadcast('ElOptionGroup', 'queryChange');
              }
              this.broadcast('sInput', 'inputSelect');
            }
          }
        }
        this.$emit('visible-change', val);
      },

      options(val) {
        if (this.$isServer) return;
        this.optionsAllDisabled = val.length === val.filter(item => item.disabled === true).length;
        if (this.multiple) {
          this.resetInputHeight();
        }
        let inputs = this.$el.querySelectorAll('input');
        if ([].indexOf.call(inputs, document.activeElement) === -1) {
          this.setSelected();
        }
      }
    },

    methods: {
      handleIconHide() {
        let icon = this.$el.querySelector('.s-input__icon');
        if (icon) {
          removeClass(icon, 'is-reverse');
        }
      },

      handleIconShow() {
        let icon = this.$el.querySelector('.s-input__icon');
        if (icon && !hasClass(icon, 's-icon-circle-close')) {
          addClass(icon, 'is-reverse');
        }
      },

      handleMenuEnter() {
        if (!this.dropdownUl) {
          this.dropdownUl = this.$refs.popper.$el.querySelector('.s-select-dropdown__wrap');
          this.getOverflows();
        }
        if (!this.multiple && this.dropdownUl) {
          this.resetMenuScroll();
        }
      },

      getOverflows() {
        if (this.dropdownUl && this.selected && this.selected.$el) {
          let selectedRect = this.selected.$el.getBoundingClientRect();
          let popperRect = this.$refs.popper.$el.getBoundingClientRect();
          this.bottomOverflow = selectedRect.bottom - popperRect.bottom;
          this.topOverflow = selectedRect.top - popperRect.top;
        }
      },

      resetMenuScroll() {
        if (this.bottomOverflow > 0) {
          this.dropdownUl.scrollTop += this.bottomOverflow;
        } else if (this.topOverflow < 0) {
          this.dropdownUl.scrollTop += this.topOverflow;
        }
      },

      getOption(value) {
        let option;
        for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
          const cachedOption = this.cachedOptions[i];
          if (cachedOption.value === value) {
            option = cachedOption;
            break;
          }
        }
        if (option) return option;
        const label = typeof value === 'string' || typeof value === 'number'
          ? value : '';
        let newOption = {
          value: value,
          currentLabel: label
        };
        if (this.multiple) {
          newOption.hitState = false;
        }
        return newOption;
      },

      setSelected() {
        if (!this.multiple) {
          let option = this.getOption(this.value);
          if (option.created) {
            this.createdOption = merge({}, option);
            this.createdSelected = true;
          } else {
            this.createdSelected = false;
          }
          this.selectedLabel = option.currentLabel;
          this.selected = option;
          if (this.filterable) this.query = this.selectedLabel;
          return;
        }
        let result = [];
        if (Array.isArray(this.value)) {
          this.value.forEach(value => {
            result.push(this.getOption(value));
          });
        }
        this.selected = result;
        this.$nextTick(() => {
          this.resetInputHeight();
        });
      },

      handleFocus() {
        this.visible = true;
      },

      handleIconClick(event) {
        if (this.iconClass.indexOf('circle-close') > -1) {
          this.deleteSelected(event);
        } else {
          this.toggleMenu();
        }
      },

      handleMouseDown(event) {
        if (event.target.tagName !== 'INPUT') return;
        if (this.visible) {
          this.handleClose();
          event.preventDefault();
        }
      },

      doDestroy() {
        this.$refs.popper && this.$refs.popper.doDestroy();
      },

      handleClose() {
        this.visible = false;
      },

      toggleLastOptionHitState(hit) {
        if (!Array.isArray(this.selected)) return;
        const option = this.selected[this.selected.length - 1];
        if (!option) return;

        if (hit === true || hit === false) {
          option.hitState = hit;
          return hit;
        }

        option.hitState = !option.hitState;
        return option.hitState;
      },

      deletePrevTag(e) {
        if (e.target.value.length <= 0 && !this.toggleLastOptionHitState()) {
          this.value.pop();
        }
      },

      managePlaceholder() {
        if (this.currentPlaceholder !== '') {
          this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
        }
      },

      resetInputState(e) {
        if (e.keyCode !== 8) this.toggleLastOptionHitState(false);
        this.inputLength = this.$refs.input.value.length * 15 + 20;
        this.resetInputHeight();
      },

      resetInputHeight() {
        this.$nextTick(() => {
          if (!this.$refs.reference) return;
          let inputChildNodes = this.$refs.reference.$el.childNodes;
          let input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0];
          input.style.height = Math.max(this.$refs.tags.clientHeight + 6, sizeMap[this.size] || 36) + 'px';
          if (this.visible && this.emptyText !== false) {
            this.broadcast('ElSelectDropdown', 'updatePopper');
          }
        });
      },

      resetHoverIndex() {
        setTimeout(() => {
          if (!this.multiple) {
            this.hoverIndex = this.options.indexOf(this.selected);
          } else {
            if (this.selected.length > 0) {
              this.hoverIndex = Math.min.apply(null, this.selected.map(item => this.options.indexOf(item)));
            } else {
              this.hoverIndex = -1;
            }
          }
        }, 300);
      },

      handleOptionSelect(option) {
        if (!this.multiple) {
          this.$emit('input', option.value);
          this.visible = false;
        } else {
          let optionIndex = -1;
          this.value.forEach((item, index) => {
            if (item === option.value) {
              optionIndex = index;
            }
          });
          if (optionIndex > -1) {
            this.value.splice(optionIndex, 1);
          } else if (this.multipleLimit <= 0 || this.value.length < this.multipleLimit) {
            this.value.push(option.value);
          }
          if (option.created) {
            this.query = '';
            this.inputLength = 20;
          }
          if (this.filterable) this.$refs.input.focus();
        }
      },

      toggleMenu() {
        if (this.filterable && this.query === '' && this.visible) {
          return;
        }
        if (!this.disabled) {
          this.visible = !this.visible;
        }
      },

      navigateOptions(direction) {
        if (!this.visible) {
          this.visible = true;
          return;
        }
        if (this.options.length === 0 || this.filteredOptionsCount === 0) return;
        if (!this.optionsAllDisabled) {
          if (direction === 'next') {
            this.hoverIndex++;
            if (this.hoverIndex === this.options.length) {
              this.hoverIndex = 0;
            }
            this.resetScrollTop();
            if (this.options[this.hoverIndex].disabled === true ||
              this.options[this.hoverIndex].groupDisabled === true ||
              !this.options[this.hoverIndex].visible) {
              this.navigateOptions('next');
            }
          }
          if (direction === 'prev') {
            this.hoverIndex--;
            if (this.hoverIndex < 0) {
              this.hoverIndex = this.options.length - 1;
            }
            this.resetScrollTop();
            if (this.options[this.hoverIndex].disabled === true ||
              this.options[this.hoverIndex].groupDisabled === true ||
              !this.options[this.hoverIndex].visible) {
              this.navigateOptions('prev');
            }
          }
        }
      },

      resetScrollTop() {
        let bottomOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().bottom -
          this.$refs.popper.$el.getBoundingClientRect().bottom;
        let topOverflowDistance = this.options[this.hoverIndex].$el.getBoundingClientRect().top -
          this.$refs.popper.$el.getBoundingClientRect().top;
        if (bottomOverflowDistance > 0) {
          this.dropdownUl.scrollTop += bottomOverflowDistance;
        }
        if (topOverflowDistance < 0) {
          this.dropdownUl.scrollTop += topOverflowDistance;
        }
      },

      selectOption() {
        if (this.options[this.hoverIndex]) {
          this.handleOptionSelect(this.options[this.hoverIndex]);
        }
      },

      deleteSelected(event) {
        event.stopPropagation();
        this.$emit('input', '');
        this.visible = false;
      },

      deleteTag(event, tag) {
        let index = this.selected.indexOf(tag);
        if (index > -1 && !this.disabled) {
          this.value.splice(index, 1);
        }
        event.stopPropagation();
      },

      onInputChange() {
        if (this.filterable) {
          this.query = this.selectedLabel;
        }
      },

      onOptionDestroy(option) {
        this.optionsCount--;
        this.filteredOptionsCount--;
        let index = this.options.indexOf(option);
        if (index > -1) {
          this.options.splice(index, 1);
        }
        this.broadcast('sOption', 'resetIndex');
      },

      resetInputWidth() {
        this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
      },

      handleResize() {
        this.resetInputWidth();
        if (this.multiple) this.resetInputHeight();
      }
    },

    created() {
      this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
      if (this.multiple && !Array.isArray(this.value)) {
        this.$emit('input', []);
      }
      if (!this.multiple && Array.isArray(this.value)) {
        this.$emit('input', '');
      }
      this.setSelected();

      this.debouncedOnInputChange = debounce(this.debounce, () => {
        this.onInputChange();
      });

      this.$on('handleOptionClick', this.handleOptionSelect);
      this.$on('onOptionDestroy', this.onOptionDestroy);
      this.$on('setSelected', this.setSelected);
    },

    mounted() {
      if (this.multiple && Array.isArray(this.value) && this.value.length > 0) {
        this.currentPlaceholder = '';
      }
      addResizeListener(this.$el, this.handleResize);
      if (this.remote && this.multiple) {
        this.resetInputHeight();
      }
      this.$nextTick(() => {
        if (this.$refs.reference && this.$refs.reference.$el) {
          this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
        }
      });
    },

    destroyed() {
      if (this.handleResize) removeResizeListener(this.$el, this.handleResize);
    }
  };
</script>

<style>
  @charset "UTF-8";
  @import "../../theme-default/common/var.css";

  @component-namespace s {

    @b select {
      display: inline-block;
      position: relative;

    &:hover {
      .s-input__inner {
        border-color: var(--select-border-color-hover);
      }
    }

  & .s-input__inner {
      cursor: pointer;

  &:focus {
     border-color: var(--select-input-focus-background);
   }
  }

  & .s-input {
  & .s-input__icon {
      color: var(--select-input-color);
      font-size: var(--select-input-font-size);
      transition: transform .3s;
      transform: translateY(-50%) rotateZ(180deg);
      line-height: 16px;
      top: 50%;
      cursor: pointer;

  @when reverse {
    transform: translateY(-50%);
  }

  @when show-close {
    transition: 0s;
    size: 16px;
    font-size: var(--select-font-size);
    right: 8px;
    text-align: center;
    transform: translateY(-50%) rotateZ(180deg);
    border-radius: var(--border-radius-circle);
    color: var(--select-input-color);

  &:hover {
     color: var(--select-close-hover-color);
   }
  }
  }

  &.is-disabled {
  & .s-input__inner {
      cursor: not-allowed;

  &:hover {
     border-color: var(--select-disabled-border);
   }
  }
  }
  }

  @e input {
    border: none;
    outline: none;
    padding: 0;
    margin-left: 10px;
    color: var(--select-multiple-input-color);
    font-size: var(--select-font-size);
    vertical-align: baseline;
    appearance: none;
    height: 28px;
    background-color: transparent;
    @when mini {
      height: 14px;
    }
  }

  @e close {
    cursor: pointer;
    position: absolute;
    top: 8px;
    z-index: var(--index-top);
    right: 25px;
    color: var(--select-input-color);
    line-height: 18px;
    font-size: var(--select-input-font-size);

  &:hover {
     color: var(--select-close-hover-color);
   }
  }

  @e tags {
    position: absolute;
    line-height: normal;
    white-space: normal;
    z-index: var(--index-top);
    top: 50%;
    transform: translateY(-50%);
  }

  & .s-tag__close {
      margin-top: -2px;
    }

  & .s-tag {
      height: var(--select-tag-height);
      line-height: var(--select-tag-height);
      box-sizing: border-box;
      margin: 3px 0 3px 6px;
    }

  @e tag {
    display: inline-block;
    height: var(--select-tag-height);
    line-height: var(--select-tag-height);
    font-size: var(--select-font-size);
    border-radius: var(--border-radius-base);
    color: var(--select-tag-color);
    background-color: var(--select-tag-background);

  & .s-icon-close {
      font-size: var(--select-input-font-size);
    }
  }
  }
  }

</style>
