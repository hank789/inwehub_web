<template>
  <div class="vueWrapper">
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" v-show="!isShare || (isShare && canBack)"></a>
      <h1 class="mui-title">个人名片</h1>
    </header>

    <div class="mui-content resumeWrapper" v-show="!loading">

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
          <qr-code :text="shareUrl" :size="170" error-level="M"></qr-code>
        </div>
        <div class="qRhelp">
          扫一扫试试?

        </div>
      </div>

      <div class="professor">

      </div>

      <div class="basic">
        <div class="cardWrapper">
          <div class="card">
            <div class="erweima" @tap.stop.prevent="toggleQrCode"><img
              src="../../statics/images/resume_erweima_3x.png"/></div>
            <div class="collect" @tap.stop.prevent="collectProfessor" v-show="uuid !== cuuid && !resume.is_followed">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shoucang"></use>
              </svg>
            </div>
            <div class="collect active" @tap.stop.prevent="collectProfessor"
                 v-show="uuid !== cuuid && resume.is_followed">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shoucanghover"></use>
              </svg>
            </div>
            <div class="share" @tap.stop.prevent="share">
                  <svg class="icon" aria-hidden="true">
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
              <!--文章和评论-->
              <div class="news">
                <p class="mui-ellipsis" @tap.stop.prevent="$router.pushReadHubPage('/@'+resume.info.id)">
                  文章<span>{{ resume.info.submission_count }}</span>篇</p>
                <i></i>
                <p class="mui-ellipsis" @tap.stop.prevent="$router.pushReadHubPage('/@'+resume.info.id)">
                  评论<span>{{ resume.info.comment_count }}</span>条</p>
              </div>
              <!---->
              <div class="counter">关注<b>{{ resume.info.followers }}</b>次<i
                class="separate"></i>咨询<b>{{ resume.info.answers }}</b>次<i
                class="separate"></i>评价<b>{{ resume.info.feedbacks }}</b>次<i
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
            <use xlink:href="#icon-jieshaoshixin"></use>
          </svg>
          <span>{{ resume.info.description }}</span>
        </div>
      </div>





    <h5 v-show="(resume.jobs.length && !isShare) || (isShare && resume.info.is_job_info_public)">工作经历</h5>
    <div class="list" v-show="(resume.jobs.length && !isShare) || (isShare && resume.info.is_job_info_public)">
      <div class="item" v-for="(job, jobIndex) in resume.jobs" v-show="!(isShare && jobIndex >= 3 && !isShowItemJobMore)" :jobIndex="jobIndex">
        <div class="time">{{ job.begin_time }} ~ {{ job.end_time }}</div>
        <div class="company">{{ job.company }}<i class="separate"></i>{{ job.title }}</div>
        <div class="description  hide mui-ellipsis-3" v-show="job.description">{{ job.description }}

        </div>
        <div class="toggle show" @tap.stop.prevent="toggleDeatil" v-show="job.description">查看</div>
      </div>
    </div>

    <div class="seeMoreWrapper"
         v-show="(isShare && !resume.info.is_job_info_public && !this.cuuid) || (isShare && resume.jobs.length > 3)">
      <div class="seeMore" @tap.click.prevent="showJobMore($event)">查看所有工作经历</div>
    </div>

    <h5 v-show="(resume.projects.length && !isShare) || (isShare && resume.info.is_project_info_public)">项目经历</h5>
    <div class="list" v-show="(resume.projects.length && !isShare) || (isShare && resume.info.is_project_info_public)">
      <div v-for="(project, projectIndex) in resume.projects" class="item" :projectIndex="projectIndex" v-show="!(isShare && projectIndex >= 3 && !isShowProjectMore)">
        <div class="time">{{ project.begin_time }} ~ {{ project.end_time }}</div>
        <div class="company">{{ project.project_name }}<i class="separate"></i>{{ project.title }}</div>
        <div class="others">
          <div class="other">
            <div class="title">【行业领域】</div>
            <div class="content">
              <template v-for="(industry, index) in project.industry_tags">
                {{ industry.text }} ;

              </template>
            </div>
          </div>
          <div class="other">
            <div class="title">【产品类型】</div>
            <div class="content">
              <template v-for="(productTag, index) in project.product_tags">
                {{ productTag.text }} ;

              </template>
            </div>
          </div>
          <div class="other">
            <div class="title">【客户名称】</div>
            <div class="content">{{ project.customer_name }}</div>
          </div>
        </div>
        <div class="description  hide mui-ellipsis-3" v-show="project.description">{{ project.description }}</div>
        <div class="toggle show" @tap.stop.prevent="toggleDeatil" v-show="project.description">查看</div>
      </div>

    </div>

    <div class="seeMoreWrapper"
         v-show="(isShare && !resume.info.is_project_info_public && !this.cuuid) || (isShare && resume.projects.length > 3)">
      <div class="seeMore" @tap.click.prevent="showProjectMore($event)">查看所有项目经历</div>
    </div>

    <h5 v-show="(resume.edus.length && !isShare) || (isShare && resume.info.is_edu_info_public)">教育经历</h5>
    <div class="list" v-show="(resume.edus.length && !isShare) || (isShare && resume.info.is_edu_info_public)">
      <div class="item" v-for="(edu, eduIndex) in resume.edus" v-show="!(isShare && eduIndex >= 3 && !isShowitemEduMore)" :eduIndex="eduIndex">
        <div class="time">{{ edu.begin_time }} ~ {{ edu.end_time }}</div>
        <div class="company">{{ edu.school }}<i class="separate"></i>{{ edu.degree }}<i
          class="separate"></i>{{ edu.major }}
        </div>
        <div class="description  hide mui-ellipsis-3" v-show="edu.description">{{ edu.description }}

        </div>
        <div class="toggle show" @tap.stop.prevent="toggleDeatil" v-show="edu.description">查看</div>
      </div>
    </div>

    <div class="seeMoreWrapper"
         v-show="(isShare && !resume.info.is_edu_info_public && !this.cuuid) || (isShare && resume.edus.length > 3)">
      <div class="seeMore" @tap.click.prevent="showEduMore($event)">查看所有教育经历</div>
    </div>

    <div class="noPublic"
         v-show="!loading && isShare && (!resume.info.is_edu_info_public || !resume.info.is_job_info_public ||  !resume.info.is_project_info_public) && this.cuuid">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-bugongkai"></use>
      </svg>
      <div class="desc">部分信息暂未公开</div>
    </div>


  </div>

    <Share
      :title="shareOptions.title"
      :link="shareUrl"
      :hideShareBtn="true"
      :content="shareOptions.content"
      :imageUrl="shareOptions.imageUrl"
      :thumbUrl="shareOptions.thumbUrl"
      ref="shareComponent"
    ></Share>

    <button type="button" class="bottomButton mui-btn mui-btn-block mui-btn-primary"
            @tap.stop.prevent="$router.pushPlus('/my/info')" v-if="!isShare" v-show="!loading">继续编辑

    </button>
    <button type="button" class="bottomButton mui-btn mui-btn-block mui-btn-primary"
            @tap.stop.prevent="goAsk('/ask?id='+uuid)" v-else v-show="!loading">向Ta咨询

    </button>

  </div>
