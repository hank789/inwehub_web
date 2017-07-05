<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" v-show="!isShare"></a>
      <h1 class="mui-title">个人名片</h1>
    </header>

    <div class="mui-content" v-show="!loading">

      <div class="erweimaWrapper" v-show="showQrCode" @tap.stop.prevent="toggleQrCode">
        <div class="header">
          <div class="avatar">
            <div class="avatarInner">
              <img :src="resume.info.avatar_url" class="avatar"/>
            </div>
          </div>
        </div>

        <div class="realname">
          <span>{{ resume.info.name }}</span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zhuanjiabiaoji"></use>
          </svg>
        </div>

        <div class="erweimaSplite">
          <span></span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-logowenzi"></use>
          </svg>
          <span></span>
        </div>
        <div class="qRCode">
          <qrcode :value="shareUrl" :options="qRCodeOptions" :tag="'img'"></qrcode>
        </div>
      </div>


      <div class="professor">

      </div>

      <div class="basic">
        <div class="cardWrapper">
          <div class="card">
            <div class="erweima" @tap.stop.prevent="toggleQrCode"><img src="../../statics/images/resume_erweima_3x.png"/></div>
            <div class="share" @tap.stop.prevent="share">
              <svg class="icon" aria-hidden="true"  v-show="resume.info.is_expert">
                <use xlink:href="#icon-fenxiang"></use>
              </svg>
            </div>
            <div class="header">
              <div class="avatar">
                <div class="avatarInner">
                  <img :src="resume.info.avatar_url" class="avatar"/>
                </div>
              </div>
            </div>
            <div class="detail">
              <div class="realname">
                <span>{{ resume.info.name }}</span>
                <svg class="icon" aria-hidden="true" v-show="resume.info.is_expert">
                  <use xlink:href="#icon-zhuanjiabiaoji"></use>
                </svg>
              </div>
              <div class="counter">关注<b>{{ resume.info.followers }}</b>次<i class="separate"></i>咨询<b>{{ resume.info.questions }}</b>次<i class="separate"></i>评价<b>{{ resume.info.feedbacks }}</b>次<i
                class="separate"></i>{{ resume.info.total_score }}

              </div>
              <div class="item">
                <span>{{ resume.info.company }}</span>
                <i class="separate"></i>
                <span>{{ resume.info.title }}</span>
              </div>
              <div class="item">
                <span>{{ resume.info.work_years }}年工作经验</span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-dingwei"></use>
                </svg>
                <span>{{ resume.info.province.name }} {{ resume.info.city.name }}</span>
              </div>
              <div class="item industry">
                <template v-for="(industry, index) in resume.info.industry_tags">
                    <span>{{industry.text}}</span>
                </template>


              </div>
            </div>
          </div>
        </div>

        <div class="description">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jianjie"></use>
          </svg>
          <span>{{ resume.info.description }}</span>
        </div>
      </div>
    </div>

    <h5 v-show="(resume.jobs.length && !isShare) || (isShare && resume.info.is_job_info_public)">工作经历</h5>
    <div class="list" v-show="(resume.jobs.length && !isShare) || (isShare && resume.info.is_job_info_public)">
      <div class="item" v-for="(job, index) in resume.jobs">
        <div class="time">{{ job.begin_time }} ~ {{ job.end_time }}</div>
        <div class="company">{{ job.company }}<i class="separate"></i>{{ job.title }}</div>
        <div class="description  hide mui-ellipsis-3" v-show="job.description">{{ job.description }}
        </div>
        <div class="toggle show" @tap.stop.prevent="toggleDeatil" v-show="job.description">查看</div>
      </div>
    </div>

    <h5 v-show="(resume.projects.length && !isShare) || (isShare && resume.info.is_project_info_public)">项目经历</h5>
    <div class="list" v-show="(resume.projects.length && !isShare) || (isShare && resume.info.is_project_info_public)">
      <div class="item" v-for="(project, index) in resume.projects">
        <div class="time">{{ project.begin_time }} ~ {{ project.end_time }}</div>
        <div class="company">{{ project.project_name }}<i class="separate"></i>{{ project.title }}</div>
        <div class="others">
          <div class="other"><div class="title">【行业领域】</div><div class="content">
              <template v-for="(industry, index) in project.industry_tags">
                  {{ industry.text }} ;
              </template>
          </div></div>
          <div class="other"><div class="title">【产品类型】</div><div class="content">
            <template v-for="(productTag, index) in project.product_tags">
              {{ productTag.text }} ;
              </template>
          </div></div>
          <div class="other"><div class="title">【客户名称】</div><div class="content">{{ project.customer_name }}</div></div>
        </div>
        <div class="description  hide mui-ellipsis-3" v-show="project.description">{{ project.description }}</div>
        <div class="toggle show" @tap.stop.prevent="toggleDeatil" v-show="project.description">查看</div>
      </div>

    </div>

    <h5 v-show="(resume.edus.length && !isShare) || (isShare && resume.info.is_edu_info_public)">教育经历</h5>
    <div class="list" v-show="(resume.edus.length && !isShare) || (isShare && resume.info.is_edu_info_public)">
      <div class="item" v-for="(edu, index) in resume.edus">
        <div class="time">{{ edu.begin_time }} ~ {{ edu.end_time }}</div>
        <div class="company">{{ edu.school }}<i class="separate"></i>{{ edu.degree }}<i class="separate"></i>{{ edu.major }}</div>
        <div class="description  hide mui-ellipsis-3" v-show="edu.description">{{ edu.description }}
        </div>
        <div class="toggle show" @tap.stop.prevent="toggleDeatil" v-show="edu.description">查看</div>
      </div>
    </div>

      <div class="noPublic" v-show="isShare && (!resume.info.is_edu_info_public || !resume.info.is_job_info_public ||  !resume.info.is_project_info_public)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-bugongkai"></use>
          </svg>
          <div class="desc">部分信息暂未公开</div>
      </div>

      <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="$router.pushPlus('/my/info')" v-if="!isShare" v-show="!loading">继续编辑
      </button>
      <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="$router.pushPlus('/ask?id='+uuid)" v-else v-show="!loading">向Ta咨询
      </button>


      <div id="shareWrapper" class="shareWrapper mui-popover mui-popover-action mui-popover-bottom">
          <div class="title">分享到</div>
          <div class="more">
               <div class="single" id="wechatShareBtn">
                   <img src="../../statics/images/wechat_2x.png"/>
               </div>
          </div>
      </div>


    <div id="shareShowWrapper" class="mui-popover mui-popover-action mui-popover-top" @tap.stop.prevent="toggleShareNav()">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-dianzheli"></use>
      </svg>
    </div>

  </div>
