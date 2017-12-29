<template>
  <div>
    <div class="component-dianzanList" v-if="supportNumber"><svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-dianzan1"></use>
    </svg><span v-for="(item, index) in supportList" @tap.stop.prevent="toResume(item.uuid)">{{item.name}}</span><span v-if="supportNumber > supportList.length">等{{supportNumber}}人</span>
    </div>
    <div class="line-horizontal padding-5-0-5-0" v-if="commentNumber && supportNumber"></div>
    <div class="container-comments" :class="{'padding-0': parseInt(supportNumber) === 0}" v-if="commentNumber">
      <template v-for="(comment, index) in commentList">
        <div class="comment text-line-5"  @tap.stop.prevent="commentIt(comment.id, comment.owner.name, commentList)">
          <P>
            <span class="from" @tap.stop.prevent="toResume(comment.owner.uuid)">{{comment.owner.name}}<i>:</i></span>
            <span  class="textToLink dialogue" v-html="textToLink(comment.content)"></span>
          </P>
        </div>

        <DiscussReplySimple
          :children="comment.children"
          :parentOwnerName="comment.owner.name"
          @comment="commentIt"
        ></DiscussReplySimple>

      </template>
      <div class="more" @tap.stop.prevent="toDetail(detailUrl)" v-if="commentNumber > 8">查看全部{{commentNumber}}条评论</div>
    </div>
  </div>
</template>

<script type="text/javascript">

  import DiscussReplySimple from '../../components/discover/DiscussReplySimple.vue'
  import { textToLinkHtml } from '../../utils/dom'

  export default {
    data () {
      return {}
    },
    components: {
      DiscussReplySimple
    },
    props: {
      supportNumber: {  // 点赞数量
        type: Number,
        default: 0
      },
      supportList: {
        type: Array,
        default: () => {
          return []
        }
      },
      commentNumber: {  // 评论数量
        type: Number,
        default: 0
      },
      commentList: {
        type: Array,
        default: () => {
          return []
        }
      },
      detailUrl: {
        type: String,
        default: ''
      }
    },
    created () {
    },
    watch: {},
    mounted () {

    },
    methods: {
      toDetail (url) {
        this.$router.pushPlus(url, 'list-detail-page')
      },
      commentIt (parentId = 0, commentTargetUsername = '', list) {
        this.$emit('commentIt', parentId, commentTargetUsername, list)
      },
      textToLink (text) {
        return textToLinkHtml(text)
      },
      toResume (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      }
    }
  }
</script>

<style scoped>

</style>

