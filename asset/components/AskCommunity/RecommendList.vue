<template>
  <div class="recommentListWrapper" v-if="list.length">
    <div class="component-title-home"><div class="left">相关问答</div></div>
    <div class="line-river line-river-full"></div>

    <template v-for="(item, index) in list">
      <div class="container-list-question" @tap.stop.prevent="toDetail(item.id,item.question_type)">
        <div class="container-label" v-if="item.tags.length"><span class="border-football" v-for="(item, index) in item.tags" @tap.stop.prevent="toTagDetail(item.name)">{{item.name}}</span></div>
        <div class="question text-line-3">
          <label v-if="item.price > 0" class="component-label" :class="getStateClass(item.status)">{{item.status_description}}</label><span v-html="textToLink(item.description)"></span>
        </div>
        <div v-if="item.question_type == 2" class="statistics"><div class="container-remarks">{{item.answer_number}}回答<span class="line-wall"></span>{{item.follow_number}}关注</div></div>
        <div v-else class="statistics"><div class="container-remarks">{{item.comment_number}}评论<span class="line-wall"></span>{{item.support_number}}点赞</div></div>
      </div>
      <div class="line-river" v-if="list.length-1 !== index"></div>
    </template>
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import AskCommunityListItem from './AskCommunityListItem.vue'
  import { textToLinkHtml } from '../../utils/dom'
  import { getQuestionStateClass } from '../../utils/ask'

  const RecommentsList = {
    name: 'RecommentsList',
    data: () => ({
      list: []
    }),
    computed: {
    },
    components: {
      AskCommunityListItem
    },
    props: {
      did: {
        type: Number
      }
    },
    methods: {
      toDetail (id, type) {
        this.$router.pushPlus('/ask/offer/answers/' + id, 'list-detail-page', true, 'pop-in', 'hide', true)
      },
      getStateClass (state) {
        return getQuestionStateClass(state)
      },
      getDetail () {
        postRequest(`question/relatedQuestion`, {id: this.did, limit: 2}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          this.list = response.data.data
        })
      },
      textToLink (text) {
        return textToLinkHtml(' ' + text)
      }
    },
    mounted () {
      this.getDetail()
    },
    watch: {
      did: function (newId) {
        this.getDetail()
      }
    }
  }
  export default RecommentsList
</script>
<style scoped="scoped">
.recommentListWrapper{
  background:#fff;
}
  .container-label .border-football:after {
    border-color: #DCDCDC;
  }
  .mui-android .container-label .border-football {
    padding-top: 0.08rem;
  }
</style>
