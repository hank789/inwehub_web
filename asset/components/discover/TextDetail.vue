<template>
  <div>
    <div>
        <div class="avatar" @tap.stop.prevent="goDetial(data)">
          <p>
            <img :src="data.owner.avatar" @tap.stop.prevent="toAvatar(data.owner.uuid)"/>
            <svg class="icon" aria-hidden="true" v-if="data.owner.is_expert == '1'">
              <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
            </svg>
          </p>
          <p>{{data.owner.username}}发布了分享</p>
        </div>
        <div class="textContainer mui-ellipsis-2" id="Outermost" @tap.stop.prevent="goDetial(data)" v-html="textToLink(data.title)">
          <!--{{data.title}}-->
        </div>

        <div class="PublishContainer" v-if="data.data.img">
          <Images :class="'container-images-discover'" :images="data.data.img" class="newestList" :group="data.slug"></Images>
        </div>

        <div class="timeContainer" @tap.stop.prevent="goDetial(data)">
          <span>
            <timeago :since="timeago(data.created_at)" :auto-update="60">
            </timeago>
          </span>
          <svg class="icon" aria-hidden="true" v-if="data.data.current_address_name">
            <use xlink:href="#icon-dingwei1"></use>
          </svg>
          <span>{{data.data.current_address_name}}</span>
          <i class="bot"></i>
        </div>

    </div>
    <div class="information">
      <p>
         <svg class="icon" aria-hidden="true" @tap.stop.prevent="toggleOptions">
          <use xlink:href="#icon-gengduo"></use>
         </svg>
        <span class="carte" style="display: none;">
          <a @tap.stop.prevent="report(data.user_id)" v-if="userId != data.owner.id">举报</a>
          <a @tap.stop.prevent="deleterow" v-else>删除</a>
        </span>
      </p>
      <p @tap.stop.prevent="bookmarkuBmission(data)" :class="data.is_bookmark ? 'blue':''">
         <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shoucangxingxing"></use>
         </svg>
      </p>
      <p @tap.stop.prevent="goDetial(data)">
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
  import { textToLinkHtml, secureHtml, transferTagToLink } from '../../utils/dom'
  import { goThirdPartyArticle } from '../../utils/webview'

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
      textToLink (text) {
        return transferTagToLink(secureHtml(textToLinkHtml(text)))
      },
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      goDetial (hot) {
        switch (hot.type) {
          case 'text':
            this.$router.pushPlus('/c/' + hot.category_id + '/' + hot.slug)
            break
          case 'link':
            goThirdPartyArticle(
              hot.data.url,
              hot.id,
              hot.title,
              '/c/' + hot.category_id + '/' + hot.slug,
              hot.data.img
            )
            break
          default:
        }
      },
      report (id) {
        this.$emit('report', id)
      },
      deleterow () {
        this.$emit('deleterow')
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
    height: 4.5rem;
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
    height: 4.5rem;
    position: absolute;
    z-index: 10;
    background: #f3f4f6;
    padding: 0 1.7rem;
    border-bottom: 0.1rem solid #dcdcdc;
  }

  .menu span {
    display: block;
    height: 100%;
    float: left;
    font-size: 1.4rem;
    color: #444444;
    text-align: center;
    line-height: 4.5rem;
    font-weight: 600;
  }

  .menu span:nth-of-type(2) {
    position: relative;
  }

  .menu span:nth-of-type(2) {
    margin-left: 3.4rem;
  }

  .menu svg {
    float: right;
    ont-size: 1.8rem;
    color: #03aef9;
    margin-top: 1.3rem;
  }

  .menu i {
    display: block;
    position: absolute;
    width: 2.7rem;
    height: 1.0.5rem;
    left: 0%;
    bottom: 0.0.5rem;
    background: #03aef9;
  }

  .bot {
    position: absolute;
    right: 0rem;
    bottom: 0;
    left: 0rem;
    height: 0.1rem;
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
    margin-top: 4.5rem;
  }

  ul .Container {
    width: 100%;
    /*overflow: hidden;*/
    background: #FFFFFF;
    padding: 1.2rem 1.6rem 0 1.6rem;
    margin-bottom: 1rem;

  }

  ul .Container p:nth-of-type(1) {
    font-size: 1.5rem;
    color: #444444;
    line-height: 2rem;
  }

  ul .Container p:nth-of-type(1) i {
    font-size: 1.2rem;
    color: rgb(180, 180, 182);
  }

  ul .Container .container-image {
    height: 12.4rem;
    margin-top: 1.3rem;
  }

  ul .Container p.timer {
    width: 100%;
    height: 4.4rem;
    font-size: 1.2rem;
    color: #b4b4b6;
    line-height: 4.4rem;
    position: relative;
  }

  ul .Container p.timer a {
    font-size: 1.2rem;
    color: rgb(128, 128, 128);
  }

  .information {
    width: 100%;
    height: 4rem;
    padding: 0 1.7rem;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

  }

  ul .imgContainer .information p {
    color: #808080;
    position: relative;
    height:4rem;
    display: flex;
    align-items: center;
    padding:0 0.5rem;
  }
  ul .imgContainer .information p.blue {
    color: #03aef9;
  }

  /*举报和删除*/
  .information p:nth-of-type(1) span {
    display: block;
    width: 5rem;
    background: #575857;
    position: absolute;
    top: 2.8rem;
    left: -1.3rem;
    border-radius: 0.4rem;
    z-index: 99;
  }

  .information p:nth-of-type(1) span:after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border: 0.5rem solid transparent;
    border-top: 0.5rem solid #575857;
    border-left: 0.5rem solid #575857;
    transform: rotate(45deg);
    position: absolute;
    top: -0.2rem;
    left: 0;
    right: 0;
    margin: auto;

  }

  .information p:nth-of-type(1) span a {
    display: block;
    text-align: center;
    font-size: 1.3rem;
    color: #FFFFFF;
    padding: 0.3rem 0;
  }

  .information p svg {
    font-size: 1.7rem;
  }

  .information p:nth-of-type(2) svg {
    font-size: 1.8rem;
  }

  .information p:nth-of-type(3) svg {
    font-size: 1.7rem;
    margin-right: 0.3rem;

  }

  .information p:nth-of-type(4) svg {
    font-size: 1.7rem;
    margin-right: 0.3rem;
  }


  /*带定位和图片的样式*/
  .imgContainer {
    width: 100%;
    /*overflow: hidden;*/
    background: #FFFFFF;
    padding: 1.2rem 1.6rem 0 1.6rem;
    margin-bottom: 1rem;
  }

  .imgContainer:after {
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    height: 1rem;
    background-color: #f3f4f6;
    width: 100%;
  }

  .imgContainer .avatar {
    width: 100%;
    height: 3.4rem;
  }

  .avatar p:nth-of-type(1) {
    width: 3.4rem;
    height: 3.4rem;
    border-radius: 50%;
    float: left;
    position: relative;
  }

  .avatar p:nth-of-type(1) svg {
    position: absolute;
    font-size: 1.7rem;
    bottom: 0;
    right: -0.6rem;
  }

  .avatar p:nth-of-type(1) img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .avatar p:nth-of-type(2) {
    font-size: 1.3rem;
    color: #808080;
    line-height: 3.4rem;
    margin-left: 0.8rem;
    float: left;
  }

  .textContainer {
    width: 100%;
    font-size: 1.5rem;
    color: #444444;
    line-height: 2rem;
    margin-top: 0.6rem;
  }

  .timeContainer {
    width: 100%;
    height: 4.2rem;
    font-size: 1.2rem;
    line-height: 4.2rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
  }

  .timeContainer svg {
    font-size: 1.4rem;
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
    margin-top: 1.3rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }

  .PublishContainer .container-image {
    width: 10.8rem;
  }

  .PublishContainer .container-image img {
    width: 100%;
    height: 100%;
  }

  .PublishContainer p:nth-of-type(2), .PublishContainer p:nth-of-type(3) {
    margin-left: 2%;
  }



</style>

