<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">教育经历</h1>

    </header>

    <div class="mui-content">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">学校</label>
            <input type="text" v-model.trim="edu.school" placeholder="必填">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">专业</label>
            <input type="text" v-model.trim="edu.major" placeholder="必填">
          </div>
        </li>
        <li class="mui-table-view-cell mui-input-row">
          <div @tap.stop.prevent="selectMajor" class="mui-navigate-right"><label>学历</label><label
            class="mui-pull-right account-setting-field">{{edu.degree ? edu.degree : '请选择'}}</label></div>
        </li>

        <li class="mui-table-view-cell mui-input-row">
          <div class="mui-input-row" @tap.stop.prevent="initDate(1)">
            <label class="mui-navigate-right">开始时间</label><label
            class="mui-pull-right account-setting-field">{{ edu.begin_time ? edu.begin_time : '请选择'}}</label>
          </div>
        </li>
        <li class="mui-table-view-cell mui-input-row">
          <div class="mui-input-row" @tap.stop.prevent="initDate(2)">
            <label class="mui-navigate-right">结束时间</label><label
            class="mui-pull-right account-setting-field">{{edu.end_time ? edu.end_time : '请选择'}}</label>
          </div>
        </li>
      </ul>

      <div class="account_item_title">
        教育经历详情描述


      </div>

      <MTextarea v-model.trim="description" :content="description" :rows="5" :descMaxLength="2000"
                 :placeholder="'请详细填写该教育经历的详细信息'"></MTextarea>

      <div class="options">
        <a @tap.stop.prevent="muiViewBack">取消</a>
        <a @tap.stop.prevent="submit" :disabled="buttonSaveDisabled">保存</a>
      </div>

    </div>


    <div id="statusBarStyle" background="#fefefe" mode="light"></div>

  </div>
</template>

<script>
  import { NOTICE } from '../../../stores/types'
  import { postRequest } from '../../../utils/request'
  import localEvent from '../../../stores/localStorage'
  import ACCOUNT_API from '../../../api/account'
  import dPickerComponent from '../../../components/picker/date-picker.vue'
  import popPickerComponent from '../../../components/picker/poppicker.vue'
  import MTextarea from '../../../components/MTextarea.vue'

  export default {
    data: () => ({
      id: null,
      bak: '',
      object_type: '',
      edu: {
        school: '',
        major: '',
        degree: '',
        begin_time: '',
        end_time: '',
        description: ''
      },
      initEdu: {
        school: '',
        major: '',
        degree: '',
        begin_time: '',
        end_time: '',
        description: ''
      },
      description: '',
      descMaxLength: 2000,
      buttonSaveDisabled: false
    }),
    methods: {
      refreshPageData () {
        this.getDetail()
      },
      getDetail () {
        let id = parseInt(this.$route.params.id)
        console.log('id:' + id)
        this.id = id
        if (this.id) {
          var edus = localEvent.getLocalItem('edus')

          if (!edus || !edus[id]) {
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
          this.edu = edus[id]
          this.description = this.edu.description
          this.bak = JSON.stringify(this.edu)
        } else {
          this.clearData()
        }
      },
      clearData () {
        this.edu = this.initEdu
        this.description = ''
        this.bak = ''
      },
      selectMajor () {
        var degreePicker = new window.mui.PopPicker()

        degreePicker.setData([{
          value: '大专',
          text: '大专'
        },
        {
          value: '本科',
          text: '本科'
        },
        {
          value: '硕士',
          text: '硕士'
        },
        {
          value: '博士',
          text: '博士'
        },
        {
          value: '其它',
          text: '其它'
        }
        ])

        degreePicker.show(items => {
          this.edu.degree = items[0].value
        })
      },
      muiViewBack: function () {
        var newItemChange = JSON.stringify(this.edu)
        if (this.bak !== '' && newItemChange !== this.bak) {
          window.mui.confirm('您还未保存，确定退出么?', '退出编辑', ['取消', '确定'], e => {
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
      resetEdu: function () {
        this.edu.school = ''
        this.edu.major = ''
        this.edu.degree = ''
        this.edu.begin_time = ''
        this.edu.end_time = ''
        this.edu.description = ''
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
            value = this.edu.begin_time
            break
          case 2:
            value = this.edu.end_time
            break
          case 3:
            value = this.edu.get_time
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
              this.edu.begin_time = rs.text
              break
            case 2:
              this.edu.end_time = rs.text
              break
            case 3:
              this.edu.get_time = rs.text
              break
          }
        })
      },
      submit () {
        if (!this.edu.school) {
          window.mui.toast('学校不能为空')
          return
        }

        if (!this.edu.major) {
          window.mui.toast('专业不能为空')
          return
        }

        if (!this.edu.degree) {
          window.mui.toast('学历不能为空')
          return
        }

        if (!this.edu.begin_time) {
          window.mui.toast('开始时间不能为空')
          return
        }

        if (!this.edu.end_time) {
          window.mui.toast('结束时间不能为空')
          return
        }

        if (this.edu.end_time < this.edu.begin_time) {
          window.mui.alert('开始时间需早于结束时间')
          return
        }

        var url = ''
        if (this.id) {
          url = ACCOUNT_API.UPDATE_ACCOUNT_EDU
        } else {
          url = ACCOUNT_API.ADD_ACCOUNT_EDU
        }

        var data = this.edu

        if (this.id) {
          data.id = this.id
        }

        if (this.buttonSaveDisabled) {
          return
        }

        data.description = this.description

        this.buttonSaveDisabled = true
        postRequest(url, data).then(response => {
          this.buttonSaveDisabled = false

          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          window.mui.toast('操作成功')
          this.bak = ''
          this.clearData()
          window.mui.back()
        })
      }
    },
    mounted () {
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        console.log('refresh-edu')
      })
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
    computed: {},
    components: {
      popPickerComponent,
      dPickerComponent,
      MTextarea
    },
    watch: {
      '$route': 'refreshPageData'
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

  .account_item_title {
    padding: 0.133rem;
    color: #a6a6a6;
    font-size: 0.32rem;
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
    margin-left: 0.266rem;
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
