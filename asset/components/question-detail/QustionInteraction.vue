<template>
  <div class="mui-table-view questionInteractionWrapper">
    <UserInfo
      :uuid="ask.uuid"
      :avatar="ask.user_avatar_url"
      :realname="ask.user_name"
      :position="ask.title"
      :company="ask.company"
      :isFollow="isFollow"
      :isFollowed="ask.is_followed?true:false"
      :isExpert="ask.is_expert?1:0"
      @setFollowStatus="setFollowStatus"
    ></UserInfo>

    <div class="content">
      {{ ask.description }}
    </div>

    <div class="answerCount">
      2人回答
      <span>关注问题</span>
    </div>

    <div class="mui-row">
      <div class="mui-col-sm-6 mui-col-xs-6 buttonWrapper buttonWrapper-1">
        <button type="button" class="mui-btn mui-btn-block mui-btn-warning"
                @tap.stop.prevent="$router.push('/answerrefuse/' + answer.question.id)">
          邀请回答
        </button>
      </div>
      <div class="mui-col-sm-6 mui-col-xs-6 buttonWrapper buttonWrapper-2">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary"
                @tap.stop.prevent="">
          参与回答（草稿）
       </button>
      </div>
    </div>

  </div>
</template>
<script type="text/javascript">

  import UserInfo from './UserInfo.vue';

  export default {
    data () {
      return {
      }
    },
    components: {
      UserInfo
    },
    props: {
      ask: {
        type: Object,
        default: {}
      },
      isFollow: {
        type: Boolean,
        default: false
      }
    },
    created(){

    },
    methods: {
      setFollowStatus(status){
        this.ask.is_followed=status;
      },
      getHtml(id, options, callback) {
      }
    }
  };
</script>

<style lang="less" scoped>
  .questionInteractionWrapper{
    margin-top:0 !important;

    .content{
      padding:0 15px;
    }

    .answerCount{
      color:#b4b4b6;
      font-size:12px;
      padding:5px 15px 15px;

      span{
        color:#03aef9;
        margin-left:5px;
      }
    }

    .buttonWrapper{

      &.buttonWrapper-1{
        padding:0 7px 0 15px;
      }

      &.buttonWrapper-2{
        padding:0 15px 0 7px;
      }

      .mui-btn-warning{
        background-color: #fcc816;
        border:1px solid #fcc816;
      }
    }
  }

  .afterHidden:after{
    display: none;
  }
</style>
