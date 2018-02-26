<template>
  <div>
    <div class="mui-content" v-if="!loading">
      <div class="projectPreviewCard">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <div class="header">
          <div class="avatar">
            <div class="avatarInner"><img class="avatar" :src="avatar_url">
            </div>
          </div>
        </div>
        <div class="title">{{ info.project_name }}</div>
        <div class="titleSub">{{ info.company_represent_person_name }}<i class="separate"></i>{{info.company_name}}
        </div>
        <div class="state">{{ project_stage_text }}</div>
      </div>
      <div class="section">
        <h5>项目简介</h5>
        <div class="contentWrapper">
          <div class="item">
            <div class="title">项目类型：</div>
            <div class="content">{{ project_type_text }}</div>
          </div>
          <div class="item">
            <div class="title">项目描述：</div>
            <div class="content hide mui-ellipsis-3">{{ info.project_description }}</div>
          </div>
          <div class="toggle show" @tap.stop.prevent="toggleDeatil" v-if="info.project_description.length > 50"></div>
          <div class="item">
            <div class="title">上传附件：</div>
            <div class="content files">
              <img v-if="info.images.length === 0" width="58" height="58"/>
              <img v-for="(image, index) in info.images" width="58" height="58"
                   :src="image"/>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <h5>具体需求</h5>
        <div class="contentWrapper">
          <div class="nav">
            <div class="navWrapper mui-row">
              <div class="mui-col-sm-6 mui-col-xs-6" @tap.stop.prevent="goSubmitRequirement()">
                <div class="row1">{{ info.project_amount }}万</div>
                <div class="row2">项目预算<span>（包含差旅费）</span></div>
              </div>
              <div class="line"></div>
              <div class="mui-col-sm-6 mui-col-xs-6" @tap.stop.prevent="goRequirement()">
                <div class="row1">{{ info && info.project_begin_time && info.project_begin_time.replace(/-/g, '/') }}
                </div>
                <div class="row2">项目开始时间</div>
              </div>
            </div>
          </div>
          <table>
            <tr>
              <td class="tdTitle" width="70">顾问数量：</td>
              <td class="tdContent" width="101">{{ worker_num_text }}</td>
              <td class="tdTitle" width="70">项目周期：</td>
              <td class="tdContent">{{ project_cycle_text }}</td>
            </tr>
            <tr>
              <td class="tdTitle">计费模式：</td>
              <td class="tdContent">{{ billing_mode_text }}</td>
              <td class="tdTitle">工作密度：</td>
              <td class="tdContent">{{ work_intensity_text }}</td>
            </tr>
            <tr>
              <td class="tdTitle">顾问级别：</td>
              <td class="tdContent">{{ worker_level_text }}</td>
              <td class="tdTitle">远程工作：</td>
              <td class="tdContent">{{ remote_work_text }}</td>
            </tr>
            <tr>
              <td class="tdTitle">工作地点：</td>
              <td class="tdContent" colspan="3">{{ work_address_text }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="section">
        <h5>企业信息</h5>
        <div class="contentWrapper">
          <div class="item">
            <div class="title">企业名称：</div>
            <div class="content">{{info.company_name}}</div>
          </div>
          <div class="selectedWrapper"><span class="selected"
                                             v-for="(industry, index) in info.company_industry_tags">{{industry.text}}</span>
          </div>
          <div class="description">
            {{ info.company_description }}

          </div>
          <div class="item">
            <div class="title">项目对接：</div>
            <div class="content">
              {{ info.company_represent_person_is_self ? '发布者本人' : '其他人'}}（{{ info.company_represent_person_name }}）
            </div>
          </div>
          <div class="item">
            <div class="title">对接职位：</div>
            <div class="content">{{ info.company_represent_person_title }}</div>
          </div>
          <div class="item">
            <div class="title">对接手机：</div>
            <div class="content">{{ info.company_represent_person_phone }}</div>
          </div>
          <div class="item">
            <div class="title">对接邮箱：</div>
            <div class="content">{{ info.company_represent_person_email }}</div>
          </div>
          <div class="item" v-show="info.company_billing_title">
            <div class="title">开票抬头：</div>
            <div class="content colorC8">{{ info.company_billing_title}}</div>
          </div>
          <div class="item" v-show="info.company_billing_bank">
            <div class="title">开户银行：</div>
            <div class="content colorC8">{{ info.company_billing_bank }}</div>
          </div>
          <div class="item" v-show="info.company_billing_account">
            <div class="title">开户账户：</div>
            <div class="content colorC8">{{ info.company_billing_account }}</div>
          </div>
          <div class="item" v-show="info.company_billing_taxes">
            <div class="title">纳税识别号：</div>
            <div class="content content-5 colorC8">{{ info.company_billing_taxes }}</div>
          </div>
        </div>
      </div>
      <div class="section">
        <h5>需求偏好</h5>
        <div class="contentWrapper">
          <div class="requirement">
            <template v-if="info.is_view_resume">
              <svg class="icon one" aria-hidden="true">
                <use xlink:href="#icon-gongkai"></use>
              </svg>
              需要查看顾问简历

            </template>

            <template v-if="info.is_apply_request">
              <svg class="icon two" aria-hidden="true">
                <use xlink:href="#icon-xuyaoguwentoudishenqing"></use>
              </svg>
              需要顾问投递申请

            </template>

          </div>
          <div class="item" v-if="info.qualification_requirements && info.qualification_requirements.length">
            <div class="title">资质要求</div>
            <div class="content">
              <div class="li" v-for="(qualification_requirement, index) in info.qualification_requirements">
                {{ qualification_requirement }}
              </div>
            </div>
          </div>
          <div class="item" v-if="info.other_requirements && info.other_requirements.length">
            <div class="title">其他条件</div>
            <div class="content">
              <div class="li" v-for="(other_requirement, index) in info.other_requirements">{{ other_requirement }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import localEvent from '../../stores/localStorage'
  import { options } from '../../utils/project'

  export default {
    data () {
      var userInfo = localEvent.getLocalItem('UserInfo')
      return {
        project_id: null,
        avatar_url: userInfo.avatar_url,
        info: {
          project_description: '',
          images: [],
          project_begin_time: ''
        },
        loading: 1
      }
    },
    computed: {
      project_stage_text () {
        return options.project_stage_text(this.info.project_stage)
      },
      project_type_text () {
        return options.project_type_text(this.info.project_type)
      },
      worker_num_text () {
        return options.worker_num_text(this.info.worker_num)
      },
      project_cycle_text () {
        return options.project_cycle_text(this.info.project_cycle)
      },
      billing_mode_text () {
        return options.billing_mode_text(this.info.billing_mode)
      },
      work_intensity_text () {
        return options.work_intensity_text(this.info.work_intensity)
      },
      worker_level_text () {
        return options.worker_level_text(this.info.worker_level)
      },
      remote_work_text () {
        return options.remote_work_text(this.info.remote_work)
      },
      work_address_text () {
        var bmp = []
        for (var i in this.info.work_address) {
          bmp.push(this.info.work_address[i].text)
        }
        return bmp.join('; ')
      }
    },
    methods: {
      toggleDeatil (event) {
        var Desc = event.target.previousSibling.previousSibling.lastChild

        if (/hide/.test(Desc.className)) {
          Desc.className = Desc.className.replace(' hide', '')
          Desc.className = Desc.className.replace(' mui-ellipsis-3', '')
          Desc.className += ' show'

          event.target.className = 'toggle hide'
        } else {
          Desc.className = Desc.className.replace(' show', '')
          Desc.className += ' hide mui-ellipsis-3'

          event.target.className = 'toggle show'
        }
      },
      getDetail () {
        postRequest(`project/info`, {
          id: this.project_id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          this.info = response.data.data
          this.loading = 0
        })
      }

    },
    mounted () {
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        this.getDetail()
      })
    },

    created () {
      // showInwehubWebview();

      this.project_id = this.$route.query.id
      if (!this.project_id) {
        window.mui.back()
      }

      this.getDetail()
    }
  }
