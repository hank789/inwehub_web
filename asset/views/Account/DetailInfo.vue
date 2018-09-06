<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">详细资料</h1>
    </header>

    <div class="mui-content detailInfoWrapper" v-show="!loading">
      <div class="cardWrapper">
        <div class="card">
          <div class="header">
            <div class="avatar">
              <div class="avatarInner">
                <img :src="resume.info.avatar_url" class="avatar"/>
                <div class="expert" v-if="resume.info.expert_apply_status =='2'">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zhuanjiabiaozhishixin"></use>
                  </svg>
                </div>
                <!--  -->
              </div>
            </div>
          </div>
          <div class="detail">
            <div class="realname">
              <span>{{ resume.info.name }}</span>
            </div>
            <div class="item">
              <div class="my-detail">
                <span>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-dingwei"></use>
                  </svg>{{ resume.info.province.name }} {{ resume.info.city.name }}
                </span>
              </div>
              <div class="my-detail">
                <span>{{resume.info.work_years}}年工作经验</span>
              </div>
              <div class="my-detail">
                <span>{{resume.info.company}}</span><i class="line-wall"></i><span>{{resume.info.title}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="gray"></div>

      <div class="skilled">
        <div class="skilledBrief">个人简介 <div class="bot"></div></div>
        <div class="synopsisContent">{{resume.info.description}}</div>
      </div>

      <template v-if="!isLogined">
        <div class="seeMoreWrapper">
          <div class="seeMore" @tap.stop.prevent="$router.pushPlus('/login')">查看所有工作经历</div></div>
        <div class="seeMoreWrapper">
          <div class="seeMore" @tap.stop.prevent="$router.pushPlus('/login')">查看所有项目经历</div></div>
        <div class="seeMoreWrapper">
          <div class="seeMore" @tap.stop.prevent="$router.pushPlus('/login')">查看所有教育经历</div></div>
      </template>
      <template v-else>
        <template v-if="percent < 90">
          <h5>工作经历</h5>
          <div class="component-warning">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zanwushuju"></use>
            </svg>
            <div class="title">您的信息不完整还不能查看哦</div>
            <div class="desc">查看对方经历会留下您的访问记录，完善您的头像、<br>个人资料(90%以上)会让对方更好的认识您！</div>
            <div class="component-button-empty" @tap.stop.prevent="$router.pushPlus('/my/info')"><span>去完善我的简历</span></div>
          </div>
        </template>
        <template v-else>
          <!--工作经历-->
          <h5 v-show="(resume.jobs.length) || (resume.info.is_job_info_public)">工作经历</h5>
          <div class="list" v-show="(resume.jobs.length) || (resume.info.is_job_info_public)">
            <div class="item" v-for="(job, jobIndex) in resume.jobs"
                 v-show="!(jobIndex >= 3 && !isShowItemJobMore)" :jobIndex="jobIndex">
              <div class="time">{{ job.begin_time }} ~ {{ job.end_time }}</div>
              <div class="company">{{ job.company }}<i class="separate"></i>{{ job.title }}</div>
              <div class="description  hide mui-ellipsis-3" v-show="job.description">{{ job.description }}


              </div>
              <div class="toggle show" @tap.stop.prevent="toggleDeatil" v-show="job.description">查看</div>
            </div>
          </div>
          <div class="seeMoreWrapper"
               v-show="(!resume.info.is_job_info_public && !this.cuuid) || (resume.jobs.length > 3)">
            <div class="seeMore" @tap.click.prevent="showJobMore($event)">查看所有工作经历</div>
          </div>

          <!--项目经历-->
          <h5 v-show="(resume.projects.length) || (resume.info.is_project_info_public)">项目经历</h5>
          <div class="list"
               v-show="(resume.projects.length) || (resume.info.is_project_info_public)">
            <div v-for="(project, projectIndex) in resume.projects" class="item" :projectIndex="projectIndex"
                 v-show="!(projectIndex >= 3 && !isShowProjectMore)">
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
               v-show="(!resume.info.is_project_info_public && !this.cuuid) || (resume.projects.length > 3)">
            <div class="seeMore" @tap.click.prevent="showProjectMore($event)">查看所有项目经历</div>
          </div>

          <!--教育经历-->
          <h5 v-show="(resume.edus.length) || (resume.info.is_edu_info_public)">教育经历</h5>
          <div class="list" v-show="(resume.edus.length) || (resume.info.is_edu_info_public)">
            <div class="item" v-for="(edu, eduIndex) in resume.edus"
                 v-show="!(eduIndex >= 3 && !isShowitemEduMore)" :eduIndex="eduIndex">
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
               v-show="(!resume.info.is_edu_info_public && !this.cuuid) || (resume.edus.length > 3)">
            <div class="seeMore" @tap.click.prevent="showEduMore($event)">查看所有教育经历</div>
          </div>

          <div class="noPublic"
               v-show="!loading && (!resume.info.is_edu_info_public || !resume.info.is_job_info_public ||  !resume.info.is_project_info_public) && !isSelf">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-bugongkai"></use>
            </svg>
            <div class="desc">部分信息暂未公开</div>
          </div>
        </template>
      </template>

    </div>

    <div class="buttonWrapper">

      <div class="edit" @tap.stop.prevent="$router.pushPlus('/my/info')" v-if="uuid === cuuid" v-show="!loading">继续编辑</div>

      <div class="consultWrapper" v-else v-show="!loading">
        <div class="buttonLeft" @tap.stop.prevent="goChat()">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-faxiaoxi"></use>
          </svg>
          发私信
        </div>
        <div class="buttonRight" @tap.stop.prevent="goAsk('/ask/'+uuid)">向他咨询</div>
      </div>
    </div>

  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import { getLocalUserInfo, getLocalUuid } from '../../utils/user'
  import userAbility from '../../utils/userAbility'
  import { isLogined } from '../../utils/auth'

  export default {
    data: () => ({
      isLogined: isLogined(),
      percent: 0,
      uuid: '',
      cuuid: '',
      loading: 1,
      isShowProjectMore: false,
      isShowItemJobMore: false,
      isShowitemEduMore: false,
      resume: {
        groups: [],
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

      }
    }),
    watch: {
      '$route' (to, from) {
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
    computed: {
      isSelf () {
        if (getLocalUuid() === this.$route.params.uuid) {
          return true
        }
        return false
      }
    },
    methods: {
      goChat () {
        userAbility.jumpToChat(this.resume.info.id, this)
      },
      getData: function () {
        const currentUser = getLocalUserInfo()

        this.uuid = this.$route.params.uuid
        this.cuuid = currentUser.uuid
        this.percent = currentUser.account_info_complete_percent

        if (!this.uuid) return

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
        })
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
      }
    }
  }
</script>

<style scoped lang="less">
  .bot {
    position: absolute;
    right: 0.373rem;
    bottom: 0;
    left: 0.373rem;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
    /*border: 0.026rem solid #dcdcdc;*/
  }
  .detailInfoWrapper {
    bottom: 1.28rem;
    /*background: #FFFFFF;*/
  }
  .cardWrapper {
    padding: 0 0.426rem;
    width: 100%;
    background-color: #FFFFFF;
    .card {
      border-radius: 0.106rem;
      width: 100%;
      position: relative;
      padding-bottom: 0.4rem;
      padding-top: 0.4rem;
      .erweima {
        width: 1.466rem;
        height: 1.36rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .header {
        height: 1.68rem;
        .expert {
          position: absolute;
          right: 0;
          bottom: 0;
          z-index: 10;
          .icon {
            font-size: 0.64rem;
            color: #FCC816;
            border: 0.053rem solid #FFF;
            border-radius: 50%;
            background: #FFF;
          }
        }
        .avatar {
          position: absolute;
          left: 50%;
          margin-left: -0.8rem;
          z-index: 9;
          color: #ffffff;
          display: inline-block;
          height: 1.573rem;
          width: 1.573rem;
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
          position: relative;
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
        margin-top: 0.173rem;
        text-align: center;
        .realname {
          font-weight: bold;
          span {
            &:nth-of-type(1) {
              position: relative;
              right: -0.08rem;
              color: #444444;
              font-size: 0.48rem;
            }
          }
          .icon {
            vertical-align: bottom;
            font-size: 0.586rem;
            color: #3c95f9;
          }
        }
        .item {
          color: #808080;
          font-size: 0.346rem;
          margin: 0.346rem 0.186rem 0rem 0.186rem;
          .icon {
            color: #b4b4b6;
            font-size: 0.426rem;
          }
          .my-detail {
            width: 100%;
            height: 0.8rem;
            span {
              font-size: 0.346rem;
              color: #444444;
              .icon {
                color: #B4B4B6;
              }
            }
            .line-wall {
              margin: 0 0.266rem;
              background-color: #C8C8C8;
            }
          }
        }
      }
    }
  }
  .skilled {
    padding: 0.32rem 0.373rem 0.266rem 0.373rem;
    overflow: hidden;
    position: relative;
    background-color: #FFFFFF;
    .skilledBrief {
      .bot {
        left: 0;
        right: 0;
      }
      position: relative;
      color: #808080;
      font-size: 0.373rem;
      padding-bottom: 0.213rem;
      margin-bottom: 0.32rem;
    }
    .synopsisContent {
      color: #444444;
      font-size: 0.346rem;
      line-height: 0.666rem;
    }
  }

  // 个人简历
  .separate {
    display: inline-block;
    height: 0.266rem;
    margin: 0 0.213rem;
    border-left: 0.026rem solid #c8c8c8;
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
  .seeMoreWrapper {
    background: #fff;
    padding-bottom: 0.8rem;
    margin-top: -0.053rem;
    z-index: 5;
    position: relative;
    .seeMore {
      font-size: 0.373rem;
      color: #03AEF9;
      text-align: center;
      padding: 0.24rem 0 0.213rem;
      background: #fff;
      border: 0.026rem solid #dcdcdc;
      border-radius: 0.106rem;
      margin: 0 0.533rem;
    }
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
        color: #03AEF9;
      }
      .time:before {
        position: absolute;
        left: -0.48rem;
        top: 0.133rem;
        content: '';
        width: 0.213rem;
        height: 0.213rem;
        background: #03AEF9;
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
        color: #03AEF9;
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

  .buttonWrapper {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1.333rem;
    overflow: hidden;
    background: #FFFFFF;
    &:before {
      position: absolute;
      top: 0;
      width: 100%;
      height: .02667rem;
      content: '';
      transform: scaleY(0.5);
      background-color: #dcdcdc;
    }
    .edit {
      width: 9.146rem;
      height: 0.96rem;
      color: #ffffff;
      font-size: 0.426rem;
      line-height: 0.96rem;
      text-align: center;
      border-radius: 0.213rem;
      background: #03AEF9;
      margin: 0.213rem auto 0;
    }
    .consultWrapper {
      div {
        margin-top: 0.173rem;
      }
      .buttonLeft {
        float: left;
        width: 25%;
        color: #B4B4B6;
        font-size: 0.266rem;
        text-align: center;
        .icon {
          color: #808080;
          font-size: 0.533rem;
          text-align: center;
          display: block;
          margin-left: 0.986rem;
        }
      }
      .buttonRight {
        float: right;
        width: 7.066rem;
        height: 0.96rem;
        color: #ffffff;
        margin-right: 0.426rem;
        line-height: 0.96rem;
        text-align: center;
        border-radius: 0.213rem;
        background: #03AEF9;
      }
    }
  }
</style>
