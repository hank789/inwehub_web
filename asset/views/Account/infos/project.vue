<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left"  @tap.stop.prevent="empty()"></a>
      <h1 class="mui-title">项目经历</h1>

    </header>

    <div class="mui-content">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目名称</label>
            <input type="text" v-model.trim="project.project_name" placeholder="必填" >
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目角色</label>
            <input type="text" v-model.trim="project.title" placeholder="必填" >
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate" >客户名称</label>
            <input type="text" v-model.trim="project.customer_name" placeholder="必填" @tap.stop.prevent="toselectcompany"  readonly>
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
            <!--<a href="#page_product_tags" class="mui-navigate-right mui-ellipsis" @tap="fixSelect">产品类型<span-->
              <!--class="mui-pull-right account-setting-field mui-ellipsis" v-text="infoProductTagsNames"-->
              <!--v-if="infoProductTagsNames"></span><span class="mui-pull-right account-setting-field emptyFields" v-else>请选择</span></a>-->
          <!--</div>-->
        <!--</li>-->
        <li class="mui-table-view-cell">
          <div class="mui-input-row" @tap.stop.prevent="initDate(1)">
            <label class="mui-navigate-right">开始时间</label><label class="mui-pull-right account-setting-field"
                                                                 v-text="project.begin_time"></label>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row" @tap.stop.prevent="initDate(2)">
            <label class="mui-navigate-right">结束时间</label><label class="mui-pull-right account-setting-field"
                                                                 v-text="project.end_time"></label>
          </div>
        </li>

      </ul>
      <div class="account_item_title">
        项目经历详情描述


      </div>

      <MTextarea v-model.trim="description" :content="description" :rows="5" :descMaxLength="2000"
                 :placeholder="'请详细填写该项目经历的详细信息'"></MTextarea>

      <div class="options">
        <a @tap.stop.prevent="muiViewBack">取消</a>
        <a @tap.stop.prevent="submit" :disabled="buttonSaveDisabled">保存</a>
      </div>

    </div>

    <div id="page_industry_tags" class="mui-modal mui-pageSub">

      <industry-tags-indexed-list :tag_type="3" :selected="project.industry_tags" :back_id="page_industry_tags_id"
                                  :object_type="object_type" v-on:selectedIndustryTags="selectedIndustryTags">

      </industry-tags-indexed-list>

    </div>

    <div id="page_product_tags" class="mui-modal mui-pageSub">

      <!--这里放置真实显示的DOM内容-->
      <industry-tags-indexed-list :tag_type="4" :selected="project.product_tags" :back_id="page_product_tags_id"
                                  :object_type="object_type" v-on:selectedIndustryTags="selectedProductTags">
      </industry-tags-indexed-list>

    </div>


    <div id="statusBarStyle" background="#fefefe" mode="light"></div>

  </div>
</template>

