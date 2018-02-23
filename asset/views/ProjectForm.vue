<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-btn mui-btn-link mui-btn-nav mui-pull-left" @tap.stop.prevent="muiViewBack">取消</a>
      <h1 class="mui-title">发布项目</h1>
      <a @tap.stop.prevent="submit"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right" :disabled="buttonSaveDisabled">保存</a>
    </header>

    <div class="mui-content">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目名称</label>
            <input type="text" v-model.trim="project.name" placeholder="如:xxx公司sap实施项目">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目预算</label>
            <input type="number" v-model.trim="project.price" placeholder="填写预算金额">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <a @tap.stop.prevent="selectWorkerCity(true)" class="mui-navigate-right">项目地点<span
              class="mui-pull-right account-setting-field mui-ellipsis">{{ project.address !== '' ? project.address : '请选择'
              }}</span></a>

            <!--<input type="text" v-model.trim="project.address" placeholder="请选择" @tap.stop.prevent="selectWorkerCity()">-->
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">公司名称</label>
            <input type="text" v-model.trim="project.company" placeholder="请填写公司完整名称">
          </div>
        </li>

      </ul>
      <div class="account_item_title">
        项目简介



      </div>
      <div class="textarea-wrapper">
              <textarea v-model.trim="description" rows="5"
                        placeholder="请在这里填写项目描述，如具体的项目需求、实施范围、人天预估、顾问级别等。"></textarea>
        <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
      </div>
      <div class="deleteWrapper" v-show="id">
        <button type="button" class="mui-btn mui-btn-primary" @tap.stop.prevent="deleteItem">删除



        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { NOTICE } from '../stores/types'
  import { postRequest } from '../utils/request'
  import localEvent from '../stores/localStorage'
  import cityData from '../components/city/city.data'
  import popPickerComponent from '../components/picker/poppicker.vue'

  export default {
    data: () => ({
      id: null,
      bak: '',
      object_type: '',
      project: {
        name: '',
        price: '',
        province: '',
        city: '',
        address: '',
        company: '',
        description: ''
      },
      description: '',
      descMaxLength: 2000,
      buttonSaveDisabled: false
    }),

    methods: {
      refreshPageData () {
        this.initData()
      },
      initData () {
        let id = parseInt(this.$route.params.id)
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

          this.project = {
            name: projects[id].project_name,
            price: projects[id].project_amount,
            address: projects[id].project_province.name + ' ' + projects[id].project_city.name,
            company: projects[id].company_name,
            description: projects[id].description,
            province: projects[id].project_province.key,
            city: projects[id].project_city.key
          }
          this.description = projects[id].description
          this.bak = JSON.stringify(this.project)
        }
      },
      selectWorkerCity () {
        var cityPicker = new window.mui.PopPicker({
          layer: 2
        })
        cityPicker.setData(cityData)

        if (this.project.province) {
          cityPicker.pickers[0].setSelectedValue(this.project.province, 0, () => {
            cityPicker.pickers[1].setSelectedValue(this.project.city, 0, () => {
            })
          })
        }

        cityPicker.show(items => {
          this.project.province = items[0].value
          this.project.city = items[1].value
          this.project.address = items[0].text + ' ' + items[1].text
          cityPicker.dispose()
        })
      },
      muiViewBack: function () {
        var newItemChange = JSON.stringify(this.project)
        if (this.bak !== '' && newItemChange !== this.bak) {
          window.mui.confirm('您还未保存，确定退出么? ', '退出编辑', ['取消', '确定'], e => {
            if (e.index === 1) {
              window.mui.back()
            } else {
              return false
            }
          }, 'div')
        } else {
          window.mui.back()
        }
      },
      submit () {
        if (!this.project.name) {
          window.mui.toast('项目名称不能为空')
          return
        }

        if (!this.project.price) {
          window.mui.toast('项目预算不能为空')
          return
        }

        if (!this.project.address) {
          window.mui.toast('项目地点不能为空')
          return
        }

        if (!this.project.company) {
          window.mui.toast('公司名称不能为空')
          return
        }

        if (!this.description) {
          window.mui.toast('项目简介不能为空')
          return
        }

        var url = ''
        if (this.id) {
          url = 'project/update'
        } else {
          url = 'project/submit'
        }

        var data = {
          'project_name': this.project.name,
          'project_amount': this.project.price,
          'company_name': this.project.company,
          'project_province': this.project.province,
          'project_city': this.project.city,
          description: this.description
        }

        if (this.id) {
          data.id = this.id
        }

        if (this.buttonSaveDisabled) return
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
          window.mui.back()
        })
      },
      deleteItem () {
        var btnArray = ['否', '是']
        window.mui.confirm('确认要删除？', '删除', btnArray, e => {
          if (e.index === 1) {
            var url = 'project/destroy'
            postRequest(url, {id: this.id}).then(response => {
              window.mui.toast('删除成功')
              window.mui.back()
            })
          }
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
    mounted () {
    },
    components: {
      popPickerComponent
    },
    computed: {
      descLength () {
        if (this.description) {
          return this.description.length
        } else {
          return 0
        }
      }
    },
    watch: {
      description: function (newDescription) {
        if (newDescription.length > this.descMaxLength) {
          this.description = this.description.slice(0, this.descMaxLength)
        }
      },
      '$route': 'refreshPageData'
    },
    created () {
      // showInwehubWebview();
      this.initData()
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
    padding-right: 40px;
  }

  .mui-input-row a {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    line-height: 1.1;
    float: left;
    width: 35%;
    padding: 11px 15px;
  }

  .mui-input-row a {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    line-height: 1.1;
    float: left;
    width: 35%;
    padding: 11px 15px;
  }

  .mui-table-view-cell {
    padding: 0;
  }

  .textarea-wrapper {
    margin: 0 5px;
    height: 100%;
    position: relative;
    border-radius: 5px;
    border: 1px solid #bbbbbb;
    background: #fff;
    padding-bottom: 20px;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 4px;
    font-size: 12px;
    bottom: 2px;
    color: #b0b0b0;
  }

  .textarea-wrapper textarea {
    border: none;
    margin: 0;
    padding-bottom: 0;
  }

  .deleteWrapper {
    text-align: right;
    padding: 10px;
  }

  .mui-table-view-cell .mui-navigate-right, .mui-table-view-cell .mui-navigate {
    color: #999;
  }

  .account-setting-field {

  }

  .account_item_title {
    padding: 5px;
    color: #a6a6a6;
    font-size: 12px;
  }

  .account-setting-field {
    position: absolute;
    text-align: right;
    width: 200px;
    right: 40px;
    height: 32px;
    color: #3f3f3f;
    padding-right: 0;
  }
</style>
