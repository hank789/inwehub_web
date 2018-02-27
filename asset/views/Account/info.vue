<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的名片</h1>
    </header>

    <div class="mui-content absolute" v-show="!loading">

      <div class="info-professor">
        <div class="info-look" @tap.stop.prevent="$router.pushPlus('/my/resume','list-detail-page')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gongkai"></use>
          </svg>
          <span>预览</span>
        </div>
        <p @tap.stop.prevent="uploadAvatar()">
          <img :src="user.info.avatar_url" class="avatar"/>
          <span>
     		<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-xiangji"></use>
			</svg>
			</span>
        </p>
        <p>
          <span>{{ user.info.name }}</span>
          <svg class="icon" aria-hidden="true" v-if="user.info.is_expert =='1'">
            <use xlink:href="#icon-zhuanjiabiaoji"></use>
          </svg>
        </p>
        <p>
          <span>{{ user.info.company }}</span>
          <i></i>
          <span>{{ user.info.title }}</span>
        </p>
        <p>
          {{ user.info.mobile }}
				</p>
        <p>
          {{ user.info.email }}
				</p>
      </div>
      <p class="info-progresbar">
        <span class="info-progress"><i :style="'width:'+ user.info.account_info_complete_percent +'%'"></i></span>
        <span class="info-text">{{ user.info.account_info_complete_percent }}%</span>
        <svg class="icon" aria-hidden="true" id='confirmBtn' @tap.stop.prevent="warn()">
          <use xlink:href="#icon-jinggao"></use>
        </svg>
        <!--<span @tap.stop.prevent="$router.pushPlus('/my/info')">编辑名片</span>-->
      </p>
      <div class="part3">
        <ul class="mui-table-view mui-table-view-chevron firstItem">
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/basic')">基本资料
							<span class="desc important">{{ user.infos }}</span>
            </a>

          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/jobs')">工作经历

						</a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/projects')">项目经历

						</a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/edus')">教育经历

						</a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/trains')">培训认证

						</a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/privacy')"><span
              class="mui-icon myicon myicon-help"></span>隐私设置

						</a>
          </li>
        </ul>
      </div>

      <div class="paizhao">
        填写嫌麻烦，可发送简历到
                <a class="mailLink" href="mailto:hi@inwehub.com?subject=简历维护：用户姓名+注册手机号码" style="color: rgb( 3,174,249);">hi@inwehub.com</a> ,小哈帮您维护！

      </div>


    </div>
    <div id="statusBarStyle" background="#ffffff" mode="light"></div>

    <uploadHeader ref="uploadHeader"></uploadHeader>
  </div>
</template>

