<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <Back :tapCallback="empty"></Back>
      <h1 class="mui-title">工作经历</h1>

    </header>

    <div class="mui-content">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">公司</label>
            <input type="text" v-model.trim="job.company" placeholder="必填"  @tap.stop.prevent="toselectcompany"  readonly>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">职位</label>
            <input type="text" v-model.trim="job.title" placeholder="必填">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <a href="#page_industry_tags" class="mui-navigate-right" @tap="fixSelect">行业领域<span
              class="mui-pull-right account-setting-field mui-ellipsis"
              v-if="infoIndustryTagsNames">{{ infoIndustryTagsNames
              }}</span><span class="mui-pull-right account-setting-field emptyFields" v-else>请选择</span></a>
          </div>
        </li>
        <!--<li class="mui-table-view-cell">-->
        <!--<div class="mui-input-row">-->
        <!--<a href="#page_product_tags" class="mui-navigate-right mui-ellipsis">产品类型<span-->
        <!--class="mui-pull-right account-setting-field mui-ellipsis" v-text="infoProductTagsNames"-->
        <!--v-if="infoProductTagsNames"></span><span class="mui-pull-right account-setting-field emptyFields"-->
        <!--v-else>请选择</span></a>-->
        <!--</div>-->
        <!--</li>-->
        <li class="mui-table-view-cell">
          <div class="mui-input-row" @tap.stop.prevent="initDate(1)">
            <label class="mui-navigate-right">开始时间</label><label class="mui-pull-right account-setting-field"
                                                                 v-text="job.begin_time"
                                                                 v-if="job.begin_time"></label><label
            class="mui-pull-right account-setting-field emptyFields" v-else>请选择</label>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row" @tap.stop.prevent="initDate(2)">
            <label class="mui-navigate-right">结束时间</label><label class="mui-pull-right account-setting-field"
                                                                 v-text="job.end_time"
                                                                 v-if="job.end_time"></label><label
            class="mui-pull-right account-setting-field emptyFields" v-else>请选择</label>
          </div>
        </li>
        <li class="mui-table-view-cell">

        </li>
      </ul>
      <div class="account_item_title">
        工作经历详情描述


      </div>

      <MTextarea v-model.trim="description" :content="description" :rows="5" :descMaxLength="2000"
                 :placeholder="'请详细填写该工作经历的详细信息'"></MTextarea>

      <div class="options">
        <a @tap.stop.prevent="muiViewBack">取消</a>
        <a @tap.stop.prevent="submit" :disabled="buttonSaveDisabled">保存</a>
      </div>

    </div>

    <div id="page_industry_tags" class="mui-modal mui-pageSub">
      <industry-tags-indexed-list :tag_type="3" :selected="job.industry_tags" :back_id="page_industry_tags_id"
                                  :object_type="object_type" v-on:selectedIndustryTags="selectedIndustryTags">

      </industry-tags-indexed-list>
    </div>

    <!--<div id="page_product_tags" class="mui-modal mui-pageSub">-->

      <!--&lt;!&ndash;这里放置真实显示的DOM内容&ndash;&gt;-->
      <!--<industry-tags-indexed-list :tag_type="4" :selected="job.product_tags" :back_id="page_product_tags_id"-->
                                  <!--:object_type="object_type" v-on:selectedIndustryTags="selectedProductTags">-->
      <!--</industry-tags-indexed-list>-->

    <!--</div>-->


    <div id="statusBarStyle" background="#fefefe" mode="light"></div>

  </div>
</template>