<script>
  import { NOTICE } from '../../../stores/types'
  import { postRequest } from '../../../utils/request'
  import localEvent from '../../../stores/localStorage'
  import industryTagsIndexedList from '../../Tags/industryTagsIndexedlist.vue'
  import ACCOUNT_API from '../../../api/account'
  import dPickerComponent from '../../../components/picker/date-picker.vue'
  import MTextarea from '../../../components/MTextarea.vue'
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
      project: {
        project_name: '',
        title: '',
        customer_name: '',
        begin_time: '',
        end_time: '',
        description: '',
        industry_tags: [],
        product_tags: []
      },
      initProject: {
        project_name: '',
        title: '',
        customer_name: '',
        begin_time: '',
        end_time: '',
        description: '',
        industry_tags: [],
        product_tags: []
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
        this.$router.push('/selectCompany?from=project' + this.type)
      },
      getCompany () {
        //     选择公司
        if (this.$route.params.id) {
          this.type = this.$route.params.id
        }
        var customerName = localEvent.getLocalItem('project' + this.type + '_company' + this.user_id)
        if (customerName.length) {
          this.project.customer_name = customerName
        }
      },
      empty () {
        // 操作成删除保存的公司
        localEvent.clearLocalItem('project' + this.type + '_company' + this.user_id)
        window.mui.back()
      },
      refreshPageData: function () {
        this.getDetail()
      },
      getDetail: function () {
        let id = parseInt(this.$route.params.id)
        console.log('id:' + id)
        this.id = id
        if (this.id) {
          var projects = localEvent.getLocalItem('projects')

          if (!projects || !projects[id]) {
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
          this.project = projects[id]
          this.description = this.project.description
          this.bak = JSON.stringify(this.project)
        } else {
          this.clearData()
        }
      },
      clearData: function () {
        this.project = this.initProject
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
        var newItemChange = JSON.stringify(this.project)
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
            value = this.project.begin_time
            break
          case 2:
            value = this.project.end_time
            break
          case 3:
            value = this.project.get_time
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
              this.project.begin_time = rs.text
              break
            case 2:
              this.project.end_time = rs.text
              break
            case 3:
              this.project.get_time = rs.text
              break
          }
        })
      },
      selectedIndustryTags (tags, objectType) {
        this.project.industry_tags = tags
      },
      selectedProductTags (tags, objectType) {
        this.project.product_tags = tags
      },
      submit () {
        if (!this.project.project_name) {
          window.mui.toast('项目名称不能为空')
          return
        }

        if (!this.project.title) {
          window.mui.toast('项目角色不能为空')
          return
        }

        if (!this.project.customer_name) {
          window.mui.toast('客户名称不能为空')
          return
        }

        if (!this.project.industry_tags.length) {
          window.mui.toast('行业领域不能为空')
          return
        }

//        if (!this.project.product_tags.length) {
//          window.mui.toast('产品类型不能为空')
//          return
//        }

        if (!this.project.begin_time) {
          window.mui.toast('开始时间不能为空')
          return
        }

        if (!this.project.end_time) {
          window.mui.toast('结束时间不能为空')
          return
        }

        if (this.project.end_time < this.project.begin_time) {
          window.mui.alert('开始时间需早于结束时间')
          return
        }

        var url = ''
        if (this.id) {
          url = ACCOUNT_API.UPDATE_ACCOUNT_PROJECT
        } else {
          url = ACCOUNT_API.ADD_ACCOUNT_PROJECT
        }

        var json = JSON.stringify(this.project)
        var data = JSON.parse(json)

        if (this.id) {
          data.id = this.id
        }

        if (this.buttonSaveDisabled) return
        this.buttonSaveDisabled = true

        data.industry_tags = this.infoIndustryTagsCodes
        data.product_tags = this.infoProductTagsCodes

        data.description = this.description

        postRequest(url, data).then(response => {
          this.buttonSaveDisabled = false

          var code = response.data.code

          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          window.mui.toast('操作成功')
          // 操作成删除保存的公司
          localEvent.clearLocalItem('project' + this.type + '_company' + this.user_id)
          this.bak = ''
          this.clearData()
          window.mui.back()
        })
      }
    },
    mounted () {
      window.addEventListener('refreshData', function (e) {
        // 执行刷新
        console.log('refresh-project')
      })
      onceGet(this)
      this.getCompany()
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
    watch: {
      description: function (newDescription) {
        if (!newDescription) {
          return
        }

        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength)
        }
      },
      '$route': 'refreshPageData'
    },
    computed: {
      descLength () {
        if (this.description) {
          return this.description.length
        } else {
          return 0
        }
      },
      infoIndustryTagsNames () {
        if (this.project.industry_tags) {
          var newValue = []
          for (var i in this.project.industry_tags) {
            newValue.push(this.project.industry_tags[i].text)
          }
          return newValue.join()
        } else {
          return ''
        }
      },
      infoIndustryTagsCodes () {
        var newValue = []
        for (var i in this.project.industry_tags) {
          if (typeof (this.project.industry_tags[i]) === 'object') {
            newValue.push(this.project.industry_tags[i].value)
          } else {
            newValue.push(this.project.industry_tags[i])
          }
        }
        return newValue
      },
      infoProductTagsNames () {
        if (this.project.product_tags) {
          var newValue = []
          for (var i in this.project.product_tags) {
            newValue.push(this.project.product_tags[i].text)
          }
          return newValue.join()
        } else {
          return ''
        }
      },
      infoProductTagsCodes () {
        var newValue = []
        for (var i in this.project.product_tags) {
          if (typeof (this.project.product_tags[i]) === 'object') {
            newValue.push(this.project.product_tags[i].value)
          } else {
            newValue.push(this.project.product_tags[i])
          }
        }
        return newValue
      }
    },
    components: {
      industryTagsIndexedList,
      dPickerComponent,
      MTextarea
    },
    created () {
      // showInwehubWebview();
      this.getDetail()
    }
  }