<script>
  import { USERS_APPEND } from '../../stores/types'
  import localEvent from '../../stores/localStorage'
  import { getUserInfo } from '../../utils/user'
  import uploadHeader from '../../components/uploadHeader.vue'

  export default {
    data: () => ({
      user: {
        info: {
          // name: '',
          // gender: '',
          // company: '',
          // title: '',
          // province: '',
          // city: '',
          // hometown_city: '',
          // hometown_province: '',
          // account_info_complete_percent: 0,
          // address_detail: '',
          // email: '',
          // birthday: '',
          // description: '',
          // industry_tags: [],
        }
      },
      loading: true,
      loading_gif: window.loading_gif
    }),
    created () {
      this.getUserInfo()
    },
    components: {
      uploadHeader
    },
    mounted () {
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        console.log('refresh-info')
        this.getUserInfo()
      })
    },
    methods: {
      refreshPageData () {
        this.getUserInfo()
      },
      // 警告框
      warn () {
        var font = '<p style="text-align: left; color: #444444; margin-bottom:0.533rem">' + '为保证每位用户信息都真实有效，请务必如实填写。如发现不实，首次将给予警告，第二次将永久封号。' + '</p>' +
          '<p style="text-align: left; color: #444444;">' + '平台对所有个人信息绝对保密，不会提供给任何第三方。' + '</p>'
        var title = '<p style="font-size:0.426rem; margin-bottom:0.4rem">' +
          '<svg class="icon" aria-hidden="true" style="font-size:0.48rem; color:#fcc816; margin-right:0.053rem; margin-bottom:-0.026rem">' +
          '<use xlink:href="#icon-jinggao"></use>' +
          '</svg>' +
          '警告说明 ' +
          '</p>'

        // var btnArray = ['取消', '确认']
        window.mui.confirm(font, title, function () {}, 'div')
      },
      warning: function () {
        window.mui.confirm("<div style='text-align: left'>InweHub是一个真实诚信的社区，每一位用户的信息都真实有效，我们保证对平台所有个人信息绝对保密，绝不会提供给任何第三方，平台中个人信息的开放范围完全取决于用户个性的设置，默认值为不开放。\n【注意】您填写个人信息时务必真实，如发现虚假信息，第一次将给予警告，第二次发现将永久封号。</div>", '警告说明', ['我已了解', '继续补充'], function () {}, 'div')
      },
      uploadAvatar: function () {
        this.$refs.uploadHeader.uploadAvatar()
      },
      getUserInfo () {
        this.$store.dispatch(USERS_APPEND, cb => getUserInfo(null, user => {
          cb(user)

          var newJobs = []
          for (var i in user.jobs) {
            var info = user.jobs[i]
            var id = info.id
            newJobs[id] = info
          }
          localEvent.setLocalItem('jobs', newJobs)

          var newProjects = []
          for (var projectIndex in user.projects) {
            var projectInfo = user.projects[projectIndex]
            var projectId = projectInfo.id
            newProjects[projectId] = projectInfo
          }
          localEvent.setLocalItem('projects', newProjects)

          var newEdus = []
          for (var eduIndex in user.edus) {
            var eduInfo = user.edus[eduIndex]
            var eduId = eduInfo.id
            newEdus[eduId] = eduInfo
          }
          localEvent.setLocalItem('edus', newEdus)

          var newTrains = []
          for (var trainIndex in user.trains) {
            var trainInfo = user.trains[trainIndex]
            var trainId = trainInfo.id
            newTrains[trainId] = info
          }
          localEvent.setLocalItem('trains', newTrains)

          this.work_city = user.info.province.name + ' ' + user.info.city.name
          this.home_city = user.info.hometown_province.name + ' ' + user.info.hometown_city.name

          this.user = user
          this.loading = 0
        }))
      }
    }
  }
