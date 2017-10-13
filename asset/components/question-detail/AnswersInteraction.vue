<template>
  <div class="mui-table-view answersWrapper beforeHidden afterHidden">

    <Empty :description="'正在等待抢答'" v-if="list.length === 0"></Empty>


    <div class="item listBottomBorder" v-else  v-for="(item, index) in list" @tap.stop.prevent="toDetail(item.id)">
      <UserInfo
        :uuid="11111"
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

      <div class="content mui-ellipsis-3">
        {{item.content?item.content:'[图片]'}}
      </div>

      <div class="time">
        {{ item.created_at}}
      </div>
    </div>

  </div>
</template>

<script type="text/javascript">
  import UserInfo from './UserInfo.vue';
  import Empty from './../Empty.vue'

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
      questionId:''
    },
    created(){

    },

    mounted(){
    },
    methods: {
      setFollowStatus(){

      },
      toDetail(id){
          this.$router.push('/askCommunity/interaction/' + id);
      }
    }
  };
</script>

<style lang="less" scoped>
  .answersWrapper {
    .content {
      padding: 0 15px;
    }

    .item {
      position: relative;
    }

    .time {
      padding: 0 15px 10px;
      font-size: 13px;
      color: #c8c8c8;
      text-align: right;
    }
  }
</style>