</template>

<script>
  import localEvent from '../../stores/localStorage';
  import {NOTICE, TASK_LIST_APPEND, ANSWERS_LIST_APPEND, ASKS_LIST_APPEND, USERS_APPEND} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import {updateUserInfoCache, getUserInfo} from '../../utils/user';
  import Share from '../../components/Share.vue';

  const currentUser = localEvent.getLocalItem('UserInfo');

  export default {
    data:() => ({
        shareOptions: {
          title: '',
          content: '',
          imageUrl: '',
          thumbUrl: ''
        },
        im_tokenMsg: '',
        uuid: currentUser.uuid,
        cuuid: currentUser.uuid,
        showQrCode: false,
        isShare: false,
        canBack: false,
        loading: true,
        shareUrl: '',
        wechatConfig: {},
        downloadHeader: false,
        isShowProjectMore:false,
        isShowItemJobMore:false,
        isShowitemEduMore:false,
        resume: {

          info: {
            avatar_url: '',
            industry_tags: [],
            province: {
              key: '',
              name: ''
            },
            city: {
              key: '',
              name: '',
            }
          },
          edus: [],
          projects: [],
          jobs: [],

        },
        qRCodeOptions: {
          size: 100,
          padding: 0,
          level: 'H'
        }
    }),
    components: {
      Share
    },
    watch: {
      '$route' () {
        this.getData();
      }
    },
    created() {
      this.getData();
    },
    mounted() {
      window.addEventListener('refreshData', (e) => {
        //执行刷新
        console.log('refresh-resume');
        this.getData();
      });
    },
    methods: {
      share:function(){
        this.$refs.shareComponent.share();
      },
      getData: function () {
        if (this.$route.query.goback) {
          this.canBack = true;
        }

        var from = this.$router.currentRoute.name;
        var fullUrl = process.env.H5_ROOT;

        if (from === 'share-resume' || from === 'share-resume-old') {
          this.isShare = true;
          this.uuid = this.$route.query.id || this.$route.params.id;
        }


        postRequest(`profile/resumeInfo`, {
          uuid: this.uuid
        }).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.toast(response.data.message);
            return;
          }

          this.resume = response.data.data;
          this.loading = 0;
          this.bindWechatShare();
        });
      },
      collectProfessor: function () {

        if (!this.cuuid) {
          window.location.href = process.env.API_ROOT + 'wechat/oauth?redirect=/home';
          return;
        }

        postRequest(`follow/user`, {
          id: this.uuid
        }).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }
          this.resume.is_followed = !this.resume.is_followed;
          mui.toast(response.data.data.tip);
        });
      },
      downLoadHeader() {
        var that = this;
        var dtask = plus.downloader.createDownload(this.resume.info.avatar_url, {
          filename: "_downloads/resume.png"
        }, function (d, status) {
          if (status == 200) {
            //下载成功
            console.log("下载成功:" + d.filename);
            console.debug(d);
            that.downloadHeader = true;
          } else {
            console.log("下载失败");
          }
        });
        //启动下载任务
        dtask.start();
      },
      bindWechatShare() {
        this.shareOptions.title = "InweHub名片 | " + this.resume.info.name + '：' + this.resume.info.company + '|' + '咨询顾问的专属身份认证@InweHub';
        this.shareOptions.content = "咨询顾问的专属身份认证@InweHub\n" + this.resume.info.company;
        this.shareOptions.imageUrl = this.resume.info.avatar_url;
        this.shareOptions.thumbUrl = this.resume.info.avatar_url + '?x-oss-process=image/resize,h_100,w_100';
        this.shareUrl = process.env.H5_ROOT + '/?#/share/resume/' + this.uuid + '?time=' + (new Date().getTime());
      },
      showJobMore(event) {

        if (!this.cuuid) {
          window.location.href = process.env.API_ROOT + 'wechat/oauth?redirect=/home';
          return;
        }

        this.isShowItemJobMore = true;
        event.target.style.display = 'none';
      },
      showProjectMore(event) {

        if (!this.cuuid) {
          window.location.href = process.env.API_ROOT + 'wechat/oauth?redirect=/home';
          return;
        }

        this.isShowProjectMore = true;

        event.target.style.display = 'none';
      },
      showEduMore(event) {

        if (!this.cuuid) {
          window.location.href = process.env.API_ROOT + 'wechat/oauth?redirect=/home';
          return;
        }

        this.isShowitemEduMore = true;
        event.target.style.display = 'none';
      },
      goAsk(url) {

        if (!this.resume.info.is_expert) {
          mui.alert('Ta还不是平台专家，暂时还不能向Ta咨询！');
          return;
        }

        if (this.uuid == this.cuuid) {
          mui.alert('不能向自己提问！');
          return;
        }

        if (mui.os.wechat) {
          window.location.href = process.env.API_ROOT + 'wechat/oauth?redirect=' + url;
        } else {
          this.$router.push(url);
        }

        return;
      },
      toggleShareNav() {
        mui('#shareShowWrapper').popover('toggle');
      },
      toggleDeatil(event) {

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
      toggleQrCode() {
        this.showQrCode = !this.showQrCode;
      }
    }
  };
