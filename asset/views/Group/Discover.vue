<template>
  <div>
    <div class="mui-content">
      <!--search-->
      <div class="search">
        <div class="search-l" @tap.stop.prevent="$router.pushPlus('/chat/' + contact_id)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-kefu"></use>
          </svg>
          <p>客服</p>
          <i v-if="unread_count"></i>
        </div>
        <div class="search-r" @tap.stop.prevent="$router.pushPlus('/searchQuestion','list-detail-page-three')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <p>搜内容、问答、圈子</p>
        </div>
      </div>
      <!--菜单-->
      <div class="menu">
        <span @tap.stop.prevent="$router.replace('/searchFollow')">关注</span>
        <span class="bold">圈子<i></i></span>
        <span @tap.stop.prevent="$router.replace('/searchRecommend')">推荐</span>
        <i class="bot"></i>
      </div>
      <!--列表-->
      <!--滚动区域-->
      <RefreshList
        v-model="list"
        :api="'article/list'"
        :pageMode="true"
        :prevOtherData="{sort:'hot', page: 1}"
        :nextOtherData="{sort:'hot'}"
        class="listWrapper">
        <!--swiper滑动-->
        <groups :isShow = "true"></groups>
        <div class="title">
          大家都在看
          <i class="bot"></i>
        </div>
        <ul>
          <template v-for="(hot, index) in list">
            <!--带图片的样式-->
            <li class="imgContainer group-bot" v-if="hot.type === 'text'">
              <TextDetail :data="hot" @downvoteComment="downvoteComment"
                          @bookmarkuBmission="bookmarkuBmission"
                          @report="report"
                          @deleterow="deleterow(hot.id, index)"
              ></TextDetail>
            </li>
          </template>
        </ul>
      </RefreshList>
      <!---->
    </div>
  </div>
</template>

<script>
  import RefreshList from '../../components/refresh/List.vue'
  import TextDetail from '../../components/discover/TextDetail'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { postRequest } from '../../utils/request'
  import groups from '../../components/groups/RecommendGroups.vue'
  export default {
    data () {
      return {
        list: [],
        swiperOption: {
          pagination: '.swiper-pagination',
          slidesPerView: 'auto',
          spaceBetween: 10,
          onTap: this.swipperClick,
          contact_id: '',
          unread_count: 0
        }
      }
    },
    components: {
      swiper,
      swiperSlide,
      RefreshList,
      TextDetail,
      groups
    },
    props: {},
    watch: {},
    methods: {
      messagecountchange (obj) {
        console.log(obj.contact_id)
        if (obj.contact_id) {
          this.contact_id = obj.contact_id
          this.unread_count = obj.unread_count
        }
      },
      report (id) {
        var that = this
        var btnArray = ['取消', '确定']
        window.mui.confirm('确定举报吗？', ' ', btnArray, function (e) {
          if (e.index === 1) {
            that.hideAllOptions()
            window.mui.toast('举报成功')
          }
        })
      },
      // 赞文章
      downvoteComment (hot) {
        postRequest(`article/upvote-submission`, {
          submission_id: hot.id
        }).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data) {
            if (response.data.data.type === 'upvote') {
              hot.upvotes += 1
              hot.is_upvoted = 1
            } else {
              hot.is_upvoted = 0
              hot.upvotes -= 1
            }
          }
        })
      },
      // 赞文章
      bookmarkuBmission (hot) {
        postRequest(`article/bookmark-submission`, {
          id: hot.id
        }).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data) {
            if (response.data.data.type === 'bookmarked') {
              hot.is_bookmark = 1
            } else {
              hot.is_bookmark = 0
            }
          }
        })
      },
      deleterow (id, index) {
        var btnArray = ['取消', '确定']
        var list = this.list
        window.mui.confirm('确定删除吗？', ' ', btnArray, (e) => {
          if (e.index === 1) {
            // 进行删除
            postRequest(`article/destroy-submission`, {
              id: id
            }).then(response => {
              var code = response.data.code
              // 如果请求不成功提示信息 并且返回上一页；
              if (code !== 1000) {
                window.mui.alert(response.data.message)
                window.mui.back()
                return
              }
              if (response.data.data) {
                list.splice(index, 1)
                this.hideAllOptions()
                window.mui.toast('删除成功')
              }
            })
          }
        })
      }
    },
    mounted () {
    },
    updated () {
    }
  }
</script>

<style scoped="scoped">
  div,
  span,
  p,
  ul,
  li,
  i,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
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
  .mui-content{
    background: #ffffff;
  }
  /*search*/
  .search{
    width:92%;
    height:34px;
    margin-left: 4%;
    margin-top: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .search-l{
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .search-l svg{
    font-size:25px;
    color: rgba(200,200,200,1);
  }
  .search-l p{
    font-size:10px;
    color: rgba(128,128,128,1);
    line-height: 14px;
    margin-bottom: 5px;
  }
  .search-l i{
    width:8px;
    height:8px;
    background: #FA4975;
    border-radius: 50%;
    position: absolute;
    top: 6px;
    right: -10px;
  }
  .search-r{
    width: 77%;
    height:100%;
    background:rgba(243,244,246,1);
    opacity:0.9477;
    border-radius: 50px;
    font-size: 14px;
    color:rgba(128,128,128,1);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .search-r svg{
    font-size: 17px;
    color: rgba(68,68,68,1);
    margin-left: 16px;
    margin-right: 6px;
  }
  /*菜单*/
  /*菜单*/
  .menu{
    width:100%;
    height: 1.173rem;
    background: #FFFFFF;
    font-size:14px;
    color:rgba(68,68,68,1);
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    position: absolute;
  }
  .menu span{
    position:relative;
    margin-bottom: -0.293rem;
  }
  .menu span.bold{
    font-weight: 500;
  }
  .menu span  i{
    position:absolute;
    width: 0.7rem;
    height:0.04rem;
    border-radius: 1.333rem;
    background:#03aef9;
    top: 0.67rem;
    left: 0;
    right: 0;
    margin: auto;
  }
  .title{
    width:92%;
    height:44px;
    margin-left: 4%;
    position: relative;
    font-size: 16px;
    color: #444444;
    font-weight: 500;
    line-height: 44px;
  }
  ul{
    background: #F3F4F5;
  }
  .imgContainer{
    width: 100%;
    background: #FFFFFF;
    padding: 0.32rem 0.4rem 0 0.4rem;
    margin-bottom: 0.266rem;
  }
  .listWrapper{
    top: 90px;
    bottom: 50px;
  }
  .group-bot{
    padding-bottom: 10px;
  }

</style>
