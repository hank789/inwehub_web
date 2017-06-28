<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">个人名片</h1>
      <!--<a class="mui-icon myicon myicon-share mui-pull-right"></a>-->
    </header>

    <div class="mui-content">

      <div class="erweimaWrapper" v-show="showQrCode" @tap.stop.prevent="toggleQrCode">
        <div class="header">
          <div class="avatar">
            <div class="avatarInner">
              <img :src="avatar" class="avatar"/>
            </div>
          </div>
        </div>

        <div class="realname">
          <span>郭大红</span>
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
          <qrcode value="Hello, World!" :options="{ size: 190,padding:10}"></qrcode>
        </div>

      </div>


      <div class="professor">

      </div>

      <div class="basic">
        <div class="cardWrapper">
          <div class="card">
            <div class="erweima" @tap.stop.prevent="toggleQrCode"><img src="../../statics/images/resume_erweima_3x.png"/></div>
            <div class="share" @tap.stop.prevent="share">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-fenxiang"></use>
              </svg>
            </div>
            <div class="header">
              <div class="avatar">
                <div class="avatarInner">
                  <img :src="avatar" class="avatar"/>
                </div>
              </div>
            </div>
            <div class="detail">
              <div class="realname">
                <span>郭大红</span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhuanjiabiaoji"></use>
                </svg>
              </div>
              <div class="counter">关注<b>0</b>次<i class="separate"></i>咨询<b>2</b>次<i class="separate"></i>评价<b>2</b>次<i
                class="separate"></i>综合评分暂无



              </div>
              <div class="item">
                <span>上海樱维网络有限公司</span>
                <i class="separate"></i>
                <span>运营专员</span>
              </div>
              <div class="item">
                <span>1998-10-19从业</span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-dingwei"></use>
                </svg>
                <span>上海 黄浦</span>
              </div>
              <div class="item">
                消费品行业；咨询行业 ；企业维护

              </div>
            </div>
          </div>
        </div>

        <div class="description">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jianjie"></use>
          </svg>
          <span>SAP咨询行业15年从业经历，熟悉离散制造行业，专注pp等模块，是一位非常自身的超级顾问。写三行，永远写三行都写三行。都写三行。都写三行。</span>
        </div>
      </div>
    </div>

    <h5>工作经历</h5>
    <div class="list">
      <div class="item">
        <div class="time">2015-02-17 ~ 至今</div>
        <div class="company">上海樱维网络有限公司<i class="separate"></i>运营专员</div>
        <div class="description  hide mui-ellipsis-3">负责内部有关工作指示和会议精神的传达;负责公司会议室布置和有关会议的准备工作;负责内部人员的上传下达工作的沟通和联系;根据上级的安排，负责起草有关通知
        负责内部有关工作指示和会议精神的传达;负责公司会议室布置和有关会议的准备工作;负责内部人员的上传下达工作的沟通和联系;根据上级的安排，负责起草有关通知
        </div>
        <div class="toggle show" @tap.stop.prevent="toggleDeatil">查看</div>
      </div>
      <div class="item">
        <div class="time">2015-02-17 ~ 至今</div>
        <div class="company">上海樱维网络有限公司<i class="separate"></i>运营专员</div>
        <div class="description  hide mui-ellipsis-3">负责内部有关工作指示和会议精神的传达;负责公司会议室布置和有关会议的准备工作;负责内部人员的上传下达工作的沟通和联系;根据上级的安排，负责起草有关通知、通知等文件;
        </div>
        <div class="toggle show" @tap.stop.prevent="toggleDeatil">查看</div>
      </div>
    </div>

    <h5>项目经历</h5>
    <div class="list">
      <div class="item">
        <div class="time">2015-02-17 ~ 至今</div>
        <div class="company">上海樱维网络有限公司<i class="separate"></i>运营专员</div>
        <div class="description  hide mui-ellipsis-3">负责内部有关工作指示和会议精神的传达;负责公司会议室布置和有关会议的准备工作;负责内部人员的上传下达工作的沟通和联系;根据上级的安排，负责起草有关通知、通知等文件;
        </div>
        <div class="toggle show" @tap.stop.prevent="toggleDeatil">查看</div>
      </div>
      <div class="item">
        <div class="time">2015-02-17 ~ 至今</div>
        <div class="company">上海樱维网络有限公司<i class="separate"></i>运营专员</div>
        <div class="description  hide mui-ellipsis-3">负责内部有关工作指示和会议精神的传达;负责公司会议室布置和有关会议的准备工作;负责内部人员的上传下达工作的沟通和联系;根据上级的安排，负责起草有关通知、通知等文件;
        </div>
        <div class="toggle show" @tap.stop.prevent="toggleDeatil">查看</div>
      </div>
    </div>

    <h5>教育经历</h5>
    <div class="list">
      <div class="item">
        <div class="time">2015-02-17 ~ 至今</div>
        <div class="company">上海樱维网络有限公司<i class="separate"></i>运营专员</div>
        <div class="description  hide mui-ellipsis-3">负责内部有关工作指示和会议精神的传达;负责公司会议室布置和有关会议的准备工作;负责内部人员的上传下达工作的沟通和联系;根据上级的安排，负责起草有关通知、通知等文件;
        </div>
        <div class="toggle show" @tap.stop.prevent="toggleDeatil">查看</div>
      </div>
      <div class="item">
        <div class="time">2015-02-17 ~ 至今</div>
        <div class="company">上海樱维网络有限公司<i class="separate"></i>运营专员</div>
        <div class="description  hide mui-ellipsis-3">负责内部有关工作指示和会议精神的传达;负责公司会议室布置和有关会议的准备工作;负责内部人员的上传下达工作的沟通和联系;根据上级的安排，负责起草有关通知、通知等文件;
        </div>
        <div class="toggle show" @tap.stop.prevent="toggleDeatil">查看</div>
      </div>
    </div>

      <button type="button" class="mui-btn mui-btn-block mui-btn-primary">继续编辑
        </button>


      <div id="shareWrapper" class="shareWrapper mui-popover mui-popover-action mui-popover-bottom">
          <div class="title">分享到</div>
          <div class="more">
               <div class="single">
                   <img src="../../statics/images/wechat_2x.png"/>
               </div>
          </div>
      </div>

  </div>