</script>

<style scoped>
  .mui-input-row label {
    padding-right: 0;
  }

  .mui-input-row textarea {
    border: none !important;
  }

  .mui-input-row input {
    text-align: right;
    padding-right: 4rem;
  }

  .mui-input-row a {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    line-height: 1.1;
    float: left;
    width: 35%;
    padding: 1.1rem 1.5rem;
  }

  .mui-input-row a {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    line-height: 1.1;
    float: left;
    width: 35%;
    padding: 1.1rem 1.5rem;
  }

  .mui-table-view-cell {
    padding: 0;
  }

  .deleteWrapper {
    text-align: right;
    padding: 1rem;
  }

  .mui-table-view-cell .mui-navigate-right,
  .mui-table-view-cell .mui-navigate {
    color: #999;
  }

  .account_item_title {
    padding: 0.5rem;
    color: #a6a6a6;
    font-size: 1.2rem;
  }

  .account-setting-field {
    position: absolute;
    text-align: right;
    width: 20rem;
    right: 4rem;
    height: 3.2rem;
    color: #3f3f3f;
    padding-right: 0;
  }

  /**/

  .account_item_title {
    padding-top: 0.8rem;
    padding-bottom: 0.8rem;
    color: #a6a6a6;
    font-size: 1.4rem;
    margin-left: 1rem;
  }

  .mui-table-view-cell:after {
    position: absolute;
    right: 1.5rem;
    bottom: 0;
    left: 1.5rem;
    height: 0.06rem;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #dcdcdc;
  }

  .mui-table-view:after {
    position: absolute;
    right: 1.5rem;
    bottom: 0;
    left: 1.5rem;
    height: 0.1rem;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #dcdcdc;
  }

  .mui-input-row {
    position: relative;
    font-size: 1.4rem;
  }

  .textarea-wrapper[data-v-c8d6295a] {
    margin: 0 1.5rem 0 1.4rem;
    height: 100%;
    position: relative;
    border-radius: 0.5rem;
    border: 0.1rem solid #dcdcdc;
    padding-bottom: 2rem;
    background: #FEFEFE;
  }

  .textarea-wrapper textarea {
    font-size: 1.4rem;
    height: 100%;
    padding: 0.5rem 1rem;
    background: #fefefe;
  }

  .mui-content > .mui-table-view:first-child {
    margin-top: 1.5rem;
    background: #fefefe;
    margin-top: 0rem;
  }

  .mui-content {
    background: #fefefe;
  }

  /****取消和保存按钮样式****/

  .options {
    width: 100%;
    height: 4.1rem;
    margin-top: 2rem;
    padding: 0 1.5rem;
  }

  .options a {
    display: block;
    width: 11.5rem;
    height: 3.8rem;
    font-size: 1.6rem;
    text-align: center;
    line-height: 3.8rem;
    border-radius: 5rem;
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
