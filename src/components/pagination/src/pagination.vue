<script>
import Pager from './pager.vue';
import sSelect from '../../select/src/select.vue';
import sOption from '../../select/src/option.vue';
import Locale from '../../../extra/mixins/locale';

export default {
  name: 'sPagination',

  data() {
    return {
      internalCurrentPage: 1,
      internalPageSize: 0,
    };
  },

  props: {
    pageSize: {
      type: Number,
      default: 10
    },

    small: Boolean,

    total: Number,

    pageCount: Number,

    currentPage: {
      type: Number,
      default: 1
    },

    layout: {
      default: 'prev, pager, next, jumper, ->, total'
    },

    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 40, 50, 100];
      }
    },

    infinite: {
      type: Boolean,
      default: false
    },

    hasNext: {
      type: Boolean,
      default: true
    }
  },

  render(h) {
    let template = <div class='s-pagination'></div>;
    const layout = this.infinite ? 'sizes, prev, pager, next' : (this.layout || '');
    if (!layout) return;
    const TEMPLATE_MAP = {
      prev: <prev></prev>,
      jumper: <jumper></jumper>,
      pager: <pager currentPage={ this.internalCurrentPage } pageCount={ this.internalPageCount } infinite={ this.infinite } hasNext={ this.hasNext }  on-change={ this.handleCurrentChange }></pager>,
      next: <next></next>,
      sizes: <sizes pageSizes={ this.pageSizes }></sizes>,
      slot: <my-slot></my-slot>,
      total: <total></total>
    };
    const components = layout.split(',').map((item) => item.trim());
    const rightWrapper = <div class="s-pagination__rightwrapper"></div>;
    let haveRightWrapper = false;

    if (this.small) {
      template.data.class += ' s-pagination--small';
    }

    components.forEach(compo => {
      if (compo === '->') {
        haveRightWrapper = true;
        return;
      }

      if (!haveRightWrapper) {
        template.children.push(TEMPLATE_MAP[compo]);
      } else {
        rightWrapper.children.push(TEMPLATE_MAP[compo]);
      }
    });

    if (haveRightWrapper) {
      template.children.push(rightWrapper);
    }

    return template;
  },

  components: {
    MySlot: {
      render(h) {
        return (
          this.$parent.$slots.default
          ? this.$parent.$slots.default[0]
          : ''
        );
      }
    },
    Prev: {
      render(h) {
        return (
          <button
            type="button"
            class={['btn-prev', { disabled: this.$parent.internalCurrentPage <= 1 }]}
            on-click={ this.$parent.prev }>
            <i class="s-icon s-icon-arrow-left"></i>
          </button>
        );
      }
    },

    Next: {
      render(h) {
        let nextDisable = false;
        if(this.$parent.infinite){
          if(!this.$parent.hasNext && this.$parent.internalCurrentPage === this.$parent.internalPageCount){
            nextDisable = true;
          }
        }else {
          if(this.$parent.internalCurrentPage === this.$parent.internalPageCount){
            nextDisable = true;
          }
        }
        return (
          <button
            type="button"
            class={[
              'btn-next',
              { disabled: nextDisable || this.$parent.internalPageCount === 0 }
            ]}
            on-click={ this.$parent.next }>
            <i class="s-icon s-icon-arrow-right"></i>
          </button>
        );
      }
    },

    Sizes: {
      mixins: [Locale],

      props: {
        pageSizes: Array
      },

      watch: {
        pageSizes: {
          immediate: true,
          handler(value) {
            if (Array.isArray(value)) {
              this.$parent.internalPageSize = value.indexOf(this.$parent.pageSize) > -1
                ? this.$parent.pageSize
                : this.pageSizes[0];
            }
          }
        }
      },

      render(h) {
        return (
          <span class="s-pagination__sizes">
            <s-select
              value={ this.$parent.internalPageSize }
              on-input={ this.handleChange }>
              {
                this.pageSizes.map(item =>
                  <s-option
                    value={ item }
                    label={ item + ' ' + this.t('s.pagination.pagesize') }>
                  </s-option>
                )
              }
            </s-select>
          </span>
        );
      },

      components: {
        sSelect,
        sOption
      },

      methods: {
        handleChange(val) {
          if (val !== this.$parent.internalPageSize) {
            this.$parent.internalPageSize = val = parseInt(val, 10);
            this.$parent.$emit('size-change', val);
          }
        }
      }
    },

    Jumper: {
      mixins: [Locale],

      data() {
        return {
          oldValue: null
        };
      },

      methods: {
        handleFocus(event) {
          this.oldValue = event.target.value;
        },

        handleChange({ target }) {
          this.$parent.internalCurrentPage = this.$parent.getValidCurrentPage(target.value);
          this.oldValue = null;
        }
      },

      render(h) {
        return (
          <span class="s-pagination__jump">
            { this.t('s.pagination.goto') }
            <input
              class="s-pagination__editor"
              type="number"
              min={ 1 }
              max={ this.internalPageCount }
              domProps-value={ this.$parent.internalCurrentPage }
              on-change={ this.handleChange }
              on-focus={ this.handleFocus }
              style={{ width: '30px' }}
              number/>
            { this.t('s.pagination.pageClassifier') }
          </span>
        );
      }
    },

    Total: {
      mixins: [Locale],

      render(h) {
        return (
          typeof this.$parent.total === 'number'
            ? <span class="s-pagination__total">{ this.t('s.pagination.total', { total: this.$parent.total }) }</span>
            : ''
        );
      }
    },

    Pager
  },

  methods: {
    handleCurrentChange(val) {
      this.internalCurrentPage = this.getValidCurrentPage(val);
    },

    prev() {
      const newVal = this.internalCurrentPage - 1;
      this.internalCurrentPage = this.getValidCurrentPage(newVal);
    },

    next() {
      const newVal = this.internalCurrentPage + 1;
      this.internalCurrentPage = this.getValidCurrentPage(newVal);
    },

    getValidCurrentPage(value) {
      value = parseInt(value, 10);

      const havePageCount = typeof this.internalPageCount === 'number';

      let resetValue;
      if (!havePageCount) {
        if (isNaN(value) || value < 1) resetValue = 1;
      } else {
        if (value < 1) {
          resetValue = 1;
        } else if (value > this.internalPageCount) {
          resetValue = this.internalPageCount;
        }
      }

      if (resetValue === undefined && isNaN(value)) {
        resetValue = 1;
      } else if (resetValue === 0) {
        resetValue = 1;
      }

      if(this.infinite && this.hasNext && (isNaN(value) || value<1)){
        return 1;
      }
      return (resetValue === undefined || (this.infinite && this.hasNext))? value : resetValue;
    }
  },

  computed: {
    internalPageCount() {
      if (typeof this.total === 'number') {
        return Math.ceil(this.total / this.internalPageSize);
      } else if (typeof this.pageCount === 'number') {
        return this.pageCount;
      }
      return null;
    }
  },

  watch: {
    currentPage: {
      immediate: true,
      handler(val) {
        this.internalCurrentPage = val;
      }
    },

    pageSize: {
      immediate: true,
      handler(val) {
        this.internalPageSize = val;
      }
    },

    internalCurrentPage(newVal, oldVal) {
      newVal = parseInt(newVal, 10);

      /* istanbul ignore if */
      if (isNaN(newVal)) {
        newVal = oldVal || 1;
      } else {
        newVal = this.getValidCurrentPage(newVal);
      }

      if (newVal !== undefined) {
        this.$nextTick(() => {
          this.internalCurrentPage = newVal;
          if (oldVal !== newVal) {
            this.$emit('current-change', this.internalCurrentPage);
          }
        });
      } else {
        this.$emit('current-change', this.internalCurrentPage);
      }
    },

    internalPageCount(newVal) {
      /* istanbul ignore if */
      if(!this.infinite) {
        const oldPage = this.internalCurrentPage;
        if (newVal > 0 && oldPage === 0) {
          this.internalCurrentPage = 1;
        } else if (oldPage > newVal) {
          this.internalCurrentPage = newVal === 0 ? 1 : newVal;
        }
      }
    }
  }
};
</script>
<style>
  @charset "UTF-8";
  /*@import "./select.css";*/
  @import "../../theme-default/common/var.css";

  @component-namespace s {
    @b pagination {
      white-space: nowrap;
      padding: 2px 5px;
      color: var(--pagination-color);
      @utils-clearfix;

      span,
      button {
        display: inline-block;
        font-size: var(--pagination-font-size);
        min-width: var(--pagination-button-size);
        height: var(--pagination-button-size);
        line-height: var(--pagination-button-size);
        vertical-align: top;
        box-sizing: border-box;
      }

      .s-select .s-input {
        width: 110px;
      input {
        padding-right: 25px;
        border-radius: var(--border-radius-small);
        height: 28px;
      }
    }

    button {
      border: none;
      padding: 0 6px;
      background: transparent;

  &:focus {
     outline: none;
   }

  &:hover {
     color: var(--pagination-hover-fill);
   }

  &.disabled {
     color: var(--pagination-button-disabled-color);
     background-color: var(--pagination-button-disabled-fill);
     cursor: not-allowed;
   }
  }

  .btn-prev,
  .btn-next {
    background: center center no-repeat;
    background-size: 16px;
    background-color: var(--pagination-fill);
    border: 1px solid var(--pagination-border-color);
    cursor: pointer;
    margin: 0;
    color: var(--pagination-button-color);

  .s-icon {
    display: block;
    font-size: 12px;
  }
  }

  .btn-prev {
    border-radius: var(--pagination-border-radius) 0 0 var(--pagination-border-radius);
    border-right: 0;
  }

  .btn-next {
    border-radius: 0 var(--pagination-border-radius) var(--pagination-border-radius) 0;
    border-left: 0;
  }

  @m small {
    .btn-prev,
    .btn-next,
    .s-pager li,
    .s-pager li:last-child {
      border-color: transparent;
      font-size: 12px;
      line-height: 22px;
      height: 22px;
      min-width: 22px;
    }

    .arrow.disabled {
      visibility: hidden;
    }

    .s-pager li {
      border-radius: var(--pagination-border-radius);
    }
  }

  @e sizes {
    margin: 0 10px 0 0;

    .s-input .s-input__inner {
      font-size: 13px;
      border-color: var(--pagination-border-color);

  &:hover {
     border-color: var(--pagination-hover-fill);
   }
  }
  }

  @e jump {
    margin-left: 10px;
  }

  @e total {
    margin: 0 10px;
  }

  @e rightwrapper {
    float: right;
  }

  @e editor {
    border: 1px solid var(--pagination-border-color);
    border-radius: var(--pagination-border-radius);
    line-height: 18px;
    padding: 4px 2px;
    width: 30px;
    text-align: center;
    margin: 0 6px;
    box-sizing: border-box;
    transition: border .3s;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
     -webkit-appearance: none;
     margin: 0;
   }

  &:focus {
     outline: none;
     border-color: var(--pagination-hover-fill);
   };
  }
  }

  @b pager {
    user-select: none;
    list-style: none;
    display: inline-block;
    vertical-align: top;
    font-size: 0;
    padding: 0;
    margin: 0;

    li {
      padding: 0 4px;
      border: 1px solid var(--pagination-border-color);
      border-right: 0;
      background: var(--pagination-fill);
      vertical-align: top;
      display: inline-block;
      font-size: var(--pagination-font-size);
      min-width: var(--pagination-button-size);
      height: var(--pagination-button-size);
      line-height: var(--pagination-button-size);
      cursor: pointer;
      box-sizing: border-box;
      text-align: center;
      margin: 0;

  &:last-child {
     border-right: 1px solid var(--pagination-border-color);
   }

  &.btn-quicknext,
  &.btn-quickprev {
     line-height: 28px;
     color: var(--pagination-button-color);
   }

  &.btn-quickprev:hover {
     cursor: pointer;
   }

  &.btn-quicknext:hover {
     cursor: pointer;
   }

  &.active + li {
     border-left: 0;
     padding-left: 5px;
   }

  &:hover {
     color: var(--pagination-hover-fill);
   }

  &.active {
     border-color: var(--pagination-hover-fill);
     background-color: var(--pagination-hover-fill);
     color: var(--pagination-hover-color);
     cursor: default;
   }
  }
  }
  }

</style>