</script>

<style scoped>
  .projectPreviewCard {
    background: #b4b4b6;
    height: 196.0.5rem;
    text-align: center;
    color: #fff;
  }

  .projectPreviewCard a {
    position: absolute;
    z-index: 777;
    color: #fff;
    font-size: 3rem;
    top: 1.2rem;
    left: 0.6rem;
  }

  .projectPreviewCard .header {
    position: relative;
    height: 9.2rem;
  }

  .projectPreviewCard .header .avatar {
    position: absolute;
    left: 50%;
    margin-top: 1.3rem;
    margin-left: -36.0.5rem;
    z-index: 9;
    color: #ffffff;
    display: inline-block;
    height: 73.0.5rem;
    width: 73.0.5rem;
    font-size: 2rem;
    text-align: center;
    border-radius: 50%;
    vertical-align: top;
  }

  .projectPreviewCard .header .avatar .avatarInner {
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

  .projectPreviewCard .header .avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .projectPreviewCard .title {
    margin-top: 2rem;
    font-size: 1.7rem;
  }

  .projectPreviewCard .titleSub {
    font-size: 1.4rem;
    margin: 0.3rem 0;
  }

  .projectPreviewCard .state {
    font-size: 1.4rem;
  }

  .projectPreviewCard i.separate {
    display: inline-block;
    position: relative;
    top: 0.2rem;
    height: 1.4rem;
    margin: 0 0.8rem;
    border-left: 0.1rem solid #c8c8c8;
  }

  .section {
    background: #fff;
    margin-top: 1rem;
    padding: 0 1.6rem 0.9rem;
  }

  .section h5 {
    position: relative;
    font-size: 1.6rem;
    color: #444;
    padding: 1.9rem 0;
  }

  .section h5:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 0.1rem;
    content: '';
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    background-color: #dcdcdc;
  }

  .section .contentWrapper {
    margin-top: 1.5rem;
  }

  .section .contentWrapper .toggle {
    position: relative;
    font-size: 1.3rem;
    height: 0.8rem;
  }

  .section .contentWrapper .toggle.show:after {
    border: none;
    border-left: 0.6rem solid transparent;
    border-right: 0.6rem solid transparent;
    border-top: 1rem solid #d8d8d8;
  }

  .section .contentWrapper .toggle:after {
    position: absolute;
    right: 0;
    top: -0.6rem;
    width: 0;
    height: 0;
    content: '';
    border: none;
    border-left: 0.6rem solid transparent;
    border-right: 0.6rem solid transparent;
    border-bottom: 1rem solid #d8d8d8;
  }

  .section .contentWrapper .nav {
    margin: 2rem 0 1.4rem;
    background: #f3f4f6;
    text-align: center;
  }

  .section .contentWrapper .nav .navWrapper {
    height: 9rem;
    position: relative;
    background: #f3f4f6;
    font-size: 1.4rem;
    color: #808080;
  }

  .section .contentWrapper .nav .navWrapper .line {
    position: absolute;
    left: 50%;
    top: 1rem;
    bottom: 1rem;
    width: 0.1rem;
    background: #dcdcdc;
  }

  .section .contentWrapper .nav .row1 {
    margin-top: 2.5rem;
    color: #444;
    font-size: 2rem;
  }

  .section .contentWrapper .nav .row2 {
    margin-top: 0.5rem;
    color: #808080;
    font-size: 1.4rem;
  }

  .section .contentWrapper .nav .row2 span {
    font-size: 1.2rem;
  }

  .section .contentWrapper table {
    width: 100%;
  }

  .section .contentWrapper table td {
    padding: 0.5rem 0;
    vertical-align: top;
  }

  .section .contentWrapper table .tdTitle {
    color: #808080;
    font-size: 1.4rem;
  }

  .section .contentWrapper table .tdContent {
    text-align: left;
    color: #444;
    font-size: 1.4rem;
  }

  .section .contentWrapper .selectedWrapper .selected {
    display: inline-block;
    color: #03aef9;
    border: 0.1rem solid #03aef9;
    border-radius: 0.5rem;
    padding: 0.4rem 1rem 0.3rem;
    font-size: 1.4rem;
    margin: 0.5rem 1.4rem 0 0;
  }

  .section .contentWrapper .description {
    color: #444;
    font-size: 1.4rem;
    line-height: 2.4rem;
    margin-top: 1.5rem;
  }

  .section .contentWrapper .requirement {
    margin-top: 2rem;
    font-size: 1.4rem;
    color: #444;
  }

  .section .contentWrapper .requirement .icon {
    color: #c8c8c8;
    margin-right: 0;
    vertical-align: middle;
  }

  .section .contentWrapper .requirement .icon.one {
    font-size: 2.5rem;
    position: relative;
    top: 0;
  }

  .section .contentWrapper .requirement .icon.two {
    font-size: 1.8rem;
    margin-left: 1.5rem;
  }

  .section .contentWrapper .item {
    position: relative;
    padding-left: 7rem;
    margin: 1rem 0;
  }

  .section .contentWrapper .item .title {
    color: #808080;
    font-size: 1.4rem;
    line-height: 2.4rem;
    position: absolute;
    left: 0;
  }

  .section .contentWrapper .item .content {
    font-size: 1.3rem;
    line-height: 2.4rem;
    color: #444;
  }

  .section .contentWrapper .item .content-5 {
    padding-left: 1.2rem;
  }

  .section .contentWrapper .item .li {
    position: relative;
    padding-left: 1.1rem;
    margin-bottom: 0.8rem;
  }

  .section .contentWrapper .item .li:before {
    position: absolute;
    left: -0.4rem;
    top: 1rem;
    background: #03aef9;
    content: "";
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 0.3rem;
  }

  .section .contentWrapper .files {
    padding-top: 0.5rem;
  }

  .section .contentWrapper .files img {
    border: 0.1rem solid #e5e5e5;
    border-radius: 0.4rem;
    width: 5.8rem;
    height: 5.8rem;
    margin-right: 1.5rem;
  }

  .section .contentWrapper .requirement .icon:first-child {
    margin-left: 0 !important;
  }
</style>
