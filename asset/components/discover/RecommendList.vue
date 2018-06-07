<template>
  <div class="recommentListWrapper" v-if="list.length">
    <div class="component-title-home"><div class="left">阅读推荐</div></div>
    <div class="line-river"></div>
    <ul class="recommend">
      <template v-for="(item, index) in list">
        <li  @tap.stop.prevent="goDetial(item.read_type,item)">
          <div class="logo">
            <img class="lazyImg" v-lazy="item.data.img"/>
          </div>

          <div class="text-content">
            <div class="content_t mui-ellipsis-3">
              <span class="label">{{ typeDesc(item.read_type) }}</span>
              <span class="font-family-medium">{{item.data.title}}</span>
            </div>
            <div class="information">
              <span>{{item.data.view_number}}浏览<i></i></span>
              <span v-if="item.read_type === 1 || item.read_type === 2 || item.read_type === 6">{{item.data.support_number
                }}点赞<i></i></span>
              <span v-else-if="item.read_type === 3">{{item.data.answer_number}}回答<i></i></span>

              <span v-if="item.read_type === 1 || item.read_type === 6">{{item.data.comment_number}}评论</span>
              <span v-else-if="item.read_type === 2">好评率{{item.data.average_rate
                }}</span>
              <span v-else-if="item.read_type === 3">{{item.data.follower_number}}关注</span>
            </div>
          </div>
          <i class="bot" v-if="list.length-1 !== index"></i>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import { goThirdPartyArticle } from '../../utils/webview'

  const RecommentsList = {
    name: 'RecommentsList',
    data: () => ({
      list: []
    }),
    computed: {
    },
    components: {},
    props: {
      did: {
        type: Number
      }
    },
    methods: {
      typeDesc (type) {
        switch (type) {
          case 1:
            return '发现分享'
          case 2:
            return '专业问答'
          case 3:
            return '互动问答'
          case 6:
            return '互动回答'
        }
      },
      goDetial (type, recommend) {
        switch (type) {
          case 1:
            if (recommend.data.type === 'link') {
              goThirdPartyArticle(
                recommend.data.url,
                recommend.source_id,
                recommend.data.title,
                '/c/' + recommend.data.category_id + '/' + recommend.data.slug,
                recommend.data.img
              )
            } else {
              this.$router.pushPlus('/c/' + recommend.data.category_id + '/' + recommend.data.slug)
            }
            break
          case 2:
            this.$router.pushPlus('/askCommunity/major/' + recommend.source_id)
            break
          case 3:
            this.$router.pushPlus('/ask/offer/answers/' + recommend.source_id)
            break
          case 4:
            this.$router.pushPlus('/EnrollmentStatus/' + recommend.source_id)
            break
          case 5:
            this.$router.pushPlus('/EnrollmentStatus/' + recommend.source_id)
            break
          case 6:
            this.$router.pushPlus('/ask/offer/' + recommend.source_id)
            break
          default:

        }
      }
    },
    mounted () {
      postRequest(`recommendRead`, {id: this.did, perPage: 2, orderBy: 2}).then(response => {
        var code = response.data.code
        if (code !== 1000) {
          window.mui.toast(response.data.message)
          return
        }

        this.list = response.data.data.data
      })
    }
  }
  export default RecommentsList
</script>
<style scoped="scoped">
  .recommentListWrapper{
    background:#fff;
  }

  /*精选推荐*/
  .recommend{
    margin:0;
    width:100%;
    padding: 0 0.426rem;
    overflow: hidden;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .title{
    width:100%;
    line-height: 0.426rem;
    padding-left: 4%;
    margin-top: 0.293rem;
    text-align: left;
    font-size: 0.426rem;
    color: rgba(68,68,68,1);
  }
  .recommend li{
    width: 100%;
    padding: 0.4rem 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
  }
  .recommend li:nth-of-type(1){
    padding-top: 0.32rem;
  }
  .recommend li .logo{
    width: 3.226rem;
    height:2.16rem;
  }
  .recommend li img{
    width:100%;
    height:100%;
    border-radius:0.106rem;
    object-fit: cover;
  }
  .recommend li .text-content{
    width:5.653rem;
    height:2.16rem;
    margin-left: 0.4rem;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .text-content .content_t{
    font-size: 0.373rem;
    color: RGBA(68, 68, 68, 1);
    line-height: 0.533rem;
    max-height: 1.7rem;
  }
  .recommend li .text-content  .container{
    display: inline;
  }

  .text-content .content_t span.label{
    height:0.4rem;
    line-height: 0.426rem;
    display: inline-block;
    font-size: 0.266rem;
    color: RGBA(128, 128, 128, 1);
    background:rgba(236,236,238,1);
    padding: 0rem 0.133rem;
    border-radius:0.106rem;
    font-weight: normal;
    position: relative;
    top: -0.026rem;
  }
  .information{
    width:100%;
    line-height: 0.32rem;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    font-size: 0.32rem;
    color: RGBA(128, 128, 128, 1);
    position: absolute;
    bottom: 0;
  }
  .information i{
    display: inline-block;
    width:0.026rem;
    height:0.32rem;
    background:RGBA(219, 219, 219, 1);
    margin: 0 0.266rem;
    margin-bottom: -0.05rem;
  }
  .more{
    width:100%;
    text-align: center;
    font-size: 0.373rem;
    margin-top: 0.293rem;
    color:rgba(3,174,249,1);
    line-height:0.533rem;
  }
  .gray{
    width:100%;
    height:0.266rem;
    background: #F3F4F5;
  }
  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  @media (-webkit-device-pixel-ratio:2){
    .bot{
      transform: scaleY(1);
    }
  }
</style>
