<template>
  <div class="s-table"
    :class="{
      's-table--fit': fit,
      's-table--striped': stripe,
      's-table--border': border,
      's-table--fluid-height': maxHeight,
      's-table--enable-row-hover': !store.states.isComplex,
      's-table--enable-row-transition': true || (store.states.data || []).length !== 0 && (store.states.data || []).length < 100
    }"
    @mouseleave="handleMouseLeave($event)"
    :style="[tableHeight]">
    <div class="hidden-columns" ref="hiddenColumns"><slot></slot></div>
    <div class="s-table__header-wrapper" ref="headerWrapper" v-if="showHeader">
      <table-header
        :store="store"
        :layout="layout"
        :border="border"
        :default-sort="defaultSort"
        :style="{ width: layout.bodyWidth ? layout.bodyWidth + 'px' : '' }">
      </table-header>
    </div>
    <div
      class="s-table__body-wrapper"
      ref="bodyWrapper"
      :style="[bodyHeight]">
      <table-body
        :context="context"
        :store="store"
        :layout="layout"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :highlight="highlightCurrentRow"
        :style="{ width: bodyWidth }">
      </table-body>
      <div :style="{ width: bodyWidth }" class="s-table__empty-block" v-if="!data || data.length === 0">
        <span class="s-table__empty-text"><slot name="empty">{{ emptyText || t('s.table.emptyText') }}</slot></span>
      </div>
    </div>
    <div class="s-table__fixed" ref="fixedWrapper"
      v-if="fixedColumns.length > 0"
      :style="[
        { width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' },
        fixedHeight
      ]">
      <div class="s-table__fixed-header-wrapper" ref="fixedHeaderWrapper" v-if="showHeader">
        <table-header
          fixed="left"
          :border="border"
          :store="store"
          :layout="layout"
          :style="{ width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' }"></table-header>
      </div>
      <div class="s-table__fixed-body-wrapper" ref="fixedBodyWrapper"
        :style="[
          { top: layout.headerHeight + 'px' },
          fixedBodyHeight
        ]">
        <table-body
          fixed="left"
          :store="store"
          :layout="layout"
          :highlight="highlightCurrentRow"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :style="{ width: layout.fixedWidth ? layout.fixedWidth + 'px' : '' }">
        </table-body>
      </div>
    </div>
    <div class="s-table__fixed-right" ref="rightFixedWrapper"
      v-if="rightFixedColumns.length > 0"
      :style="[
        { width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' },
        { right: layout.scrollY ? (border ? layout.gutterWidth : (layout.gutterWidth || 1)) + 'px' : '' },
        fixedHeight
      ]">
      <div class="s-table__fixed-header-wrapper" ref="rightFixedHeaderWrapper" v-if="showHeader">
        <table-header
          fixed="right"
          :border="border"
          :store="store"
          :layout="layout"
          :style="{ width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' }"></table-header>
      </div>
      <div class="s-table__fixed-body-wrapper" ref="rightFixedBodyWrapper"
        :style="[
          { top: layout.headerHeight + 'px' },
          fixedBodyHeight
        ]">
        <table-body
          fixed="right"
          :store="store"
          :layout="layout"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :highlight="highlightCurrentRow"
          :style="{ width: layout.rightFixedWidth ? layout.rightFixedWidth + 'px' : '' }">
        </table-body>
      </div>
    </div>
    <div class="s-table__fixed-right-patch"
      v-if="rightFixedColumns.length > 0"
      :style="{ width: layout.scrollY ? layout.gutterWidth + 'px' : '0', height: layout.headerHeight + 'px' }"></div>
    <div class="s-table__column-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div>
  </div>
</template>

