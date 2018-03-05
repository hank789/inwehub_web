<template>
  <div class="mui-table-view answersWrapper beforeHidden afterHidden">

    <Empty :description="'快来参与回答'" v-if="list.length === 0"></Empty>


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
        @setFollowStatus="setFollowStatus"
      ></UserInfo>

      <div class="content mui-ellipsis-3 textToLink" v-html="item.content ? textToLink(item.content) : '[图片]'">
        <!--{{item.content ? item.content : '[图片]'}}-->
      </div>

      <div class="itemFooter">
        <div class="iconWrapper">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-pinglun1"></use>
          </svg>
          {{item.comment_number}}






        </div>
        <div class="iconWrapper">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-dianzan1"></use>
          </svg>
          {{item.support_number}}






        </div>

        <div class="time">{{ item.created_at}}</div>
      </div>
    </div>

  </div>
</template>

<script type="text/javascript">
  import UserInfo from './UserInfo.vue'
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
      questionId: ''
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
        this.$router.pushPlus('/askCommunity/interaction/' + id, 'list-detail-page-two', true, 'pop-in', 'hide', true)
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
        margin-right: 0.133rem;
      }

      .time {
        float: right;
        font-size: 0.346rem;
        color: #c8c8c8;
        text-align: right;
      }
    }

  }
</style>