<script>
  import { NOTICE } from '../../../stores/types'
  import localEvent from '../../../stores/localStorage'
  import industryTagsIndexedList from '../../Tags/IndustryTagsIndexedlist.vue'
  import ACCOUNT_API from '../../../api/account'
  import dPickerComponent from '../../../components/picker/date-picker.vue'
  import MTextarea from '../../../components/MTextarea.vue'
  import { postRequest } from '../../../utils/request'
  import { getLocalUserInfo } from '../../../utils/user'
  import { onceSave, onceGet } from '../../../utils/cache'
  const currentUser = getLocalUserInfo()

  export default {
    data: () => ({
      user_id: currentUser.user_id,
      type: '',
      id: null,
      bak: '',
      object_type: '',
      job: {
        company: '',
        title: '',
        begin_time: '',
        end_time: '',
        description: '',
        industry_tags: '',
        product_tags: ''
      },
      initJob: {
        company: '',
        title: '',
        begin_time: '',
        end_time: '',
        description: '',
        industry_tags: '',
        product_tags: ''
      },
      description: '',
      page_industry_tags_id: 'page_industry_tags',
      page_product_tags_id: 'page_product_tags',
      descMaxLength: 2000,
      buttonSaveDisabled: false
    }),
    methods: {
      toselectcompany () {
        onceSave(this)
        this.$router.push('/selectCompany?from=job' + this.type)
      },
      getCompany () {
        //     选择公司
        if (this.$route.params.id) {
          this.type = this.$route.params.id
        }
        var placeholder = localEvent.getLocalItem('job' + this.type + '_company' + this.user_id)
        if (placeholder.length) {
          this.job.company = placeholder
        }
      },
      empty () {
        //   操作成删除保存的公司
        localEvent.clearLocalItem('job' + this.type + '_company' + this.user_id)
        window.mui.back()
      },
      refreshPageData: function () {
        this.getDetail()
      },
      getDetail: function () {
        // showInwehubWebview();
        let id = parseInt(this.$route.params.id)
        console.log('id:' + id)
        this.id = id
        if (this.id) {
          var jobs = localEvent.getLocalItem('jobs')

          if (!jobs || !jobs[id]) {
            this.$store.dispatch(NOTICE, cb => {
              cb({
                text: '发生一些错误',
                time: 1500,
                status: false
              })
            })
            this.$router.back()
            return
          }
          this.job = jobs[id]
          this.description = this.job.description
          this.bak = JSON.stringify(this.job)
        } else {
          this.clearData()
        }
      },
      clearData: function () {
        this.job = this.initJob
        this.description = ''
        this.bak = ''
      },
      fixSelect: function () {
        setTimeout(() => {
          window.mui.trigger(window.mui('.mui-indexed-list-item')[0], 'tap')
          window.mui.trigger(window.mui('.mui-indexed-list-item')[0], 'tap')
        }, 200)
      },
      muiViewBack: function () {
        var newItemChange = JSON.stringify(this.job)
        if (this.bak !== '' && newItemChange !== this.bak) {
          window.mui.confirm('您还未保存，确定退出么? ', '退出编辑', ['取消', '确定'], e => {
            if (e.index === 1) {
              this.clearData()
              window.mui.back()
            } else {
              return false
            }
          }, 'div')
        } else {
          window.mui.back()
        }
      },

      initDate: function (objType) {
        let currentDate = new Date()

        var toNow = false

        if (objType === 2) {
          toNow = true
        }

        var value = '1990-07-01'
        switch (objType) {
          case 1:
            value = this.job.begin_time
            break
          case 2:
            value = this.job.end_time
            break
          case 3:
            value = this.job.get_time
            break
        }

        let param = {
          'type': 'month',
          'beginYear': '1990',
          'endYear': currentDate.getFullYear(),
          'toNow': toNow,
          'value': value
        }

        let picker = new window.mui.DtPicker(param)
        picker.show((rs) => {
          rs.text = rs.text === '至今-至今' ? '至今' : rs.text

          switch (objType) {
            case 1:
              this.job.begin_time = rs.text
              break
            case 2:
              this.job.end_time = rs.text
              break
            case 3:
              this.job.get_time = rs.text
              break
          }
        })
      },
      selectedIndustryTags (tags, objectType) {
        this.job.industry_tags = tags
      },
      selectedProductTags (tags, objectType) {
        this.job.product_tags = tags
      },
      submit () {
        if (!this.job.company) {
          window.mui.toast('公司名称不能为空')
          return
        }

        if (!this.job.title) {
          window.mui.toast('公司职位不能为空')
          return
        }

        if (this.job.industry_tags.length === 0) {
          window.mui.toast('行业领域不能为空')
          return
        }

        this.job.product_tags = ['1']
        //        if (this.job.product_tags.length === 0) {
        //          mui.toast("产品类型不能为空");
        //          return;
        //        }

        if (!this.job.begin_time) {
          window.mui.toast('开始时间不能为空')
          return
        }

        if (!this.job.end_time) {
          window.mui.toast('结束时间不能为空')
          return
        }

        if (this.job.end_time < this.job.begin_time) {
          window.mui.alert('开始时间需早于结束时间')
          return
        }

        var url = ''
        if (this.id) {
          url = ACCOUNT_API.UPDATE_ACCOUNT_JOB
        } else {
          url = ACCOUNT_API.ADD_ACCOUNT_JOB
        }

        var json = JSON.stringify(this.job)
        var data = JSON.parse(json)

        if (this.id) {
          data.id = this.id
        }

        if (this.buttonSaveDisabled) return
        this.buttonSaveDisabled = true

        data.industry_tags = this.userIndustryTagsCodes

        data.description = this.description

        postRequest(url, data).then(response => {
          this.buttonSaveDisabled = false

          var code = response.data.code

          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          window.mui.toast('操作成功')
          //   操作成删除保存的公司
          localEvent.clearLocalItem('job' + this.type + '_company' + this.user_id)
          this.bak = ''
          if (!this.id) this.clearData()
          window.mui.back()
        })
      }
    },
    beforeRouteLeave (to, from, next) {
      var popDiv = document.querySelector('.mui-dtpicker')
      if (popDiv) {
        document.body.removeChild(popDiv)
      }

      popDiv = document.querySelector('.mui-poppicker')
      if (popDiv) {
        document.body.removeChild(popDiv)
      }

      next()
    },
    computed: {
      infoIndustryTagsNames () {
        if (this.job.industry_tags) {
          var newValue = []
          for (var i in this.job.industry_tags) {
            newValue.push(this.job.industry_tags[i].text)
          }
          return newValue.join()
        } else {
          return ''
        }
      },
      userIndustryTagsCodes () {
        var newValue = []
        for (var i in this.job.industry_tags) {
          if (typeof (this.job.industry_tags[i]) === 'object') {
            newValue.push(this.job.industry_tags[i].value)
          } else {
            newValue.push(this.job.industry_tags[i])
          }
        }
        return newValue
      },
      infoProductTagsNames () {
        if (this.job.product_tags && this.job.product_tags.length) {
          return this.job.product_tags.join()
        } else {
          return ''
        }
      }
    },
    watch: {
      '$route': 'refreshPageData'
    },
    components: {
      industryTagsIndexedList,
      dPickerComponent,
      MTextarea
    },
    mounted () {
      onceGet(this)
      this.getCompany()
    },
    created () {
      this.getDetail()
    }
  }