</script>
<style scoped>
  .mui-content {
    background-color: #ffffff;
  }

  .mui-bar .myicon {
    width: 0.426rem;
    height: 0.426rem;
    right: 0.213rem;
    top: 0.213rem;
  }

  p,
  span {
    margin: 0;
    padding: 0;
  }

  .info-professor {
    width: 100%;
    padding: 0.533rem 0.4rem 0rem 0.426rem;
    background: #F3F4F6;
    text-align: center;
    position: relative;
  }

  .info-look {
    position: absolute;
    top: 0.533rem;
    right: 0.4rem;
  }

  .info-look svg {
    font-size: 0.64rem;
    color: rgb(3, 174, 249);
    margin-bottom: -0.053rem;
  }

  .info-look span {
    font-size: 0.373rem;
    color: #444444;
  }

  .info-professor p:nth-of-type(1) img {
    width: 1.84rem;
    height: 1.84rem;
    border-radius: 50%;
  }

  .info-professor p:nth-of-type(1) span {
    display: inline-block;
    width: 0.48rem;
    height: 0.48rem;
    border-radius: 50%;
    background: #FFFFFF;
    margin-left: -0.48rem;
    margin-bottom: 0.16rem;
    position: relative;
  }

  .info-professor p:nth-of-type(1) span svg {
    font-size: 0.666rem;
    color: #808080;
    position: absolute;
    left: -0.106rem;
    top: -0.08rem;
  }

  .info-professor p:nth-of-type(2) {
    margin-top: 0.16rem;
  }

  .info-professor p:nth-of-type(2) span {
    font-size: 0.426rem;
    font-weight: 600;
    color: #444444;
  }

  .info-professor p:nth-of-type(2) svg {
    font-size: 0.533rem;
    color: rgb(3, 174, 249);
    margin-bottom: -0.053rem;
  }

  .info-professor p:nth-of-type(3) {
    margin-top: 0.186rem;
  }

  .info-professor p:nth-of-type(3) span {
    font-size: 0.346rem;
    color: #444444;
  }

  .info-professor p:nth-of-type(3) i {
    display: inline-block;
    width: 0.026rem;
    height: 0.346rem;
    background: #c8c8c8;
    margin: 0 0.08rem -0.053rem 0.08rem;
  }

  .info-professor p:nth-of-type(4) {
    margin-top: 0.186rem;
  }

  .info-professor p:nth-of-type(5) {
    margin-top: 0.16rem;
  }

  .info-professor p:nth-of-type(4),
  .info-professor p:nth-of-type(5) {
    font-size: 0.373rem;
    color: #444444;
  }

  .info-progresbar {
    width: 100%;
    height: 1.333rem;
    padding: 0.266rem 0.453rem 0 0.426rem;
    background: #F3F4F6;
  }

  .info-progresbar svg {
    float: right;
    font-size: 0.4rem;
    color: #fcc816;
    margin-left: 0rem;
    margin-top: 0.106rem;
  }

  .info-progresbar .info-progress {
    display: inline-block;
    width: 80%;
    height: 0.32rem;
    border-radius: 1.333rem;
    overflow: hidden;
    border: 0.013rem solid rgb(3, 174, 249);
    margin-bottom: -0.053rem;
  }

  .info-progresbar .info-progress > i {
    display: inline-block;
    font-style: normal;
    margin-bottom: 0.213rem;
    margin-left: -0.373rem;
    height: 0.32rem;
    background: rgb(3, 174, 249);
  }

  .info-progresbar .info-text {
    font-size: 0.32rem;
    color: #808080;
  }

  .paizhao {
    width: 100%;
    height: 2.666rem;
    background: #FFFFFF;
    padding: 0.506rem 0.32rem 0 0.32rem;
    font-size: 0.32rem;
    color: rgb(128, 128, 128);
  }

  .part3 .desc {
    margin-left: 1.066rem;
    font-size: 0.32rem;
  }

  .part3 .important {
    color: #F6A623;
  }

  .info-choose {
    width: 100%;
    height: 2.533rem;
    background: #FFFFFF;
    position: absolute;
    bottom: 0;
    padding-top: 0.346rem;
    padding-left: 1.04rem;
    z-index: 999;
    display: none;
  }

  .info-choose p {
    width: 1.2rem;
    height: 1.893rem;
    float: left;
  }

  .info-choose p:nth-of-type(2) {
    margin-left: 0.96rem;
  }

  .info-choose p svg {
    font-size: 1.28rem;
    color: rgb(220, 220, 220);
  }

  .info-choose p span {
    display: block;
    margin-left: 0.266rem;
    margin-top: 0.053rem;
    color: #808080;
    font-size: 0.346rem;
  }

  #mui-popover-action {
    background: #FFFFFF;
  }

  .mui-table-view:after {
    position: absolute;
    right: 0.426rem;
    bottom: 0;
    left: 0.373rem;
    height: 0.026rem;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #F2F2F2;
  }

  .mui-table-view-cell:after {
    position: absolute;
    right: 0.426rem;
    bottom: 0;
    left: 0.4rem;
    height: 0.026rem;
    content: '';
  }

  .mui-table-view:before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 0.026rem;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #fff;
  }

  @media (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) {
    .part2 .progressBar {
      width: 4.266rem !important;
    }
  }

  @media (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) {
    .part2 .progressBar {
      width: 4.266rem !important;
    }
  }
</style>
