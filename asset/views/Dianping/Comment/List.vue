<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">点评{{ list.length ? '(' + list.length + ')': '' }}</h1>
    </header>
    <div class="mui-content">
      <RefreshList
        v-if="id"
        ref="RefreshList"
        :api="'tags/productReviewList'"
        :prevOtherData="prevOtherData"
        :nextOtherData="nextOtherData"
        :pageMode = "true"
        :isShowUpToRefreshDescription="false"
        v-model="list"
        :autoShowEmpty="true"
        class="listWrapper"
      >
        <template v-for="(comment, index) in list">
          <feedDianping :item="comment"></feedDianping>
        </template>
      </RefreshList>
    </div>
  </div>
</template>

<script>
  import feedDianping from '../../../components/Feed.vue'
  import RefreshList from '../../../components/refresh/List.vue'

  export default {
    data () {
      return {
        id: '',
        list: [],
        orderBy: 1
      }
    },
    components: {
      feedDianping,
      RefreshList
    },
    computed: {
      prevOtherData () {
        return {tag_name: this.id, orderBy: this.orderBy}
      },
      nextOtherData () {
        return {tag_name: this.id, orderBy: this.orderBy}
      }
    },
    mounted () {
    },
    updated () {
      this.$nextTick(() => {
      })
    },
    created () {
      this.refreshPageData()
    },
    watch: {
      '$route' (to, from) {
        if (to.name === from.name) {
          this.refreshPageData()
        }
      }
    },
    methods: {
      refreshPageData () {
        let id = this.$route.params.id

        if (!id) {
          window.mui.toast('请求异常')
          window.mui.back()
          return
        }
        this.id = id
      }
    }
  }
</script>

<style scoped lang="less">
  .mui-content {
    background: #ffffff;
  }

  .mui-android .commentList .commentUser .userInfo .userName span:nth-of-type(2) {
    line-height: 18px;
  }
</style>
