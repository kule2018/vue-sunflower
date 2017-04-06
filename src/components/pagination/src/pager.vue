<template>
  <ul @click="onPagerClick" class="s-pager" v-if="!infinite">
    <li
      :class="{ active: currentPage === 1 }"
      v-if="pageCount > 0"
      class="number">1</li>
    <li
      class="s-icon more btn-quickprev"
      :class="[quickprevIconClass]"
      v-if="showPrevMore"
      @mouseenter="quickprevIconClass = 's-icon-d-arrow-left'"
      @mouseleave="quickprevIconClass = 's-icon-more'">
    </li>
    <li
      v-for="pager in pagers"
      :class="{ active: currentPage === pager }"
      class="number">{{ pager }}</li>
    <li
      class="s-icon more btn-quicknext"
      :class="[quicknextIconClass]"
      v-if="showNextMore"
      @mouseenter="quicknextIconClass = 's-icon-d-arrow-right'"
      @mouseleave="quicknextIconClass = 's-icon-more'">
    </li>
    <li
      :class="{ active: currentPage === pageCount }"
      class="number"
      v-if="pageCount > 1">{{ pageCount }}</li>
  </ul>

  <ul @click="onPagerClick" class="s-pager" v-else>
    <li
      v-for="pager in infinitePagers"
      :class="{ active: currentPage === pager }"
      class="number">{{ pager }}</li>
    <li
      class="s-icon more btn-quicknext"
      :class="[quicknextIconClass]"
      v-if="!(!hasNext && pageCount==currentPage)">
    </li>
  </ul>
</template>

<script type="text/babel">

  export default {
    name: 'sPager',

    props: {
      currentPage: Number,

      pageCount: Number,

      infinite: Boolean,

      hasNext: Boolean,

    },

    watch: {
      showPrevMore(val) {
        if (!val) this.quickprevIconClass = 's-icon-more';
      },
      showNextMore(val) {
        if (!val) this.quicknextIconClass = 's-icon-more';
      }
    },

    methods: {
      onPagerClick(event) {
        const target = event.target;
        if (target.tagName === 'UL') {
          return;
        }

        let newPage = Number(event.target.textContent);
        const pageCount = this.pageCount;
        const currentPage = this.currentPage;

        if (target.className.indexOf('more') !== -1) {
          if(!this.infinite){
            if (target.className.indexOf('quickprev') !== -1) {
              newPage = currentPage - 5;
            } else if (target.className.indexOf('quicknext') !== -1) {
              newPage = currentPage + 5;
            }
          }else {
            newPage = currentPage;
          }
        }
        /* istanbul ignore if */
        if (!isNaN(newPage)) {
          if (newPage < 1) {
            newPage = 1;
          }

          if (newPage > pageCount && !this.infinite) {
            newPage = pageCount;
          }
        }

        if (newPage !== currentPage) {
          this.$emit('change', newPage);
        }
      }
    },

    computed: {
      pagers() {
        const pagerCount = 7;

        const currentPage = Number(this.currentPage);
        const pageCount = Number(this.pageCount);

        let showPrevMore = false;
        let showNextMore = false;

        if (pageCount > pagerCount) {
          if (currentPage > pagerCount - 2) {
            showPrevMore = true;
          }

          if (currentPage < pageCount - 2) {
            showNextMore = true;
          }
        }

        const array = [];

        if (showPrevMore && !showNextMore) {
          const startPage = pageCount - (pagerCount - 2);
          for (let i = startPage; i < pageCount; i++) {
            array.push(i);
          }
        } else if (!showPrevMore && showNextMore) {
          for (let i = 2; i < pagerCount; i++) {
            array.push(i);
          }
        } else if (showPrevMore && showNextMore) {
          const offset = Math.floor(pagerCount / 2) - 1;
          for (let i = currentPage - offset ; i <= currentPage + offset; i++) {
            array.push(i);
          }
        } else {
          for (let i = 2; i < pageCount; i++) {
            array.push(i);
          }
        }

        this.showPrevMore = showPrevMore;
        this.showNextMore = showNextMore;

        return array;
      },
      infinitePagers(){
        let pageMax = this.hasNext ? (this.pageCount+1) :this.pageCount;
        let pageLength = (this.pageCount+1)>6? 6: pageMax;//最多显示6个页码
        let arr = [];
        for (let i=this.currentPage,j=this.currentPage+1; ; i--,j++){
          if(j<=pageMax) arr.push(j);
          if(arr.length>=pageLength) break;
          if(i>0) arr.push(i);
          if(arr.length>=pageLength) break;
        }
        return arr.sort((a,b) => a-b);
      }
    },

    data() {
      return {
        current: null,
        showPrevMore: false,
        showNextMore: false,
        quicknextIconClass: 's-icon-more',
        quickprevIconClass: 's-icon-more'
      };
    }
  };
</script>