</template>


<script>
  import localEvent from '../../stores/localStorage';
  import {NOTICE, TASK_LIST_APPEND, ANSWERS_LIST_APPEND, ASKS_LIST_APPEND, USERS_APPEND} from '../../stores/types';
  import router from '../../routers/index';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import {updateUserInfoCache, getUserInfo} from '../../utils/user';
  import wx from 'weixin-js-sdk';

  export  default {
    data(){
      const currentUser = localEvent.getLocalItem('UserInfo');

      return {
        im_tokenMsg: '',
        uuid: currentUser.uuid,
        showQrCode:false,
        isShare:false,
        loading:true,
        shareUrl:'',
        wechatConfig:{},
        resume:{

            info:{
              avatar_url:'',
              industry_tags:[],
              province:{
                  key:'',
                  name:''
              },
              city:{
                  key:'',
                  name:'',
              }
            },
            edus:[],
            projects:[],
            jobs:[],

        },
        qRCodeOptions:{ size: 100,padding:0}
      }
    },
    created () {
        var from = this.$router.currentRoute.path;
        var fullUrl = window.location.href;

        this.shareUrl = fullUrl.replace(/#\/.*?$/, '#/share/resume?id=' + this.uuid);

        if (from === '/share/resume') {
            this.isShare = true;
            this.uuid = this.$route.query.id;
        }

        postRequest(`profile/resumeInfo`, {uuid:this.uuid}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.toast(response.data.message);
          }

          this.resume = response.data.data;
          this.loading = 0;
        });
    },
    mounted(){
      var fullUrl = window.location.href;
      var currentUrl = fullUrl.split('#')[0];

      //mui.alert('当前url:' + currentUrl +'编译后:'+currentUrlEncoded);
      postRequest(`share/wechat/jssdk`, {current_url:currentUrl}).then(response => {
        var code = response.data.code;
        if (code !== 1000) {
          mui.toast(response.data.message);
        }

        this.wechatConfig = response.data.data.config;
        this.appendWechat();
      });
    },
    methods:{
      toggleShareNav(){
         mui('#shareShowWrapper').popover('toggle');
      },
      appendWechat(){
        var t = this;
        //mui.alert('当前url:'+location.href);
        var config = this.wechatConfig;
        console.log(config);
        wx.config(config);

        wx.error(function(res){
          //mui.alert('wx:error:'+ JSON.stringify(res));
        });

        wx.ready(function(){

          var wechatBtn = document.getElementById('wechatShareBtn');
          wechatBtn.addEventListener('click', () => {

            var title = "InweHub名片 | " + t.resume.info.name;

            wx.onMenuShareAppMessage({
              title: title, // 分享标题
              desc: 'test', // 分享描述
              link: t.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: t.resume.info.avatar_url, // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
                // 用户确认分享后执行的回调函数
                mui.toast('用户分享成功');
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
                mui.toast('用户取消了分享');
              }
            });

            wx.onMenuShareTimeline({
              title: title, // 分享标题
              link: t.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: t.resume.info.avatar_url, // 分享图标
              success: function () {
                mui.toast('用户分享成功');
              },
              cancel: function () {
                mui.toast('用户取消了分享');
              }
            });

            mui('#shareWrapper').popover('toggle');
            t.toggleShareNav();
          });
        });
      },
      toggleDeatil(event){

          var Desc = event.target.previousSibling.previousSibling;
          if (/hide/.test(Desc.className)) {
            Desc.className = Desc.className.replace(' hide', '');
            Desc.className = Desc.className.replace(' mui-ellipsis-3', '');
            Desc.className += ' show';

            event.target.className = "toggle hide";
            event.target.innerText = '收起';
          } else {
            Desc.className = Desc.className.replace(' show', '');
            Desc.className += ' hide mui-ellipsis-3';

            event.target.className = "toggle show";
            event.target.innerText = '查看';
          }

      },
      share(){
        setTimeout(()=>{
          mui('#shareWrapper').popover('toggle');
        }, 150);
      },
      toggleQrCode(){
          this.showQrCode = !this.showQrCode;
      }
    }
  };