</template>


<script>
  import localEvent from '../../stores/localStorage';
  import {NOTICE, TASK_LIST_APPEND, ANSWERS_LIST_APPEND, ASKS_LIST_APPEND, USERS_APPEND} from '../../stores/types';
  import router from '../../routers/index';
  import {updateUserInfoCache, getUserInfo} from '../../utils/user';

  export  default {
    data(){
      const currentUser = localEvent.getLocalItem('UserInfo');

      return {
        im_tokenMsg: '',
        name: currentUser.name,
        phone: currentUser.phone,
        avatar: currentUser.avatar_url,
        title: currentUser.title,
        company: currentUser.company,
        account_info_complete_percent: currentUser.account_info_complete_percent,
        isExpert: currentUser.is_expert,
        total_money: currentUser.total_money,
        user_level: currentUser.user_level,
        user_credits: currentUser.user_credits,
        user_coins: currentUser.user_coins,
        questions: currentUser.questions,
        answers: currentUser.answers,
        tasks: currentUser.tasks,
        projects: currentUser.projects,
        expert_level: currentUser.expert_level,
        showQrCode:false
      }
    },
    methods:{
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

      canvas{
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
    padding:0 10px 28px 30px;
    position: relative;

    &:before{
      position: absolute;
      top:20px;
      left:20px;
      content: '';
      width: 1px;
      bottom:58px;
      background-color: #ececee;
    }

    .item{
      position: relative;
      padding:10px 0 41px 5px;

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

      .time{
        position: relative;
        font-size:14px;
        margin-top:2px;
        color:#3c95f9;
      }

      .time:before{
        position: absolute;
        left:-19px;
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
        height:auto;

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
</style>
