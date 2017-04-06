/*
create by YOU
*/

<template>
  <s-table
    class="s-tree-table"
    :data="treeArray"
    highlight-current-row
    @current-change="handleCurrentChange"
    :row-style="rowStyle">
    <s-table-column
      v-for="(value, index) in config"
      :key="value"
      :class-name="(index + 1) === treeIndex ? 's-tree-index-col' : 's-tree-noindex-col' "
      :label="value.title"
      :width="value.width">
      <template scope="scope">
          <span @click="toggleChildren(scope.row)"
                :class="'s-tree-col-icon icon' + (!!scope.row.children ? (scope.row.__open ? '__open' : '__close') : '')"
                :style="'margin-left:' + (scope.row.__level * 24) + 'px'"></span>
        <div class="data-wrapper">{{ scope.row[value.property] }}</div>
      </template>
    </s-table-column>
    <slot></slot>
  </s-table>
</template>

<script type="text/babel">
  import Vue from 'vue'
  export default {
    name: 'sTableTree',
    data() {
      return {
        currentRow: null,
        treeArray: []
      }
    },
    mounted () {
      function parseTreeToArray(parent, level) {
        let tree = parent.children === undefined ? parent : parent.children
        let array = []
        if (!level) {
          level = 0
        }
        for (let i = 0; i < tree.length; i++) {
          Vue.set(tree[i], '__level', level)
          Vue.set(tree[i], '__show', true)
          if (parent !== tree) {
            Vue.set(tree[i], '__parent', parent)
          }
          array.push(tree[i])
          if (tree[i].children) {
            Vue.set(tree[i], '__open', true)
            parseTreeToArray(tree[i], level + 1).map(function (value) {
              array.push(value)
            })
          }
        }
        return array
      }

      this.treeArray = parseTreeToArray(this.data)
    },
    methods: {
      handleCurrentChange (val) {
        this.currentRow = val;
      },
      toggleChildren (val) {
        val.__open = !val.__open
      },
      rowStyle (row, index) {
        row.__show = row.__parent ? (row.__parent.__show && row.__parent.__open) : true
        return row.__show ? '' : 'display: none'
      }
    },
    props: {
      data: {
        type: Array,
        default: () => {
          return []
        }
      }
      ,
      config: {
        type: Array,
        default: () => {
          return []
        }
      }
      ,
      treeIndex: {
        type: Number,
        default: 1
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .s-tree-table
    .s-tree-noindex-col
      .s-tree-col-icon
        display: none
    .s-tree-index-col
      .cell
        position: relative
        .s-tree-col-icon
          float: left
          &:before
            box-sizing: border-box
            display: block
            width: 24px
            height: 24px
            text-align: center
            font-size: 20px
          &.icon:before
            content: ''
          &.icon__open:before
            content: '-'
          &.icon__close:before
            content: '+'
        .data-wrapper
          float: left
          box-sizing: border-box
          height: 100%
          text-align: left
          margin-left: 10px
</style>