</script>

<style lang="less" rel="stylesheet/less" scoped>
  /***************清除自带样式*****************/
  div, p, span, ul, li, i, a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }

  .professor {
    background-color: #3c3e44;
    text-align: center;
    position: relative;
    height: 78px;
  }

  .erweimaWrapper {
    position: absolute;
    left: 16px;
    background: #444;
    margin-top: 8px;
    width: 81%;
    border-radius: 4px;
    z-index: 77;
    text-align: center;
    padding-bottom: 18px;
    .header {
      position: relative;
      height: 92px;
      .avatar {
        position: absolute;
        left: 50%;
        margin-top: 15px;
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
      margin-top: 20px;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      span {
        position: relative;
        right: -3px;
      }
      .icon {
        vertical-align: top;
        font-size: 20px;
        color: #3c95f9;
      }
    }
    .erweimaSplite {
      margin-top: -30px;
      span {
        display: inline-block;
        width: 62px;
        margin: 0 3px;
        border-bottom: 1px solid #808080;
      }
      .icon {
        color: #252525;
        font-size: 50px;
        position: relative;
        top: 17px;
      }
    }
    .qRCode {
      margin-top: 10px;
      position: relative;
      text-align: center;
      height: 190px;
      div {
        position: absolute;
        left: 50%;
        margin-left: -95px;
        width: 190px;
        height: 190px;
        border-radius: 4px;
        background: #fff;
        padding: 10px;
        img {
          width: 170px;
          height: 170px;
          margin-top: 10px !important;
          border-radius: 4px;
        }
      }
    }
    .qRhelp {
      margin-top: 8px;
      text-align: center;
      color: #fff;
      font-size: 13px;
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
        font-size: 16px;
        color: #3c95f9;
        position: relative;
        top: 2px;
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
      position: relative;
      padding-bottom: 15px;
      .erweima {
        width: 55px;
        height: 51px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .collect {
        position: absolute;
        font-size: 30px;
        right: 55px;
        top: 12px;
        color: #808080;
        &.active {
          color: #3c95f9;
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
        margin-top: 10px;
        text-align: center;
        .realname {
          font-weight: bold;
          span {
            position: relative;
            right: -3px;
          }
          .icon {
            vertical-align: bottom;
            font-size: 22px;
            color: #3c95f9;
          }
        }
        .counter {
          margin-top: 3px;
          font-size: 12px;
          color: #808080;
          b {
            color: #e63964;
          }
        }
        .item {
          color: #444444;
          font-size: 14px;
          margin: 7px 7px 2px 7px;
          .icon {
            color: #b4b4b6;
            font-size: 16px;
          }
          &.industry span {
            border: 1px solid #cbcbcb;
            display: inline-block;
            border-radius: 50px;
            color: #808080;
            font-size: 12px;
            padding: 0 7px;
            margin: 0 2px 8px;
          }
        }
      }
    }
  }

  h5 {
    margin: 0;
    padding: 11px 0;
    background: #f3f4f6;
    width: 100%;
    font-size: 14px;
    color: #313131;
    text-align: center;
  }

  .list {
    background: #fff;
    padding: 0 10px 0 30px;
    position: relative;
    &:before {
      position: absolute;
      top: 20px;
      left: 20px;
      content: '';
      width: 1px;
      bottom: 12px;
      background-color: #ececee;
    }
    .itemJobMore,
    .itemProjectMore,
    .itemEduMore {
      display: none;
    }
    .item {
      position: relative;
      padding: 10px 0 10px 5px;
      &:after {
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
      &:last-child:after {
        display: none;
      }
      .others {
        color: #b4b4b6;
        font-size: 13px;
        .other {
          display: -webkit-box;
          overflow: hidden;
          .title {
            margin-left: -8px;
            width: 80px;
          }
          .content {
            padding-right: 70px;
          }
        }
      }
      .time {
        position: relative;
        font-size: 14px;
        margin-top: 2px;
        color: #3c95f9;
      }
      .time:before {
        position: absolute;
        left: -18px;
        top: 5px;
        content: '';
        width: 8px;
        height: 8px;
        background: #3c95f9;
        border-radius: 4px;
      }
      .company {
        font-size: 14px;
        color: #444;
        margin: 5px 0;
      }
      .description {
        color: #808080;
        font-size: 13px;
        margin-top: 6px;
        line-height: 24px;
        -webkit-transition: all 3s;
        margin-bottom: 30px;
        height: auto;
        white-space: pre-wrap;
        &.hide {
          height: 69px;
        }
      }
      .toggle {
        position: absolute;
        right: 0;
        bottom: 10px;
        font-size: 13px;
        margin-right: 5px;
        color: #3c95f9;
        &.show:before {
          border: none;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 10px solid #d8d8d8;
        }
        &:before {
          position: absolute;
          left: -19px;
          top: 5px;
          width: 0;
          height: 0;
          content: '';
          border: none;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 10px solid #d8d8d8;
        }
      }
    }
  }

  button {
    border-radius: 0;
    padding: 12px 0;
    height: 48px;
    margin: 0;
    font-size: 17px;
  }

  .shareWrapper {
    .title {
      background: #ececee;
      text-align: center;
      font-size: 14px;
      padding: 12px 0;
    }
    .more {
      background: #fff;
      padding: 10px;
      .single {
        width: 55px;
        height: 55px;
        margin: 0 10px;
        display: inline-block;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .noPublic {
    margin: 20px 0 0;
    background: #fff;
    text-align: center;
    font-size: 13px;
    color: #b4b4b6;
    padding-bottom: 30px;
    padding-top: 20px;
    .icon {
      font-size: 50px;
      color: #f3f4f6;
    }
  }

  #shareShowWrapper {
    position: absolute;
    right: 0;
    top: 0;
    .icon {
      color: #fff;
      position: absolute;
      right: 15px;
      top: 10px;
      font-size: 70px;
    }
  }

  .vueWrapper {
    padding-bottom: 48px;
  }

  .bottomButton {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 11;
  }

  .seeMoreWrapper {
    background: #fff;
    padding-bottom: 30px;
    margin-top: -2px;
    z-index: 5;
    position: relative;
    .seeMore {
      font-size: 14px;
      color: #3c95f9;
      text-align: center;
      padding: 9px 0 8px;
      background: #fff;
      border: 1px solid #dcdcdc;
      border-radius: 4px;
      margin: 0 20px;
    }
  }

  /***********评论和回复************/
  .news {
    width: 100%;
    height: 25px;
    padding: 0 10%;
    margin-top: 8px;

  }

  .news i {
    display: inline-block;
    float: left;
    width: 1px;
    height: 11px;
    border-right: 1px solid #c8c8c8;
    margin: 7px 8px 0 8px;
  }

  .news p {
    width: 46%;
    float: left;
    font-size: 12px;
    color: #808080;

  }

  .news p span {
    color: #e63964;
    font-weight: bold;
  }

  .news p:nth-of-type(1) {
    text-align: right;
  }

  .news p:nth-of-type(2) {
    text-align: left;
  }

  .resumeWrapper{
    bottom:48px;
  }
</style>
