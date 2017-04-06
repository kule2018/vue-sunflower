<template>
  <div class="s-tree-node"
    @click.stop="handleClick"
    v-show="node.visible"
    :class="{
      'is-expanded': childNodeRendered && expanded,
      'is-current': tree.store.currentNode === node,
      'is-hidden': !node.visible
    }">
    <div class="s-tree-node__content"
      :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px' }">
      <span
        class="s-tree-node__expand-icon"
        @click.stop="handleExpandIconClick"
        :class="{ 'is-leaf': node.isLeaf, expanded: !node.isLeaf && expanded }">
      </span>
      <s-checkbox
        v-if="showCheckbox"
        v-model="node.checked"
        :indeterminate="node.indeterminate"
        @change="handleCheckChange"
        @click.native.stop="handleUserClick">
      </s-checkbox>
      <span
        v-if="node.loading"
        class="s-tree-node__loading-icon s-icon-loading">
      </span>
      <node-content :node="node"></node-content>
    </div>
    <collapse-transition>
      <div
        class="s-tree-node__children"
        v-show="expanded">
        <s-tree-node
          :render-content="renderContent"
          v-for="child in node.childNodes"
          :key="getNodeKey(child)"
          :node="child"
          @node-expand="handleChildNodeExpand">
        </s-tree-node>
      </div>
    </collapse-transition>
  </div>
</template>

<script type="text/jsx">
  import CollapseTransition from '../../../extra/transitions/collapse-transition';
  import sCheckbox from '../../checkbox';
  import emitter from '../../../extra/mixins/emitter';

  export default {
    name: 'sTreeNode',

    componentName: 'sTreeNode',

    mixins: [emitter],

    props: {
      node: {
        default() {
          return {};
        }
      },
      props: {},
      renderContent: Function
    },

    components: {
      sCheckbox,
      CollapseTransition,
      NodeContent: {
        props: {
          node: {
            required: true
          }
        },
        render(h) {
          const parent = this.$parent;
          const node = this.node;
          const data = node.data;
          const store = node.store;
          return (
            parent.renderContent
              ? parent.renderContent.call(parent._renderProxy, h, { _self: parent.tree.$vnode.context, node, data, store })
              : <span class="s-tree-node__label">{ this.node.label }</span>
          );
        }
      }
    },

    data() {
      return {
        tree: null,
        expanded: false,
        childNodeRendered: false,
        showCheckbox: false,
        oldChecked: null,
        oldIndeterminate: null
      };
    },

    watch: {
      'node.indeterminate'(val) {
        this.handleSelectChange(this.node.checked, val);
      },

      'node.checked'(val) {
        this.handleSelectChange(val, this.node.indeterminate);
      },

      'node.expanded'(val) {
        this.expanded = val;
        if (val) {
          this.childNodeRendered = true;
        }
      }
    },

    methods: {
      getNodeKey(node, index) {
        const nodeKey = this.tree.nodeKey;
        if (nodeKey && node) {
          return node.data[nodeKey];
        }
        return index;
      },

      handleSelectChange(checked, indeterminate) {
        if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
          this.tree.$emit('check-change', this.node.data, checked, indeterminate);
        }
        this.oldChecked = checked;
        this.indeterminate = indeterminate;
      },

      handleClick() {
        const store = this.tree.store;
        store.setCurrentNode(this.node);
        this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode);
        this.tree.currentNode = this;
        if (this.tree.expandOnClickNode) {
          this.handleExpandIconClick();
        }
        this.tree.$emit('node-click', this.node.data, this.node, this);
      },

      handleExpandIconClick() {
        if (this.node.isLeaf) return;
        if (this.expanded) {
          this.tree.$emit('node-collapse', this.node.data, this.node, this);
          this.node.collapse();
        } else {
          this.node.expand();
          this.$emit('node-expand', this.node.data, this.node, this);
        }
      },

      handleUserClick() {
        if (this.node.indeterminate) {
          this.node.setChecked(this.node.checked, !this.tree.checkStrictly);
        }
      },

      handleCheckChange(ev) {
        if (!this.node.indeterminate) {
          this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
        }
      },

      handleChildNodeExpand(nodeData, node, instance) {
        this.broadcast('sTreeNode', 'tree-node-expand', node);
        this.tree.$emit('node-expand', nodeData, node, instance);
      }
    },

    created() {
      const parent = this.$parent;

      if (parent.isTree) {
        this.tree = parent;
      } else {
        this.tree = parent.tree;
      }

      const tree = this.tree;
      if (!tree) {
        console.warn('Can not find node\'s tree.');
      }

      const props = tree.props || {};
      const childrenKey = props['children'] || 'children';

      this.$watch(`node.data.${childrenKey}`, () => {
        this.node.updateChildren();
      });

      this.showCheckbox = tree.showCheckbox;

      if (this.node.expanded) {
        this.expanded = true;
        this.childNodeRendered = true;
      }

      if(this.tree.accordion) {
        this.$on('tree-node-expand', node => {
          if(this.node !== node) {
            this.node.collapse();
          }
        });
      }
    }
  };
</script>