<script type="text/babel">
  import sCheckbox from '../../checkbox';
  import throttle from '../../../extra/throttle-debounce/throttle';
  import debounce from '../../../extra/throttle-debounce/debounce';
  import { addResizeListener, removeResizeListener } from '../../../extra/utils/resize-event';
  import Locale from '../../../extra/mixins/locale';
  import TableStore from './table-store';
  import TableLayout from './table-layout';
  import TableBody from './table-body';
  import TableHeader from './table-header';
  import { mousewheel } from './util';

  let tableIdSeed = 1;

  export default {
    name: 'sTable',

    mixins: [Locale],

    props: {
      data: {
        type: Array,
        default: function() {
          return [];
        }
      },

      width: [String, Number],

      height: [String, Number],

      maxHeight: [String, Number],

      fit: {
        type: Boolean,
        default: true
      },

      stripe: Boolean,

      border: Boolean,

      rowKey: [String, Function],

      context: {},

      showHeader: {
        type: Boolean,
        default: true
      },

      rowClassName: [String, Function],

      rowStyle: [Object, Function],

      highlightCurrentRow: Boolean,

      currentRowKey: [String, Number],

      emptyText: String,

      expandRowKeys: Array,

      defaultExpandAll: Boolean,

      defaultSort: Object
    },

    components: {
      TableHeader,
      TableBody,
      sCheckbox
    },

    methods: {
      toggleRowSelection(row, selected) {
        this.store.toggleRowSelection(row, selected);
        this.store.updateAllSelected();
      },

      clearSelection() {
        this.store.clearSelection();
      },

      handleMouseLeave() {
        this.store.commit('setHoverRow', null);
        if (this.hoverState) this.hoverState = null;
      },

      updateScrollY() {
        this.layout.updateScrollY();
      },

      bindEvents() {
        const { headerWrapper } = this.$refs;
        const refs = this.$refs;
        this.bodyWrapper.addEventListener('scroll', function() {
          if (headerWrapper) headerWrapper.scrollLeft = this.scrollLeft;
          if (refs.fixedBodyWrapper) refs.fixedBodyWrapper.scrollTop = this.scrollTop;
          if (refs.rightFixedBodyWrapper) refs.rightFixedBodyWrapper.scrollTop = this.scrollTop;
        });

        if (headerWrapper) {
          mousewheel(headerWrapper, throttle(16, event => {
            const deltaX = event.deltaX;

            if (deltaX > 0) {
              this.bodyWrapper.scrollLeft += 10;
            } else {
              this.bodyWrapper.scrollLeft -= 10;
            }
          }));
        }

        if (this.fit) {
          this.windowResizeListener = throttle(50, () => {
            if (this.$ready) this.doLayout();
          });
          addResizeListener(this.$el, this.windowResizeListener);
        }
      },

      doLayout() {
        this.store.updateColumns();
        this.layout.update();
        this.updateScrollY();
        this.$nextTick(() => {
          if (this.height) {
            this.layout.setHeight(this.height);
          } else if (this.maxHeight) {
            this.layout.setMaxHeight(this.maxHeight);
          } else if (this.shouldUpdateHeight) {
            this.layout.updateHeight();
          }
        });
      }
    },

    created() {
      this.tableId = 's-table_' + tableIdSeed + '_';
      this.debouncedLayout = debounce(50, () => this.doLayout());
    },

    computed: {
      bodyWrapper() {
        return this.$refs.bodyWrapper;
      },

      shouldUpdateHeight() {
        return typeof this.height === 'number' ||
          this.fixedColumns.length > 0 ||
          this.rightFixedColumns.length > 0;
      },

      selection() {
        return this.store.selection;
      },

      columns() {
        return this.store.states.columns;
      },

      tableData() {
        return this.store.states.data;
      },

      fixedColumns() {
        return this.store.states.fixedColumns;
      },

      rightFixedColumns() {
        return this.store.states.rightFixedColumns;
      },

      bodyHeight() {
        let style = {};

        if (this.height) {
          style = {
            height: this.layout.bodyHeight ? this.layout.bodyHeight + 'px' : ''
          };
        } else if (this.maxHeight) {
          style = {
            'max-height': (this.showHeader ? this.maxHeight - this.layout.headerHeight : this.maxHeight) + 'px'
          };
        }

        return style;
      },

      tableHeight() {
        let style = {};

        const height = this.layout.tableHeight ? this.layout.tableHeight + 'px' : '';

        if (this.height) {
          style = {
            height
          };
        } else if (this.maxHeight) {
          style = {
            'max-height': height
          };
        }

        return style;
      },

      bodyWidth() {
        const { bodyWidth, scrollY, gutterWidth } = this.layout;
        return bodyWidth ? bodyWidth - (scrollY ? gutterWidth : 0) + 'px' : '';
      },

      fixedBodyHeight() {
        let style = {};

        if (this.height) {
          style = {
            height: this.layout.fixedBodyHeight ? this.layout.fixedBodyHeight + 'px' : ''
          };
        } else if (this.maxHeight) {
          let maxHeight = this.layout.scrollX ? this.maxHeight - this.layout.gutterWidth : this.maxHeight;

          if (this.showHeader) {
            maxHeight -= this.layout.headerHeight;
          }

          style = {
            'max-height': maxHeight + 'px'
          };
        }

        return style;
      },

      fixedHeight() {
        let style = {};

        if (this.maxHeight) {
          style = {
            bottom: (this.layout.scrollX && this.data.length) ? this.layout.gutterWidth + 'px' : ''
          };
        } else {
          style = {
            height: this.layout.viewportHeight ? this.layout.viewportHeight + 'px' : ''
          };
        }

        return style;
      }
    },

    watch: {
      height(value) {
        this.layout.setHeight(value);
      },

      currentRowKey(newVal) {
        this.store.setCurrentRowKey(newVal);
      },

      data: {
        immediate: true,
        handler(val) {
          this.store.commit('setData', val);
        }
      },

      expandRowKeys(newVal) {
        this.store.setExpandRowKeys(newVal);
      }
    },

    destroyed() {
      if (this.windowResizeListener) removeResizeListener(this.$el, this.windowResizeListener);
    },

    mounted() {
      this.bindEvents();
      this.doLayout();

      this.$ready = true;
    },

    data() {
      const store = new TableStore(this, {
        rowKey: this.rowKey,
        defaultExpandAll: this.defaultExpandAll
      });
      const layout = new TableLayout({
        store,
        table: this,
        fit: this.fit,
        showHeader: this.showHeader
      });
      return {
        store,
        layout,
        renderExpanded: null,
        resizeProxyVisible: false
      };
    }
  };
