<template>
  <div>
    <div class="avatar">
      <p>
        <img :src="data.owner.avatar"/>
        <svg class="icon" aria-hidden="true" v-if="data.owner.is_expert == '1'">
          <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
        </svg>
      </p>
      <p>{{data.owner.username}}发布了分享</p>
    </div>
    <div class="textContainer mui-ellipsis-2">
      {{data.title}}
    </div>

    <div class="PublishContainer" v-if="data.data.img">
      <Images :images="data.data.img" class="newestList"></Images>
    </div>

    <div class="timeContainer">
      <span>
        <timeago :since="timeago(data.created_at)" :auto-update="60">
        </timeago>
      </span>
      <svg class="icon" aria-hidden="true" v-if="data.data.current_address_name">
        <use xlink:href="#icon-dingwei1"></use>
      </svg>
      <span>{{data.data.current_address_name}}</span>
    </div>
    <div class="information">
      <p>
         <svg class="icon" aria-hidden="true" @tap.stop.prevent="toggleOptions">
          <use xlink:href="#icon-gengduo"></use>
         </svg>
        <span class="carte" style="display: none;">
          <a @tap.stop.prevent="report(data.user_id)" v-if="userId != data.owner.id">举报</a>
          <a @tap.stop.prevent="deleterow(data.id,index)" v-else>删除</a>
        </span>
      </p>
      <p @tap.stop.prevent="bookmarkuBmission(data)" :class="data.is_bookmark ? 'blue':''">
         <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shoucangxingxing"></use>
         </svg>
      </p>
      <p>
         <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-pinglun1"></use>
         </svg>
        {{data.comments_number}}
      </p>
      <p @tap.stop.prevent="downvoteComment(data)" :class="data.is_upvoted ? 'blue':''">
         <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-dianzan1"></use>
      </svg>
        {{data.upvotes}}
      </p>
    </div>
  </div>
</template>
<script type="text/javascript">

  import Images from '../../components/image/Images.vue'
  import localEvent from '../../stores/localStorage'
  const currentUser = localEvent.getLocalItem('UserInfo')

  export default {
    data () {
      return {
        userId: currentUser.user_id
      }
    },
    components: {
      Images
    },
    props: {
      data: {
        type: Object,
        default: {}
      }
    },
    created () {

    },
    methods: {
      report (id) {
        this.$emit('report', id)
      },
      deleterow (id, index) {
        this.$emit('deleterow', id, index)
      },
      toggleOptions (event) {
        if (event.target.nodeName !== 'svg') return
        var target = event.target.nextElementSibling
        target.style.display = target.style.display === 'none' ? 'block' : 'none'
      },
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      bookmarkuBmission (hot) {
        this.$emit('bookmarkuBmission', hot)
      },
      downvoteComment (hot) {
        this.$emit('downvoteComment', hot)
      }
    }
  }
</script>

