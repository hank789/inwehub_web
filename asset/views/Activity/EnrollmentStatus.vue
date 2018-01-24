<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{list.title}}</h1>
    </header>
    <div class="mui-content absolute">

      <div class="enroll">
        <img :src="list.image_url"/>
        <div class="enroll-text">
          <p>{{list.title}}</p>
          <p>{{list.created_at}}</p>
        </div>

        <div class="text" v-html="list.description"></div>


      </div>
      <div class="btn">
        <button class="blue" v-if="list.status =='1'" @tap.stop.prevent="signUp()">立即报名</button>
        <button class="gray" v-if="list.status =='2'">报名结束</button>
        <button class="yellow" v-if="list.status =='3'">申请中</button>
        <button class="yellow" v-if="list.status =='4'">报名成功</button>
        <button class="gray" v-if="list.status =='5'">报名失败</button>
        <button class="blue" v-if="list.status =='6'" @tap.stop.prevent="signUp()">重新申请</button>
      </div>

      <div class="back" v-if="data.description">
        {{data.description}}


      </div>

      <div class="feedback" v-show="list.status =='3' || list.status =='4' ">
        <div class="send">
          <input type="text" v-model.trim="comment" id="text" placeholder='可在此留言，只有您和平台可见!'/>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="message()">
            <use xlink:href="#icon-fasong"></use>
          </svg>
        </div>

        <!--留言--> <!--v-if="list.status =='3' || list.status =='4' "-->
        <div style="position: relative;width:100%; min-height: 530px;" v-show="list.status =='3' || list.status =='4' ">
          <div class="mui-scroll-wrapper">
            <div class="mui-scroll">
              <ul class="message">
                <li v-for="item in cont">
                  <p>
                    <span class="mui-ellipsis">{{item.user_name}}</span>
                    <span>{{item.created_at}}</span>
                  </p>
                  <p>
                    {{item.content}}
						</p>
                </li>
              </ul>
            </div>
          </div>
          <!---->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { postRequest } from '../../utils/request'
  const EnrollmentStatus = {
    data: () => ({
      list: [],
      data: '',
      comment: '',
      loading: true,
      cont: [],
      number: ''
    }),
    created () {
    },
    updated () {
      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been re-rendered
        if (window.mui.os.plus) {
          var aList = document.querySelectorAll('a[href^="http"]')
          for (let i = 0; i < aList.length; i++) {
            aList[i].addEventListener('click', function (e) {
              e.preventDefault()
              window.plus.runtime.openURL(this.href)
            }, false)
          }
        }
      })
    },
    computed: {
      // 动态计算当前的页数；
      page () {
        if (this.number) {
          return parseInt(this.number.current_page) + 1
        }
        return 1
      },
      // 有无数据；
      nothing () {
        if (this.loading) {
          return -1
        }
        return this.list.length ? 0 : 1
      }
    },
    methods: {
      refreshPageData () {
        this.init()
      },
      // 报名；
      signUp () {
        let id = parseInt(this.$route.params.id)
        postRequest(`activity/enroll`, {activity_id: id}).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          console.log(response.data.data.tip)
          if (response.data.data) {
            // mui.toast(response.data.data.tip);
            this.getData()
          }

          this.loading = 0
        })
      },
      getData () {
        let id = parseInt(this.$route.params.id)
        postRequest(`activity/detail`, {activity_id: id}).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          if (response.data.data) {
            this.list = response.data.data.info
            this.data = response.data.data.feedback
          }

          this.loading = 0
        })
      },
      message () {
        let id = parseInt(this.$route.params.id)
        if (this.comment) {
          postRequest(`activity/commentCreate`, {activity_id: id, content: this.comment}).then(response => {
            var code = response.data.code
            // 如果请求不成功提示信息 并且返回上一页
            if (code !== 1000) {
              window.mui.alert(response.data.message)
              window.mui.back()
              return
            }

            if (response.data.data) {
              this.cont.unshift(response.data.data)
              this.comment = ''
            }
            this.loading = 0
          })
        }
      },
      getPrevList () {
        let id = parseInt(this.$route.params.id)
        postRequest(`activity/commentList`, {activity_id: id}).then(response => {
          var code = response.data.code
          // 如果请求不成功提示信息 并且返回上一页；
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          if (response.data.data) {
            this.cont = response.data.data.data
            this.number = response.data.data
          }

          this.loading = 0
        })
      },
      init () {
        // 活动详情
        this.getData()
        // 列表
        this.getPrevList()
      }
    },
    watch: {
      '$route': 'refreshPageData'
    },
    mounted () {
      this.init()
    }
  }
  export default EnrollmentStatus
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

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .mui-content.absolute {
    background: #F3F4F5;
    /*border-color: #FFFFFF;*/

  }

  .enroll {
    width: 100%;
    /*height: 100%;*/
    padding: 15px 16px 16px 16px;
    background: #FEFFFE;
  }

  /*.enroll img{
  	width: 100%;
  	height: 143px;
  }*/
  .enroll-text {
    width: 100%;
    height: 57px;
    /*background: #CCCCCC;*/
    margin-top: 8px;
    border-bottom: 0.5px solid #DCDCDC;
  }

  .enroll-text p:nth-of-type(1) {
    font-size: 14px;
    color: #444444;
    font-weight: 500;

  }

  .enroll-text p:nth-of-type(2) {
    font-size: 12px;
    color: #b4b4b6;
    margin-top: 3px;

  }

  .btn {
    width: 100%;
    padding: 15px 16px 1px 16px;
    background: #FEFFFE;
    margin-top: 10px;
  }

  .blue {
    width: 100%;
    height: 44px;
    background: #03aef9;
    color: #FFFFFF;
    font-size: 16px;
    border-radius: 5px;
    margin-bottom: 15px;
    text-align: center;
    border: none;
  }

  .yellow {
    width: 100%;
    height: 44px;
    background: #fcc816;
    color: #FFFFFF;
    font-size: 16px;
    border-radius: 5px;
    margin-bottom: 15px;
    text-align: center;
    border: none;
  }

  .gray {
    width: 100%;
    height: 44px;
    background: #b4b4b6;
    color: #FFFFFF;
    font-size: 16px;
    border-radius: 5px;
    margin-bottom: 15px;
    text-align: center;
    border: none;
  }

  .feedback {
    width: 100%;
    min-height: 80px;
    padding: 15px 16px 15px 16px;
    background: #FEFFFE;
    margin-top: 10px;
    border: none;

  }

  .send {
    width: 100%;
    height: 42px;
    border-radius: 5px;
    border: 0.5px solid #DCDCDC;
  }

  .feedback input {
    width: 80%;
    height: 40px;
    float: left;
    font-size: 14px;
    border: none;
  }

  .feedback svg {
    font-size: 30px;
    float: right;
    margin-right: 10px;
    margin-top: 5px;
    color: #03aef9;
  }

  .text {
    width: 100%;
    border: 1px solid #DCDCDC;
    margin-top: 16px;
    padding: 5px 8px;
    word-wrap: break-word;
    overflow-x: hidden;
  }

  .back {
    width: 100%;
    background: #FFFFFF;
    font-size: 14px;
    color: #808080;
    text-align: center;
    padding: 20px 10px;
    margin-top: 10px;
    margin-bottom: 10px;

  }

  /*评论 样式*/
  .message {
    width: 100%;
    overflow: hidden;
    margin-top: 10px;
    /*background: #CCCCCC;*/
  }

  .message li {
    margin-top: 10px;
    overflow: hidden;
    border-bottom: 0.5px solid #DCDCDC;
  }

  .message p:nth-of-type(1) {
    width: 100%;
    overflow: hidden;

  }

  .message p:nth-of-type(1) span:nth-child(1) {
    width: 50%;
    float: left;
    text-align: left;
    font-size: 13px;
    color: #03aef9;
  }

  .message p:nth-of-type(1) span:nth-child(2) {
    width: 50%;
    float: left;
    text-align: right;
    font-size: 12px;
    color: #c8c8c8;
  }

  .message p:nth-of-type(2) {
    width: 100%;
    font-size: 13px;
    margin-bottom: 5px;
    margin-top: 3px;
    color: #444444;

  }

  /***媒体查询*****/

  @media screen and (min-width: 320px) {
    .enroll img {
      width: 100%;
      height: 133px;
      border-radius: 4px;
    }
  }

  @media screen and (min-width: 375px) {
    .enroll img {
      width: 100%;
      height: 145px;
      border-radius: 4px;
    }
  }

  @media screen and (min-width: 414px) {
    .enroll img {
      width: 100%;
      height: 172px;
      border-radius: 4px;
    }
  }
</style>
