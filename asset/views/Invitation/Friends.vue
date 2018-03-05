<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我邀请的好友</h1>
    </header>
    <div class="mui-content">
      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'activity/inviteRegister/myList'"
        :prevOtherData="{}"
        :nextOtherData="{}"
        class="listWrapper">
        <ul>
          <li v-for="(item, index) in list">
            <p class="avatar">
              <img :src="item.user_avatar_url" @tap.stop.prevent="toAvatar(item.uuid)">
              <svg class="icon" aria-hidden="true" v-if="item.is_expert =='1'">
                <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
              </svg>
            </p>
            <div class="information">
              <p>{{item.user_name}}</p>
              <p>{{item.register_at}}注册</p>
            </div>
            <div class="profit">
              <p>收益：￥{{item.reward_money}}</p>
              <p>支付：￥{{item.paid_money}}</p>
            </div>

            <i class="bot"></i>
          </li>

        </ul>
      </RefreshList>

    </div>
  </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'

  const InvitationFriends = {
    data: () => ({
      list: []
    }),
    created () {

    },
    computed: {},
    components: {
      RefreshList
    },
    methods: {
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      }
    },
    mounted () {

    },
    updated () {

    }
  }
  export default InvitationFriends
</script>

<style scoped>
  /*清掉自带样式*/

  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }

  .mui-content {
    background: #FFFFFF;
  }

  .bot {
    position: absolute;
    right: 0rem;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  ul {
    width: 100%;
    overflow: hidden;
    padding: 0rem 0.426rem;
  }

  ul li {
    width: 100%;
    height: 1.706rem;
    position: relative;
  }

  .avatar {
    width: 1.173rem;
    height: 1.173rem;
    margin-top: 0.266rem;
    border-radius: 50%;
    float: left;
    position: relative;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .avatar svg {
    position: absolute;
    font-size: 0.533rem;
    right: -0.133rem;
    bottom: 0rem;
  }

  .information {
    float: left;
    margin-top: 0.293rem;
    margin-left: 0.213rem;
  }

  .information p:nth-of-type(1) {
    font-size: 0.373rem;
    color: #565656;
  }

  .information p:nth-of-type(2) {
    font-size: 0.32rem;
    color: #b4b4b6;
  }

  .profit {
    float: right;
    margin-top: 0.293rem;
    margin-right: 0.266rem;
  }

  .profit p {
    font-size: 0.346rem;
    color: #808080;
  }


</style>