<style scoped>
  .mui-wechat .menu {
    width: 100%;
    height: 45px;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
    top: 0;
  }

  .mui-content {
    background: #F3F4F5;
  }

  /*导航栏的样式*/

  .menu {
    width: 100%;
    height: 45px;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
    padding: 0 17px;
    border-bottom: 1px solid #dcdcdc;
  }

  .menu span {
    display: block;
    height: 100%;
    float: left;
    font-size: 14px;
    color: #444444;
    text-align: center;
    line-height: 45px;
    font-weight: 600;
  }

  .menu span:nth-of-type(2) {
    position: relative;
  }

  .menu span:nth-of-type(2) {
    margin-left: 34px;
  }

  .menu svg {
    float: right;
    ont-size: 18px;
    color: #03aef9;
    margin-top: 13px;
  }

  .menu i {
    display: block;
    position: absolute;
    width: 27px;
    height: 1.5px;
    left: 0%;
    bottom: 0.5px;
    background: #03aef9;
  }

  .bot {
    position: absolute;
    right: 0px;
    bottom: 0;
    left: 0px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

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

  /*滚动区域*/
  ul {
    width: 100%;
    overflow: hidden;
    background: #F3F4F5;
    margin-top: 45px;
  }

  ul .Container {
    width: 100%;
    /*overflow: hidden;*/
    background: #FFFFFF;
    padding: 12px 16px 0 16px;
    margin-bottom: 10px;

  }

  ul .Container p:nth-of-type(1) {
    font-size: 15px;
    color: #444444;
    line-height: 20px;
  }

  ul .Container p:nth-of-type(1) i {
    font-size: 12px;
    color: rgb(180, 180, 182);
  }

  ul .Container .container-image {
    height: 124px;
    margin-top: 13px;
  }

  ul .Container p.timer {
    width: 100%;
    height: 44px;
    font-size: 12px;
    color: #b4b4b6;
    line-height: 44px;
    position: relative;
  }

  ul .Container p.timer a {
    font-size: 12px;
    color: rgb(128, 128, 128);
  }

  .information {
    width: 100%;
    height: 40px;
    padding: 0 17px;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

  }

  ul .imgContainer .information p {
    color: #808080;
    position: relative;

  }

  /*举报和删除*/
  .information p:nth-of-type(1) span {
    display: block;
    width: 50px;
    background: #575857;
    position: absolute;
    top: 20px;
    left: -15px;
    border-radius: 4px;
    z-index: 99;
  }

  .information p:nth-of-type(1) span:after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-top: 5px solid #575857;
    border-left: 5px solid #575857;
    transform: rotate(45deg);
    position: absolute;
    top: -2px;
    left: 0;
    right: 0;
    margin: auto;

  }

  .information p:nth-of-type(1) span a {
    display: block;
    text-align: center;
    font-size: 13px;
    color: #FFFFFF;
    padding: 3px 0;
  }

  .information p svg {
    font-size: 17px;
  }

  .information p:nth-of-type(2) svg {
    font-size: 18px;
  }

  .information p:nth-of-type(3) svg {
    font-size: 17px;
    margin-right: 3px;

  }

  .information p:nth-of-type(4) svg {
    font-size: 17px;
    margin-right: 3px;
  }


  /*带定位和图片的样式*/
  .imgContainer {
    width: 100%;
    /*overflow: hidden;*/
    background: #FFFFFF;
    padding: 12px 16px 0 16px;
    margin-bottom: 10px;
  }

  .imgContainer:after {
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    height: 10px;
    background-color: #f3f4f6;
    width: 100%;
  }

  .imgContainer .avatar {
    width: 100%;
    height: 34px;
  }

  .avatar p:nth-of-type(1) {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    float: left;
    position: relative;
  }

  .avatar p:nth-of-type(1) svg {
    position: absolute;
    font-size: 17px;
    bottom: 0;
    right: -6px;
  }

  .avatar p:nth-of-type(1) img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .avatar p:nth-of-type(2) {
    font-size: 13px;
    color: #808080;
    line-height: 34px;
    margin-left: 8px;
    float: left;
  }

  .textContainer {
    width: 100%;
    font-size: 15px;
    color: #444444;
    line-height: 20px;
    margin-top: 6px;
  }

  .timeContainer {
    width: 100%;
    height: 42px;
    font-size: 12px;
    line-height: 42px;

  }

  .timeContainer svg {
    font-size: 14px;
    color: #b4b4b6;
  }

  .timeContainer span:nth-of-type(1) {
    color: #b4b4b6;
  }

  .timeContainer span:nth-of-type(2) {
    color: #808080;
  }

  /*图片*/
  .PublishContainer {
    width: 100%;
    /*overflow: hidden;*/
    margin-top: 13px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    /*border:1px solid #000000;*/
  }

  .PublishContainer .container-image {
    width: 108px;
    /*border:1px solid #000000;*/

  }

  .PublishContainer .container-image img {
    width: 100%;
    height: 100%;
  }

  .PublishContainer p:nth-of-type(2), .PublishContainer p:nth-of-type(3) {
    margin-left: 2%;
  }

  #container-image {
    width: 150px;
    height: 226px;
  }

  /*适配*/
  @media (min-width: 320px) {
    .PublishContainer .container-image {
      height: 92px;
    }

  }

  @media (min-width: 375px) {
    .PublishContainer .container-image {
      height: 108px;
    }

  }

  @media (min-width: 414px) {
    .PublishContainer .container-image {
      height: 108px;
    }

  }

  .information .blue {
    color: #03aef9;
  }




</style>
