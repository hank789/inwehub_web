<template>
  <div>
    <div class="groups-title" >
      <div class="groups-left">
        <img :src="detail.owner.avatar"/>
        <p>{{detail.owner.name}}</p>
        <p><i></i>圈主</p>
      </div>
      <div class="tag" @tap.stop.prevent="allOptions">
        <svg class="icon" aria-hidden="true"  v-if="this.detail.is_joined === 1 || this.detail.is_joined === 3">
          <use xlink:href="#icon-gengduo"></use>
        </svg>
      </div>
      <i class="bot"></i>
    </div>
    <div class="tag-title">
      <div class="tag-l" >
        <img :src="detail.logo">
      </div>
      <!--<div class="tag-l bg-grey">-->
      <!--<svg class="icon" aria-hidden="true">-->
      <!--<use xlink:href="#icon-biaozhunlogoshangxiayise"></use>-->
      <!--</svg>-->
      <!--</div>-->
      <div class="tag-r">
        <p class="text-line-1">{{detail.name}}</p>
        <p class="tag-info">
            <span v-if="!detail.public">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-simi"></use>
             </svg>
              私密
            </span>
          <span><i>{{detail.subscribers}}</i>/人气</span>
          <span><i>{{detail.articles}}</i>/分享</span>
        </p>
        <div class="tag-avatar" @tap.stop.prevent="$router.push('/tag/FocusMembers?id=' + detail.id)" v-if="detail.members.length">
          <div class="avatar">
            <template v-for="(item, index) in detail.members">
              <img :src="item.avatar"/>
            </template>
          </div>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    components: {
    },
    props: {
      detail: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    watch: {},
    methods: {
      allOptions () {
        this.$emit('allOptions')
      }
    },
    mounted () {
    },
    updated () {}
  }
</script>

<style scoped="scoped">
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
  .mui-content{
    background: #ffffff;
  }
  .bot {
    position: absolute;
    right:0;
    bottom: 0;
    left:0;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .groups-title{
    width:100%;
    height:1.2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }
  .groups-title .tag{
    padding: 5px 4% 5px 5px;
  }
  .groups-title svg{
    font-size: 0.453rem;
    color:rgba(128,128,128,1);


  }
  .groups-left{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 4%;
  }
  .groups-left img{
    width:0.533rem;
    height:0.533rem;
    border-radius: 50%;
    margin-right: 0.133rem;
  }
  .groups-left p:nth-of-type(1){
    font-size:0.373rem;
    color:rgba(86,86,86,1);
    margin-right: 0.186rem;
  }
  .groups-left p:nth-of-type(2) {
    width: 1.013rem;
    height: 0.48rem;
    background: rgba(168, 223, 247, 1);
    border-radius: 0.16rem;
    font-size: 0.32rem;
    color: rgba(35,82,128,1);
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .groups-left p:nth-of-type(2) i{
    display: inline-block;
    width:0.08rem;
    height:0.08rem;
    border-radius: 50%;
    background: #ffffff;
    margin: 0 0.08rem;
  }
  .tag-title{
    width:100%;
    height:3.28rem;
    background: #ffffff;
    padding: 1.5rem 4% 1.4rem 4%;
    /*padding: 0 4%;*/
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .tag-l{
    width:2.453rem;
    height:2.453rem;
  }
  .tag-l img{
    width: 100%;
    height:100%;
    border-radius: 0.106rem;
  }
  .tag-l.bg-grey{
    background: #ececee;
    border-radius: 0.106rem;
    position: relative;
  }
  .tag-l.bg-grey svg{
    color: #c8c8c8;
    font-size: 1.333rem;
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom: 0;
    margin:auto;
  }

  .tag-r{
    height:2.453rem;
    margin-left: 0.266rem;
  }
  .tag-r p:nth-of-type(1){
    font-size:0.48rem;
    color: rgba(68,68,68,1);
    font-weight:500;
    margin-bottom: 0.213rem;
  }
  .tag-info{
    width:100%;
    font-size: 0.32rem;
    color:rgba(180,180,182,1);
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .tag-info span{
    margin-right: 0.346rem;
  }
  .tag-info span svg{
    font-size: 0.346rem;
    color:rgba(180,180,182,1);
  }
  .tag-info span i{
    font-size: 0.373rem;
    font-weight: 500;
    color: rgba(3,174,249,1);
  }
  .tag-avatar{
    width:100%;
    height:0.986rem;
    border:0.026rem solid rgba(220, 220, 220, 1);
    border-radius: 1.333rem;
    padding: 0 4%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    margin-top: 0.213rem;
  }
  .tag-avatar .avatar{
    width: 85%;
    height:100%;
    overflow: hidden;
    margin-top: 0.2rem;
  }
  .tag-avatar .avatar img{
    width:0.533rem;
    height:0.533rem;
    border-radius: 50%;
    margin-right: 2%;
    margin-bottom: -0.213rem;
  }
  .tag-avatar svg{
    margin-right:0.346rem;
    color: #808080;
  }
  /***媒体查询*****/

  @media screen and (min-width: 320px) {
    .tag-r {
      width: 70%;
    }
  }

  @media screen and (min-width: 375px) {
    .tag-r {
      width: 70%;
    }
  }

  @media screen and (min-width: 414px) {
    .tag-r {
      width: 73%;
    }
  }
</style>