</script>

<style scoped>
  .mui-content {
    background: #FFFFFF;
  }

  .mui-input-row label {
    padding-right: 0;
  }

  .mui-input-row textarea {
    border: none !important;
  }

  .mui-input-row input {
    text-align: right;
    padding-right: 1.066rem;
  }

  .mui-input-row a {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    line-height: 1.1;
    float: left;
    width: 35%;
    padding: 0.293rem 0.4rem;
  }

  .mui-input-row a {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    line-height: 1.1;
    float: left;
    width: 35%;
    padding: 0.293rem 0.4rem;
  }

  .mui-table-view-cell {
    padding: 0;
  }

  .deleteWrapper {
    text-align: right;
    padding: 0.266rem;
  }

  .mui-table-view-cell .mui-navigate-right,
  .mui-table-view-cell .mui-navigate {
    color: #999;
  }

  .account-setting-field {
    position: absolute;
    text-align: right;
    width: 5.333rem;
    right: 1.066rem;
    height: 0.853rem;
    color: #3f3f3f;
    padding-right: 0;
  }

  /**/

  .account_item_title {
    padding-top: 0.213rem;
    padding-bottom: 0.213rem;
    color: #a6a6a6;
    font-size: 0.373rem;
    margin-left: 0.373rem;
  }

  .mui-table-view-cell:after {
    position: absolute;
    right: 0.4rem;
    bottom: 0;
    left: 0.4rem;
    height: 0.016rem;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #dcdcdc;
  }

  .mui-table-view:after {
    position: absolute;
    right: 0.4rem;
    bottom: 0;
    left: 0.4rem;
    height: 0.026rem;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #dcdcdc;
  }

  .mui-input-row {
    position: relative;
    font-size: 0.373rem;
  }

  .mui-content > .mui-table-view:first-child {
    margin-top: 0.4rem;
    background: #fefefe;
    margin-top: 0rem;
  }

  .mui-content {
    background: #fefefe;
  }

  /****取消和保存按钮样式****/

  .options {
    width: 100%;
    height: 1.093rem;
    margin-top: 0.533rem;
    padding: 0 0.4rem;
  }

  .options a {
    display: block;
    width: 3.066rem;
    height: 1.013rem;
    font-size: 0.426rem;
    text-align: center;
    line-height: 1.013rem;
    border-radius: 1.333rem;
  }

  .options a:nth-of-type(1) {
    float: left;
    background: #ececee;
    color: #03aef9;
  }

  .options a:nth-of-type(2) {
    float: right;
    background: #03aef9;
    color: #FFFFFF;
  }
</style>
