<template>
  <div class="s-tree" :class="{ 's-tree--highlight-current': highlightCurrent }">
    <s-tree-node
      v-for="child in root.childNodes"
      :node="child"
      :props="props"
      :key="getNodeKey(child)"
      :render-content="renderContent"
      @node-expand="handleNodeExpand">
    </s-tree-node>
    <div class="s-tree__empty-block" v-if="!root.childNodes || root.childNodes.length === 0">
      <span class="s-tree__empty-text">{{ emptyText }}</span>
    </div>
  </div>
</template>

<script type="text/babel">
  import TreeStore from './model/tree-store';
  import {t} from '../../../extra/locale';
  import emitter from '../../../extra/mixins/emitter';
  import sTreeNode from './tree-node';

  export default {
    name: 'sTree',

    mixins: [emitter],

    components: {
      sTreeNode
    },

    data() {
      return {
        store: null,
        root: null,
        currentNode: null
      };
    },

    props: {
      data: {
        type: Array
      },
      emptyText: {
        type: String,
        default() {
          return t('el.tree.emptyText');
        }
      },
      nodeKey: String,
      checkStrictly: Boolean,
      defaultExpandAll: Boolean,
      expandOnClickNode: {
        type: Boolean,
        default: true
      },
      autoExpandParent: {
        type: Boolean,
        default: true
      },
      defaultCheckedKeys: Array,
      defaultExpandedKeys: Array,
      renderContent: Function,
      showCheckbox: {
        type: Boolean,
        default: false
      },
      props: {
        default() {
          return {
            children: 'children',
            label: 'label',
            icon: 'icon'
          };
        }
      },
      lazy: {
        type: Boolean,
        default: false
      },
      highlightCurrent: Boolean,
      currentNodeKey: [String, Number],
      load: Function,
      filterNodeMethod: Function,
      accordion: Boolean,
      indent: {
        type: Number,
        default: 16
      }
    },

    computed: {
      children: {
        set(value) {
          this.data = value;
        },
        get() {
          return this.data;
        }
      }
    },

    watch: {
      defaultCheckedKeys(newVal) {
        this.store.defaultCheckedKeys = newVal;
        this.store.setDefaultCheckedKey(newVal);
      },
      defaultExpandedKeys(newVal) {
        this.store.defaultExpandedKeys = newVal;
        this.store.setDefaultExpandedKeys(newVal);
      },
      currentNodeKey(newVal) {
        this.store.setCurrentNodeKey(newVal);
        this.store.currentNodeKey = newVal;
      },
      data(newVal) {
        this.store.setData(newVal);
      }
    },

    methods: {
      filter(value) {
        if (!this.filterNodeMethod) throw new Error('[Tree] filterNodeMethod is required when filter');
        this.store.filter(value);
      },
      getNodeKey(node, index) {
        const nodeKey = this.nodeKey;
        if (nodeKey && node) {
          return node.data[nodeKey];
        }
        return index;
      },
      getCheckedNodes(leafOnly) {
        return this.store.getCheckedNodes(leafOnly);
      },
      getCheckedKeys(leafOnly) {
        return this.store.getCheckedKeys(leafOnly);
      },
      setCheckedNodes(nodes, leafOnly) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedNodes');
        this.store.setCheckedNodes(nodes, leafOnly);
      },
      setCheckedKeys(keys, leafOnly) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedNodes');
        this.store.setCheckedKeys(keys, leafOnly);
      },
      setChecked(data, checked, deep) {
        this.store.setChecked(data, checked, deep);
      },
      handleNodeExpand(nodeData, node, instance) {
        this.broadcast('sTreeNode', 'tree-node-expand', node);
        this.$emit('node-expand', nodeData, node, instance);
      }
    },

    created() {
      this.isTree = true;

      this.store = new TreeStore({
        key: this.nodeKey,
        data: this.data,
        lazy: this.lazy,
        props: this.props,
        load: this.load,
        currentNodeKey: this.currentNodeKey,
        checkStrictly: this.checkStrictly,
        defaultCheckedKeys: this.defaultCheckedKeys,
        defaultExpandedKeys: this.defaultExpandedKeys,
        autoExpandParent: this.autoExpandParent,
        defaultExpandAll: this.defaultExpandAll,
        filterNodeMethod: this.filterNodeMethod
      });

      this.root = this.store.root;
    }
  };
</script>

<style>
  @charset "UTF-8";
  @import "../../theme-default/common/var.css";

  @component-namespace s {
    @b tree {
      cursor: default;
      background: var(--color-white);
      border: 1px solid var(--color-base-gray);

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
    }

    @b tree-node {
      white-space: nowrap;

      @e content {
        line-height: 36px;
        height: 36px;
        cursor: pointer;

      & > .s-checkbox,
      & > .s-tree-node__expand-icon {
            margin-right: 8px;
          }
      & > .s-checkbox {
            vertical-align: middle;
          }
      &:hover {
         background: var(--color-light-gray);
       }
      }

      @e expand-icon {
        display: inline-block;
        cursor: pointer;
        width: 0;
        height: 0;
        vertical-align: middle;
        margin-left: 10px;
        border: 6px solid transparent;
        border-right-width: 0;
        border-left-color: var(--color-light-silver);
        border-left-width: 7px;

        transform: rotate(0deg);
        transition: transform 0.3s ease-in-out;

      &:hover {
         border-left-color: #999;
       }

      &.expanded {
         transform: rotate(90deg);
       }

      &.is-leaf {
         border-color: transparent;
         cursor: default;
       }
      }

      @e label {
        font-size: 14px;
        vertical-align: middle;
        display: inline-block;
      }

      @e loading-icon {
        display: inline-block;
        vertical-align: middle;
        margin-right: 4px;
        font-size: 14px;
        color: var(--color-light-silver);
      }

    & > .s-tree-node__children {
          overflow: hidden;
          background-color: transparent;
        }

    &.is-expanded > .s-tree-node__children {
       display: block;
     }
    }
  }

  .s-tree--highlight-current .s-tree-node.is-current > .s-tree-node__content {
    background-color: color(var(--color-primary) tint(92%));
  }
</style>