</script>

<style lang="less" rel="stylesheet/less" scoped>
  .professor {
    background-color: #161616;
    text-align: center;
    position: relative;
    height: 78px;
  }

  .erweimaWrapper{
    position: absolute;
    left: 16px;
    background: #444;
    margin-top: 8px;
    width: 263px;
    border-radius: 4px;
    z-index: 77;
    text-align: center;
    padding-bottom: 36px;

    .header {
      position: relative;
      height: 92px;

      .avatar {
        position: absolute;
        left: 50%;
        margin-top:15px;
        margin-left: -34.5px;

        z-index: 9;
        color: #ffffff;
        display: inline-block;
        height: 69px;
        width: 69px;
        font-size: 20px;
        text-align: center;
        border-radius: 50%;
        vertical-align: top;
      }

      .avatar .avatarInner {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        width: 100%;
        height: 100%;
        -webkit-box-align: center;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
      }

      .avatar img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
        display: block;
      }
    }

    .realname {
      margin-top:20px;
      color:#fff;
      font-size:14px;
      font-weight: bold;

      span{
        position: relative;
        right:-3px;
      }
      .icon {
        vertical-align: top;
        font-size: 20px;
        color: #3c95f9;
      }


    }

    .erweimaSplite{
      margin-top: -30px;

      span{
        display: inline-block;
        width:62px;
        margin: 0 3px;
        border-bottom:1px solid #808080;
      }

      .icon{
        color: #252525;
        font-size: 50px;
        position: relative;
        top: 17px;
      }
    }

    .qRCode{
      margin-top:10px;
      margin-left:36px;
      background: #fff;
      width:190px;
      height:190px;
      border-radius: 4px;

      img{
        width:170px;
        height:170px;
        margin-top:10px;
        border-radius: 4px;
      }
    }
  }

  .basic {
    background: #fff;

    .description {
      font-size: 14px;
      color: #808080;
      padding: 19px 14px 35px;
      line-height: 24px;

      .icon {
        font-size: 20px;
        color: #3c95f9;
      }
    }
  }

  .separate {
    display: inline-block;
    height: 10px;
    margin: 0 8px;
    border-left: 1px solid #c8c8c8;
  }

  .cardWrapper {
    margin-top: -69px;
    padding: 0 16px;
    width: 100%;

    .card {
      border-radius: 4px;
      background: #ececee;
      width: 100%;
      height: 300px;
      position: relative;

      .erweima {
        width: 55px;
        height: 51px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .share {
        position: absolute;
        font-size: 24px;
        right: 19px;
        top: 14px;
        color: #808080;
      }

      .header {
        height: 92px;
        margin-top: -20px;

        .avatar {
          position: absolute;
          left: 50%;
          margin-left: -46px;

          z-index: 9;
          color: #ffffff;
          display: inline-block;
          height: 92px;
          width: 92px;
          font-size: 20px;
          text-align: center;
          border-radius: 50%;
          vertical-align: top;
        }

        .avatar .avatarInner {
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          width: 100%;
          height: 100%;
          -webkit-box-align: center;
          -webkit-align-items: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: center;
          -webkit-justify-content: center;
          -ms-flex-pack: center;
          justify-content: center;
        }

        .avatar img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
          display: block;
        }
      }

      .detail {
        margin-top:10px;
        text-align: center;

        .realname {
          font-weight: bold;

          span{
            position: relative;
            right:-3px;
          }
          .icon {
            vertical-align: bottom;
            font-size: 22px;
            color: #3c95f9;
          }

        }

        .counter {
          margin-top: 8px;
          font-size: 12px;
          color: #808080;

          b {
            color: #e63964;
          }
        }

        .item {
          color: #444444;
          font-size: 14px;
          margin: 7px;

          .icon {
            color: #b4b4b6;
            font-size: 16px;
          }

          &.industry span{
              border:1px solid #cbcbcb;
              display: inline-block;
              border-radius: 50px;
              color:#808080;
              font-size:12px;
              padding:0 7px;
              margin:0 2px;
          }
        }
      }
    }

  }

  h5{
    margin:0;
    padding:11px 0;
    background: #f3f4f6;
    width:100%;
    font-size:14px;
    color:#313131;
    text-align: center;
  }

  .list{
    background: #fff;
    padding:0 10px 0 30px;
    position: relative;

    &:before{
      position: absolute;
      top:20px;
      left:20px;
      content: '';
      width: 1px;
      bottom:12px;
      background-color: #ececee;
    }

    .item{
      position: relative;
      padding:10px 0 10px 5px;

      &:after{
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 1px;
        content: '';
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        background-color: #dcdcdc;
      }

      &:last-child:after{
        display: none;
      }

      .others{
        color:#b4b4b6;
        font-size:13px;

        .other{
          display: -webkit-box;

          .title{
              margin-left:-10px;
              width:80px;
          }

          .content{
            padding-right: 70px;
          }
        }
      }

      .time{
        position: relative;
        font-size:14px;
        margin-top:2px;
        color:#3c95f9;
      }

      .time:before{
        position: absolute;
        left:-18px;
        top:5px;
        content: '';
        width:8px;
        height:8px;
        background:#3c95f9;
        border-radius: 4px;
      }

      .company{
        font-size:14px;
        color:#444;
        margin:5px 0;
      }

      .description{
        color:#808080;
        font-size:13px;
        margin-top: 6px;
        line-height: 24px;
        -webkit-transition:all 3s;
        margin-bottom:30px;
        height:auto;
        white-space:pre-wrap;

        &.hide{
          height:69px;
        }
      }

      .toggle{
        position: absolute;
        right:0;
        bottom:10px;
        font-size:13px;
        margin-right:5px;
        color:#3c95f9;

        &.show:before{
          border:none;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 10px solid #d8d8d8;
        }

        &:before{
            position: absolute;
            left:-19px;
            top:5px;
            width: 0;
            height: 0;
            content:'';
            border:none;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 10px solid #d8d8d8;
        }
      }
    }
  }

  button{
    border-radius: 0;
    padding:12px 0;
    height:48px;
    margin:0;
    font-size:17px;
  }

  .shareWrapper {
      .title{
        background: #ececee;
        text-align: center;
        font-size:14px;
        padding:12px 0;
      }

    .more{
      background: #fff;
      padding:10px;

      .single{
        width:55px;
        height:55px;
        margin:0 10px;

        img{
          width:100%;
          height:100%;
        }
      }
    }
  }

  .noPublic{
      margin:18px 0;
      background: #fff;
      text-align: center;
      font-size:13px;
      color:#b4b4b6;
      padding-bottom:10px;

      .icon{
        font-size:50px;
        color:#f3f4f6;
      }
  }

  #shareShowWrapper{
    position: absolute;
    right:0;
    top:0;

    .icon{
        color:#fff;
        position: absolute;
        right:15px;
        top:10px;
        font-size: 70px;
    }
  }
</style>