</script>
<style>
  @charset "UTF-8";
  /*@import "./tag.css";*/
  @import "../../theme-default/common/var.css";

  @component-namespace s {

  @b table {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    background-color: var(--color-white);
    border: 1px solid var(--table-border-color);
    font-size: 14px;
    color: var(--table-text-color);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: var(--table-border-color);
      z-index: 1;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 1px;
      height: 100%;
      background-color: var(--table-border-color);
      z-index: 1;
    }

    .s-tooltip.cell {
      white-space: nowrap;
    }

    @e empty-block {
      position: relative;
      min-height: 60px;
      text-align: center;
      width: 100%;
      height: 100%;
    }

    @e empty-text {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: color(var(--color-primary) s(16%) l(44%));
    }

    @e expand-column {
      .cell {
        padding: 0;
        text-align: center;
      }
    }

    @e expand-icon {
      position: relative;
      cursor: pointer;
      color: #666;
      font-size: 12px;
      transition: transform 0.2s ease-in-out;
      height: 40px;

      @m expanded {
        transform: rotate(90deg);
      }

      > .s-icon {
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -5px;
        margin-top: -5px;
      }
    }

    @e expanded-cell {
      padding: 20px 50px;
      background-color: var(--color-dark-white);
      box-shadow: inset 0 2px 0 #f4f4f4;

      &:hover {
        background-color: var(--color-dark-white) !important;
      }
    }

    @modifier fit {
      border-right: 0;
      border-bottom: 0;

      & th.gutter, td.gutter {
        border-right-width: 1px;
      }
    }

    & th {
      white-space: nowrap;
      overflow: hidden;
    }

    & th, td {
      height: 40px;
      min-width: 0;
      box-sizing: border-box;
      text-overflow: ellipsis;
      vertical-align: middle;
      position: relative;

      @when center {
        text-align: center;
      }

      @when left {
        text-align: left;
      }

      @when right {
        text-align: right;
      }
    }

    & th.is-leaf, td {
      border-bottom: 1px solid var(--table-border-color);
    }

    @modifier border {
      & th, td {
        border-right: 1px solid var(--table-border-color);
      }

      & th {
        border-bottom: 1px solid var(--table-border-color);
      }
    }

    & th {
      background-color: var(--table-header-background);
      text-align: left;
    }

    & th > div {
      display: inline-block;
      padding-left: 18px;
      padding-right: 18px;
      line-height: 40px;
      box-sizing: border-box;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    & td > div {
      box-sizing: border-box;
    }

    @e fixed, fixed-right {
      position: absolute;
      top: 0;
      left: 0;
      box-shadow: 1px 0 8px #d3d4d6;
      overflow-x: hidden;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background-color: var(--table-border-color);
        z-index: 4;
      }
    }

    @e fixed-right-patch {
      position: absolute;
      top: -1px;
      right: 0;
      background-color: var(--table-header-background);
      border-bottom: 1px solid var(--table-border-color);
    }

    @e fixed-right {
      top: 0;
      left: auto;
      right: 0;

      box-shadow: -1px 0 8px #d3d4d6;

      .s-table__fixed-header-wrapper, .s-table__fixed-body-wrapper {
        left: auto;
        right: 0;
      }
    }

    @e fixed-header-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 3;

      & thead div {
        background-color: var(--table-header-background);
        color: var(--table-text-color);
      }
    }

    @e fixed-body-wrapper {
      position: absolute;
      left: 0;
      top: 37px;
      overflow: hidden;
      z-index: 3;
    }

    @e header-wrapper, body-wrapper {
      width: 100%;
    }

    @e header, body {
      table-layout: fixed;
    }

    @e header-wrapper {
      overflow: hidden;

      & thead div {
        background-color: var(--table-header-background);
        color: var(--table-text-color);
      }
    }

    @e body-wrapper {
      overflow: auto;
      position: relative;
    }

    & th.required > div::before {
      display: inline-block;
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ff4d51;
      margin-right: 5px;
      vertical-align: middle;
    }

    & th > .cell {
      position: relative;
      word-wrap: normal;
      text-overflow: ellipsis;
      display: inline-block;
      line-height: 20px;
      vertical-align: middle;
      width: 100%;
      box-sizing: border-box;

      &.highlight {
        color: var(--color-primary);
      }
    }

    & .caret-wrapper {
      position: relative;
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
      margin-left: 5px;
      margin-top: -2px;
      width: 16px;
      height: 34px;
      overflow: initial;
    }

    & .sort-caret {
      display: inline-block;
      width: 0;
      height: 0;
      border: 0;
      content: "";
      position: absolute;
      left: 3px;
      z-index: 2;

      &.ascending {
        top: 11px;
        border-top: none;
        border-right: 5px solid transparent;
        border-bottom: 5px solid var(--color-light-silver);
        border-left: 5px solid transparent;
      }

      &.descending {
        bottom: 11px;
        border-top: 5px solid var(--color-light-silver);
        border-right: 5px solid transparent;
        border-bottom: none;
        border-left: 5px solid transparent;
      }
    }

    & .ascending .sort-caret.ascending {
      border-bottom-color: var(--color-extra-light-black);
    }

    & .descending .sort-caret.descending {
      border-top-color: var(--color-extra-light-black);
    }

    & th.gutter, td.gutter {
      width: 15px;
      border-right-width: 0;
      border-bottom-width: 0;
      padding: 0;
    }

    & td.gutter {
      width: 0;
    }

    & td.is-hidden, th.is-hidden {
      > * {
        visibility: hidden;
      }
    }

    & .cell {
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
      word-break: break-all;
      line-height: 24px;
      padding-left: 18px;
      padding-right: 18px;
    }

    & tr input[type="checkbox"] {
      margin: 0;
    }

    & tr {
      background-color: var(--color-white);
    }

    @modifier striped {
      & .s-table__body {
        & tr:nth-child(2n) {
          td {
            background: #FAFAFA;
          }

          &.current-row td {
            background: color(var(--color-primary) tint(92%));
          }
        }
      }
    }

    @e body {
      tr.hover-row > td {
        background-color: var(--color-extra-light-gray);
      }

      tr.current-row > td {
        background: color(var(--color-primary) tint(92%));
      }
    }

    @e column-resize-proxy {
      position: absolute;
      left: 200px;
      top: 0;
      bottom: 0;
      width: 0;
      border-left: 1px solid var(--table-border-color);
      z-index: 10;
    }

    & .hidden-columns {
      visibility: hidden;
      position: absolute;
      z-index: -1;
    }

    @e column-filter-trigger {
      display: inline-block;
      line-height: 34px;
      margin-left: 5px;
      cursor: pointer;

      & i {
        color: var(--color-light-silver);
      }
    }

    @modifier enable-row-transition {
      .s-table__body td {
        transition: background-color .25s ease;
      }
    }

    @modifier enable-row-hover {
      tr:hover > td {
        background-color: var(--color-extra-light-gray);
      }
    }

    @modifier fluid-height {
      .s-table__fixed,
      .s-table__fixed-right {
        bottom: 0;
        overflow: hidden;
      }
    }
  }

  @b table-column {
    @m selection .cell {
      padding-left: 14px;
      padding-right: 14px;
    }
  }

  @b table-filter {
    border: solid 1px var(--color-base-gray);
    border-radius: 2px;
    background-color: var(--color-white);
    box-shadow: var(--dropdown-menu-box-shadow);
    box-sizing: border-box;
    margin: 2px 0;

    /** used for dropdown mode */
    @e list {
      padding: 5px 0;
      margin: 0;
      list-style: none;
      min-width: 100px;
    }

    @e list-item {
      line-height: 36px;
      padding: 0 10px;
      cursor: pointer;
      font-size: var(--font-size-base);

      &:hover {
        background-color: var(--dropdown-menuItem-hover-fill);
        color: var(--dropdown-menuItem-hover-color);
      }

      @when active {
        background-color: var(--color-primary);
        color: var(--color-white);
      }
    }

    @e content {
      min-width: 100px;
    }

    @e bottom {
      border-top: 1px solid var(--color-base-gray);
      padding: 8px;

      button {
        background: transparent;
        border: none;
        color: var(--color-base-silver);
        cursor: pointer;
        font-size: var(--font-size-base);
        padding: 0 3px;

        &:hover {
          color: var(--color-primary);
        }

        &:focus {
          outline: none;
        }

        &.is-disabled {
          color: var(--color-extra-light-silver);
          cursor: not-allowed;
        }
      }
    }

    @e checkbox-group {
      padding: 10px;

      .s-checkbox {
        display: block;
        margin-bottom: 8px;
        margin-left: 5px;
      }

      .s-checkbox:last-child {
        margin-bottom: 0;
      }
    }
  }
}

</style>
