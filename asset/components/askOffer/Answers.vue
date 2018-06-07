<template>

  <div class="mui-table-view answersWrapper beforeHidden afterHidden">
    <div class="component-title-home"><div class="left">问答{{list.length ? '(' + list.length + ')' : ''}}</div></div>
    <div class="line-river line-river-full"></div>

    <Empty :description="isAsker?'正在等待回答者':'快来参与回答'" v-if="list.length === 0"></Empty>


    <div class="item listBottomBorder" v-else v-for="(item, index) in list" @tap.stop.prevent="toDetail(item.id)">
      <UserInfo
        :uuid="item.uuid"
        :avatar="item.user_avatar_url"
        :realname="item.user_name"
        :position="''"
        :company="''"
        :isFollow="false"
        :isFollowed="false"
        :isExpert="item.is_expert"
        :isShowPositionAndCompany="false"
        :time="item.created_at"
        @setFollowStatus="setFollowStatus"
      ></UserInfo>

      <div class="content mui-ellipsis-3 textToLink" v-html="item.content ? textToLink(item.content) : '[图片]'"></div>

      <div class="itemFooter">
        <div class="iconWrapper">
          {{item.comment_number}}评论
        </div>
        <span class="line-wall"></span>
        <div class="iconWrapper">
          {{item.support_number}}点赞
        </div>
      </div>

      <div class="component-bestAnswerLabel" v-if="item.is_collected">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-nianfendise1"></use>
        </svg>
        <span>最佳回答</span>
      </div>
    </div>

  </div>
</template>

<script type="text/javascript">
  import UserInfo from '../question-detail/UserInfo.vue'
  import Empty from './../Empty.vue'
  import { textToLinkHtml, secureHtml } from '../../utils/dom'

  export default {
    data () {
      return {}
    },
    components: {
      UserInfo,
      Empty
    },
    props: {
      list: {
        type: Array,
        default: []
      },
      questionId: '',
      isAsker: false
    },
    created () {

    },

    mounted () {
    },
    methods: {
      textToLink (text) {
        return secureHtml(textToLinkHtml(text))
      },
      setFollowStatus () {

      },
      toDetail (id) {
        this.$router.pushPlus('/ask/offer/' + id, 'list-detail-page-two', true, 'pop-in', 'hide', true)
      }
    }
  }
</script>

<style lang="less" scoped>
  .answersWrapper {
    .content {
      padding: 0 0.4rem;
    }

    .item {
      position: relative;
    }

    .itemFooter {
      padding: 0.24rem 0.4rem 0.346rem;

      .iconWrapper {
        display: inline-block;
        color: #808080;
        font-size: 0.346rem;
      }

      .time {
        float: right;
        font-size: 0.346rem;
        color: #c8c8c8;
        text-align: right;
      }
    }
  }

  .component-bestAnswerLabel{
    top:-7px;
  }
</style>
