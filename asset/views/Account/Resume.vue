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
        <div class="qRCode qRCode-resume">
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
            <!--关注-->
            <div class="collect" v-show="uuid !== cuuid && !resume.is_followed" @tap.stop.prevent="collectProfessor">
              关注Ta
            </div>
            <div class="collect active" @tap.stop.prevent="collectProfessor"
                 v-show="uuid !== cuuid && resume.is_followed">
              已关注

            </div>
            <!--名片-->
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
              <!--关注 被赞 综合评分-->
              <div class="counter">
                <span @tap.stop.prevent="$router.pushPlus('/my/focus/'+uuid)">关注Ta</span> <b @tap.stop.prevent="$router.pushPlus('/my/focus/'+uuid)">{{ resume.info.followers }}</b>
                <i class="separate"></i>
                <span>被赞</span>  <b>{{ resume.info.supports }}</b>
                <!--<i class="separate"></i>评价<b>{{ resume.info.feedbacks }}</b>次-->
                <i class="separate"></i>{{ resume.info.total_score }}

              </div>
            </div>
          </div>
        </div>
        <!--Ta的擅长-->
        <div class="skilled">
          <p>Ta的擅长</p>
          <template v-for="(industry, index) in resume.info.skill_tags">
            <span @tap.stop.prevent="toTagDetail(industry.text)">{{industry.text}}</span>
          </template>
          <i class="bot"></i>
        </div>
        <!--发布-->
        <div class="news">
          <div>Ta的发布</div>
          <p class="mui-ellipsis" @tap.stop.prevent="$router.pushPlus('/my/publishAnswers/'+uuid)">
            回答 <span>{{ resume.info.answers }}</span>
          </p>
          <a></a>
          <p class="mui-ellipsis"  @tap.stop.prevent="$router.pushPlus('/my/publishQuestions/'+uuid)">
            提问 <span>{{ resume.info.questions }}</span>
          </p>
          <a></a>
          <p class="mui-ellipsis"  @tap.stop.prevent="$router.pushPlus('/my/publishArticle/'+uuid)">
            分享 <span>{{ resume.info.submission_count }}</span>
          </p>
          <a></a>
          <p class="mui-ellipsis" @tap.stop.prevent="$router.pushPlus('/my/publishComment/'+uuid)">
            评论 <span>{{ resume.info.comment_count }}</span>
          </p>
          <i class="bot"></i>
        </div>
        <!--个人动态-->
        <div class="dynamic" @tap.stop.prevent="$router.pushPlus('/dynamic/list?id=' + resume.info.uuid )">
          <p>Ta的动态 <i>{{ resume.info.feed_count }}</i></p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
          <i class="bot"></i>
        </div>
        <!--Ta的专栏-->
        <div class="specialColumn" @tap.stop.prevent="$router.pushPlus('/article/list?id=' + resume.info.uuid )">
          <p>Ta的专栏 </p>
          <p>文章<span>{{ resume.info.article_count }}</span><i></i></p>
          <p>评论<span>{{ resume.info.article_comment_count }}</span><i></i></p>
          <p>赞{{ resume.info.article_upvote_count }}  </p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-chakangengduojiantou"></use>
          </svg>
        </div>
        <!--grey-->
        <div class="grey"></div>
        <!--个人简介-->
        <div class="description">
          <p>个人简介</p>
          <div class="mui-ellipsis-3">{{ resume.info.description }}</div>
        </div>

      </div>
      <!--工作经历-->
      <h5 v-show="(resume.jobs.length && !isShare) || (isShare && resume.info.is_job_info_public)">工作经历</h5>
      <div class="list" v-show="(resume.jobs.length && !isShare) || (isShare && resume.info.is_job_info_public)">
        <div class="item" v-for="(job, jobIndex) in resume.jobs"
             v-show="!(isShare && jobIndex >= 3 && !isShowItemJobMore)" :jobIndex="jobIndex">
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
      <div class="list"
           v-show="(resume.projects.length && !isShare) || (isShare && resume.info.is_project_info_public)">
        <div v-for="(project, projectIndex) in resume.projects" class="item" :projectIndex="projectIndex"
             v-show="!(isShare && projectIndex >= 3 && !isShowProjectMore)">
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
        <div class="item" v-for="(edu, eduIndex) in resume.edus"
             v-show="!(isShare && eduIndex >= 3 && !isShowitemEduMore)" :eduIndex="eduIndex">
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

    <Share :title="shareOptions.title"
           :shareName="shareOptions.shareName"
           :link="shareUrl"
           :hideShareBtn="true"
           :content="shareOptions.content"
           :imageUrl="shareOptions.imageUrl"
           :thumbUrl="shareOptions.thumbUrl"
           :targetId="uuid"
           :targetType="'resume'"
           ref="shareComponent"></Share>

    <button type="button" class="bottomButton mui-btn mui-btn-block mui-btn-primary"
            @tap.stop.prevent="$router.pushPlus('/my/info')" v-if="!isShare || uuid === cuuid" v-show="!loading">继续编辑


    </button>
    <!--<button type="button" class="bottomButton mui-btn mui-btn-block mui-btn-primary"-->
            <!--@tap.stop.prevent="goAsk('/ask?id='+uuid)" v-else v-show="!loading">向Ta咨询-->


    <!--</button>-->
    <div class="bottomButton btn" v-else v-show="!loading">
      <p @tap.stop.prevent="goChat()">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-faxiaoxi"></use>
        </svg>
        发私信
      </p>
      <p @tap.stop.prevent="goAsk('/ask?id='+uuid)">向Ta咨询</p>
    </div>

  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import Share from '../../components/Share.vue'
  import { alertChat } from '../../utils/dialogList'
  import { getLocalUserInfo } from '../../utils/user'
  import userAbility from '../../utils/userAbility'
  import { getResumeDetail } from '../../utils/shareTemplate'
  const currentUser = getLocalUserInfo()

  export default {
    data: () => ({
      shareOptions: {
        shareName: '',
        title: '',
        content: '',
        imageUrl: '',
        thumbUrl: ''
      },
      im_tokenMsg: '',
      percent: currentUser.account_info_complete_percent,
      uuid: currentUser.uuid,
      cuuid: currentUser.uuid,
      showQrCode: false,
      isShare: false,
      canBack: false,
      loading: true,
      shareUrl: '',
      wechatConfig: {},
      downloadHeader: false,
      isShowProjectMore: false,
      isShowItemJobMore: false,
      isShowitemEduMore: false,
      resume: {
        info: {
          uuid: '',
          name: '',
          avatar_url: '',
          feed_count: '',
          article_count: '',
          article_comment_count: '',
          article_upvote_count: '',
          industry_tags: [],
          province: {
            key: '',
            name: ''
          },
          city: {
            key: '',
            name: ''
          }
        },
        edus: [],
        projects: [],
        jobs: []

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
        this.getData()
      }
    },
    created () {
      this.getData()
    },
    mounted () {
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        console.log('refresh-resume')
        this.getData()
      })
    },
    methods: {
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      goChat () {
        if (this.percent >= 90) {
          this.$router.pushPlus('/chat/' + this.resume.info.id)
        } else {
          alertChat(this)
        }
      },
      share: function () {
        this.$refs.shareComponent.share()
      },
      getData: function () {
        // 获取本地的百分比
        const currentUser = getLocalUserInfo()
        this.percent = currentUser.account_info_complete_percent
        if (this.$route.query.goback) {
          this.canBack = true
        }
        var from = this.$router.currentRoute.name
        // var fullUrl = process.env.H5_ROOT

        if (from === 'share-resume' || from === 'share-resume-old') {
          this.isShare = true
          this.uuid = this.$route.query.id || this.$route.params.id
        }

        postRequest(`profile/resumeInfo`, {
          uuid: this.uuid
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          this.resume = response.data.data
          this.loading = 0
          this.bindWechatShare()
        })
      },
      collectProfessor: function () {
        if (!this.cuuid) {
          window.location.href = process.env.API_ROOT + 'wechat/oauth?redirect=/home'
          return
        }

        postRequest(`follow/user`, {
          id: this.uuid
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }
          this.resume.is_followed = !this.resume.is_followed
          window.mui.toast(response.data.data.tip)
        })
      },
      downLoadHeader () {
        var that = this
        var dtask = window.plus.downloader.createDownload(this.resume.info.avatar_url, {
          filename: '_downloads/resume.png'
        }, function (d, status) {
          if (status === 200) {
            // 下载成功
            console.log('下载成功:' + d.filename)
            console.debug(d)
            that.downloadHeader = true
          } else {
            console.log('下载失败')
          }
        })
        // 启动下载任务
        dtask.start()
      },
      bindWechatShare () {
        var shareOptions = getResumeDetail(
          this.uuid,
          this.resume.info.name,
          this.resume.info.company,
          this.resume.info.avatar_url
        )
        this.shareOptions.title = shareOptions.title
        this.shareOptions.content = shareOptions.content
        this.shareOptions.imageUrl = shareOptions.imageUrl
        this.shareOptions.thumbUrl = shareOptions.thumbUrl
        this.shareOptions.shareName = shareOptions.shareName
        this.shareUrl = shareOptions.link
      },
      showJobMore (event) {
        if (!this.cuuid) {
          window.location.href = process.env.API_ROOT + 'wechat/oauth?redirect=/home'
          return
        }

        this.isShowItemJobMore = true
        event.target.style.display = 'none'
      },
      showProjectMore (event) {
        if (!this.cuuid) {
          window.location.href = process.env.API_ROOT + 'wechat/oauth?redirect=/home'
          return
        }

        this.isShowProjectMore = true

        event.target.style.display = 'none'
      },
      showEduMore (event) {
        if (!this.cuuid) {
          window.location.href = process.env.API_ROOT + 'wechat/oauth?redirect=/home'
          return
        }

        this.isShowitemEduMore = true
        event.target.style.display = 'none'
      },
      goAsk (url) {
        if (!this.resume.info.is_expert) {
          window.mui.alert('Ta还不是平台专家，暂时还不能向Ta咨询！')
          return
        }

        if (this.uuid === this.cuuid) {
          window.mui.alert('不能向自己提问！')
          return
        }

        if (window.mui.os.wechat) {
          window.location.href = process.env.API_ROOT + 'wechat/oauth?redirect=' + url
        } else {
          this.$router.push(url)
        }

        return
      },
      toggleShareNav () {
        window.mui('#shareShowWrapper').popover('toggle')
      },
      toggleDeatil (event) {
        var Desc = event.target.previousSibling.previousSibling
        if (/hide/.test(Desc.className)) {
          Desc.className = Desc.className.replace(' hide', '')
          Desc.className = Desc.className.replace(' mui-ellipsis-3', '')
          Desc.className += ' show'

          event.target.className = 'toggle hide'
          event.target.innerText = '收起'
        } else {
          Desc.className = Desc.className.replace(' show', '')
          Desc.className += ' hide mui-ellipsis-3'

          event.target.className = 'toggle show'
          event.target.innerText = '查看'
        }
      },
      toggleQrCode () {
        this.showQrCode = !this.showQrCode
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .bot {
    position: absolute;
    right: 0.373rem;
    bottom: 0;
    left: 0.373rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    /*background-color: rgb(220, 220, 220);*/
    border: 0.026rem dashed #dcdcdc;
  }

  /***************清除自带样式*****************/

  div,
  p,
  span,
  ul,
  li,
  i,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }

  .professor {
    background-color: #3c3e44;
    text-align: center;
    position: relative;
    height: 2.08rem;
  }

  .erweimaWrapper {
    position: absolute;
    left: 0.426rem;
    background: #444;
    margin-top: 0.213rem;
    width: 81%;
    border-radius: 0.106rem;
    z-index: 77;
    text-align: center;
    padding-bottom: 0.48rem;
    .header {
      position: relative;
      height: 2.453rem;
      .avatar {
        position: absolute;
        left: 50%;
        margin-top: 0.4rem;
        margin-left: -0.92rem;
        z-index: 9;
        color: #ffffff;
        display: inline-block;
        height: 1.84rem;
        width: 1.84rem;
        font-size: 0.533rem;
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
      margin-top: 0.533rem;
      color: #fff;
      font-size: 0.373rem;
      font-weight: bold;
      span {
        position: relative;
        right: -0.08rem;
      }
      .icon {
        vertical-align: top;
        font-size: 0.533rem;
        color: #3c95f9;
      }
    }
    .erweimaSplite {
      margin-top: -0.8rem;
      span {
        display: inline-block;
        width: 1.653rem;
        margin: 0 0.08rem;
        border-bottom: 0.026rem solid #808080;
      }
      .icon {
        color: #252525;
        font-size: 1.333rem;
        position: relative;
        top: 0.453rem;
      }
    }
    .qRCode {
      margin-top: 0.266rem;
      position: relative;
      text-align: center;
      height: 5.066rem;
      div {
        position: absolute;
        left: 50%;
        margin-left: -2.533rem;
        width: 5.066rem;
        height: 5.066rem;
        border-radius: 0.106rem;
        background: #fff;
        padding: 0.266rem;
        img {
          width: 4.533rem;
          height: 4.533rem;
          margin-top: 0.266rem !important;
          border-radius: 0.106rem;
        }
      }
    }
    .qRhelp {
      margin-top: 0.213rem;
      text-align: center;
      color: #fff;
      font-size: 0.346rem;
    }
  }

  /*个人简历*/
  .basic {
    background: #fff;
    .description {
      font-size: 0.373rem;
      color: #808080;
      padding: 0.293rem 0.373rem 0.346rem;
      line-height: 0.64rem;
      div {
        display: block;
        font-size: 0.346rem;
        color: #444444;
        line-height: 0.666rem;
      }
    }
  }

  .separate {
    display: inline-block;
    height: 0.266rem;
    margin: 0 0.213rem;
    border-left: 0.026rem solid #c8c8c8;
  }

  .cardWrapper {
    margin-top: -1.84rem;
    padding: 0 0.426rem;
    width: 100%;
    .card {
      border-radius: 0.106rem;
      background: #ececee;
      width: 100%;
      position: relative;
      padding-bottom: 0.4rem;
      .erweima {
        width: 1.466rem;
        height: 1.36rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      /*关注*/
      .collect {
        position: absolute;
        font-size: 0.373rem;
        right: 1.466rem;
        top: 0.373rem;
        color: #444444;
        border: 0.026rem solid #b4b4b6;
        border-radius: 1.333rem;
        padding: 0.053rem 0.213rem;
        &.active {
          color: #FFFFFF;
          border: 0.026rem solid #03aef9;
          background: #03aef9;
        }
      }
      /*名片*/
      .Card {
        position: absolute;
        right: 1.466rem;
        top: 1.44rem;
        border: 0.026rem solid #b4b4b6;
        border-radius: 1.333rem;
        padding: 0.053rem 0.426rem;
        color: #444444;
        font-size: 0.373rem;

      }
      .share {
        position: absolute;
        font-size: 0.64rem;
        right: 0.506rem;
        top: 0.373rem;
        color: #808080;
      }
      .header {
        height: 2.453rem;
        margin-top: -0.533rem;
        .avatar {
          position: absolute;
          left: 50%;
          margin-left: -1.226rem;
          z-index: 9;
          color: #ffffff;
          display: inline-block;
          height: 2.453rem;
          width: 2.453rem;
          font-size: 0.533rem;
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
        margin-top: 0.266rem;
        text-align: center;
        .realname {
          font-weight: bold;
          span {
            position: relative;
            right: -0.08rem;
          }
          .icon {
            vertical-align: bottom;
            font-size: 0.586rem;
            color: #3c95f9;
          }
        }
        .counter {
          width: 91%;
          margin-left: 4.5%;
          padding-top: 0.32rem;
          margin-top: 0.32rem;
          border-top: 0.026rem dashed #dcdcdc;
          font-size: 0.346rem;
          color: #444444;
          b {
            color:rgb(250,73,117);
          }

        }
        .item {
          color: #808080;
          font-size: 0.346rem;
          margin: 0.186rem 0.186rem 0.053rem 0.186rem;
          .icon {
            color: #b4b4b6;
            font-size: 0.426rem;
          }
          &.industry span {
            border: 0.026rem solid #c8c8c8;
            display: inline-block;
            border-radius: 1.333rem;
            color: #808080;
            font-size: 0.32rem;
            padding: 0 0.186rem;
            margin: 0 0.053rem 0.213rem;
          }
        }
      }
    }
  }

  h5 {
    margin: 0;
    padding: 0.293rem 0;
    background: #f3f4f6;
    width: 100%;
    font-size: 0.373rem;
    color: #313131;
    text-align: center;
  }

  .list {
    background: #fff;
    padding: 0 0.266rem 0 0.8rem;
    position: relative;
    &:before {
      position: absolute;
      top: 0.533rem;
      left: 0.533rem;
      content: '';
      width: 0.026rem;
      bottom: 0.32rem;
      background-color: #ececee;
    }
    .itemJobMore,
    .itemProjectMore,
    .itemEduMore {
      display: none;
    }
    .item {
      position: relative;
      padding: 0.266rem 0 0.266rem 0.133rem;
      &:after {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        height: 0.026rem;
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
        font-size: 0.346rem;
        .other {
          display: -webkit-box;
          overflow: hidden;
          .title {
            margin-left: -0.213rem;
            width: 2.133rem;
          }
          .content {
            padding-right: 1.866rem;
          }
        }
      }
      .time {
        position: relative;
        font-size: 0.373rem;
        margin-top: 0.053rem;
        color: #3c95f9;
      }
      .time:before {
        position: absolute;
        left: -0.48rem;
        top: 0.133rem;
        content: '';
        width: 0.213rem;
        height: 0.213rem;
        background: #3c95f9;
        border-radius: 0.106rem;
      }
      .company {
        font-size: 0.373rem;
        color: #444;
        margin: 0.133rem 0;
      }
      .description {
        color: #808080;
        font-size: 0.346rem;
        margin-top: 0.16rem;
        line-height: 0.64rem;
        -webkit-transition: all 3s;
        margin-bottom: 0.8rem;
        height: auto;
        white-space: pre-wrap;
        &.hide {
          height: 1.84rem;
        }
      }
      .toggle {
        position: absolute;
        right: 0;
        bottom: 0.266rem;
        font-size: 0.346rem;
        margin-right: 0.133rem;
        color: #3c95f9;
        &.show:before {
          border: none;
          border-left: 0.16rem solid transparent;
          border-right: 0.16rem solid transparent;
          border-top: 0.266rem solid #d8d8d8;
        }
        &:before {
          position: absolute;
          left: -0.506rem;
          top: 0.133rem;
          width: 0;
          height: 0;
          content: '';
          border: none;
          border-left: 0.16rem solid transparent;
          border-right: 0.16rem solid transparent;
          border-bottom: 0.266rem solid #d8d8d8;
        }
      }
    }
  }

  button {
    border-radius: 0;
    padding: 0.32rem 0;
    height: 1.28rem;
    margin: 0;
    font-size: 0.453rem;
  }

  .shareWrapper {
    .title {
      background: #ececee;
      text-align: center;
      font-size: 0.373rem;
      padding: 0.32rem 0;
    }
    .more {
      background: #fff;
      padding: 0.266rem;
      .single {
        width: 1.466rem;
        height: 1.466rem;
        margin: 0 0.266rem;
        display: inline-block;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .noPublic {
    margin: 0.533rem 0 0;
    background: #fff;
    text-align: center;
    font-size: 0.346rem;
    color: #b4b4b6;
    padding-bottom: 0.8rem;
    padding-top: 0.533rem;
    .icon {
      font-size: 1.333rem;
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
      right: 0.4rem;
      top: 0.266rem;
      font-size: 1.866rem;
    }
  }

  .vueWrapper {
    padding-bottom: 1.28rem;
  }

  .bottomButton {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 11;
  }

  .seeMoreWrapper {
    background: #fff;
    padding-bottom: 0.8rem;
    margin-top: -0.053rem;
    z-index: 5;
    position: relative;
    .seeMore {
      font-size: 0.373rem;
      color: #3c95f9;
      text-align: center;
      padding: 0.24rem 0 0.213rem;
      background: #fff;
      border: 0.026rem solid #dcdcdc;
      border-radius: 0.106rem;
      margin: 0 0.533rem;
    }
  }

  /***********评论和回复************/

  .news {
    padding: 0.32rem 0.373rem;
    overflow: hidden;
    position: relative;
  }

  .news div {
    font-size: 0.373rem;
    color: #808080;
    margin-bottom: 0.213rem;
  }

  .news a {
    display: inline-block;
    float: left;
    width: 0.026rem;
    height: 0.293rem;
    border-right: 0.026rem solid #c8c8c8;
    margin: 0.133rem 0.586rem 0 0.586rem;
  }

  .news p {
    float: left;
    font-size: 0.32rem;
    color: #808080;
    text-align: center;
  }

  .news p:nth-of-type(1) {
    text-align: left;
  }

  .news p span {
    font-size: 0.373rem;
    color: #444444;
    font-weight: 500;
  }

  /*.news p:nth-of-type(1) {
    text-align: right;
  }

  .news p:nth-of-type(2) {
    text-align: left;
  }*/

  .resumeWrapper {
    bottom: 1.28rem;
  }

  /*动态*/
  .dynamic {
    overflow: hidden;
    padding: 0.32rem 0.373rem;
    position: relative;
    p {
      float: left;
      font-size: 0.373rem;
      color: #808080;
      i{
        font-weight: 500;
        color:#444444;
      }
    }
    svg {
      float: right;
      font-size: 0.4rem;
      color: #808080;
    }
  }
   /*Ta的专栏*/
  .specialColumn{
    overflow: hidden;
    padding: 0.32rem 0.373rem;
    position: relative;
  }
  .specialColumn p {
    float: left;
    font-size:0.32rem;
    color: #b4b4b6;

  }
  .specialColumn p span{
    color: rgb(128,128,128);
  }
  .specialColumn p i{
    display: inline-block;
    width:0.026rem;
    height:0.266rem;
    background:#c8c8c8;
    margin:0  0.133rem -0.026rem 0.133rem;

  }
  .specialColumn svg{
    float: right;
    font-size: 0.4rem;
    color: #808080;
  }
  .specialColumn p:nth-of-type(1){
     font-size:0.373rem;
     color: #808080;
     margin-right: 0.133rem;
  }

  /*擅长*/
  .skilled {
    padding: 0.32rem 0.373rem 0.453rem 0.373rem;
    overflow: hidden;
    position: relative;

  }

  .skilled span {
    float: left;
    background: #ececee;
    border-radius: 1.333rem;
    padding: 0.106rem 0.293rem;
    font-size: 0.32rem;
    color: #444444;
    margin-left:0.213rem;
    margin-bottom: 0.16rem;
  }

  /*.skilled span:nth-of-type(1) {*/
    /*margin-left: 0rem;*/
  /*}*/

  .skilled p {
    font-size: 0.373rem;
    color: #808080;
    margin-bottom: 0.32rem;
  }
  /*向他咨询*/
  .btn{
    border-top:0.026rem solid #dcdcdc;
    width:100%;
    height:1.306rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .btn P{
    height:100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .btn P:nth-of-type(1){
    width:32%;
    background:#f3f4f6;
    font-size:0.373rem;
    color: #444444;

  }
  .btn P:nth-of-type(1) svg{
    font-size: 0.453rem;
    color: #808080;
    margin-right: 0.106rem;
    margin-top: -0.053rem;
  }
  .btn P:nth-of-type(2){
    width:68%;
    background:#03aef9;
    font-size:0.453rem;
    color: #ffffff;
  }
  .grey{
    width:100%;
    height:0.266rem;
    background: #F3F4F5;
  }
</style>
