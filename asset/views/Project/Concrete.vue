<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">具体需求</h1>
    </header>

    <div class="mui-content">
      <div class="schedule schedule-2"></div>
      <div class="basic">
        <div class="title">有什么具体要求</div>
        <div class="titleSub">我们会根据你的需求提供匹配的服务</div>

      </div>

      <ul class="mui-table-view companyForm noBottomBorder">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">顾问数量</label>
            <input type="text" class="inputUnit" v-model="worker_num_text" readonly="readonly"
                   @tap.stop.prevent="selectCounselorNum()">
            <svg class="icon modify" aria-hidden="true" @tap.stop.prevent="selectCounselorNum()">
              <use xlink:href="#icon-shuru"></use>
            </svg>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">顾问级别</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio1" type="radio" value="1" v-model="worker_level">
                    熟练
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio1" type="radio" value="2" v-model="worker_level">
                    精通
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio1" type="radio" value="3" v-model="worker_level">
                    资深
                </span>
            </div>

          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目预算</label>
            <span class="unit">万</span>
            <input type="text" class="inputUnit" v-model="project_amount">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">计费模式</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio2" type="radio" value="1" v-model="billing_mode">
                    按人天算
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio2" type="radio" value="2" v-model="billing_mode">
                    整体打包
                </span>
            </div>

          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">开始时间</label>
            <input type="text" class="inputUnit" readonly="readonly" v-model="project_begin_time"
                   @tap.stop.prevent="selectProjectBeginTime">
            <svg class="icon modify" aria-hidden="true" @tap.stop.prevent="selectProjectBeginTime">
              <use xlink:href="#icon-shuru"></use>
            </svg>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目周期</label>
            <input type="text" class="inputUnit" readonly="readonly" v-model="project_cycle_text"
                   @tap.stop.prevent="selectProjectCycle">
            <svg class="icon modify" aria-hidden="true" @tap.stop.prevent="selectProjectCycle">
              <use xlink:href="#icon-shuru"></use>
            </svg>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">工作密度</label>
            <input type="text" class="inputUnit" readonly="readonly" @tap.stop.prevent="selectWorkIntensity"
                   v-model="work_intensity_text">
            <svg class="icon modify" aria-hidden="true" @tap.stop.prevent="selectWorkIntensity">
              <use xlink:href="#icon-shuru"></use>
            </svg>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">远程工作</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio3" type="radio" value="1" v-model="remote_work">
                    接受
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio3" type="radio" value="2" v-model="remote_work">
                    不接受
                </span>
            </div>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">差旅费用</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio4" type="radio" v-model="travel_expense" value="1">
                    包含在项目内
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio4" type="radio" value="2" v-model="travel_expense">
                    单独结算
                </span>
            </div>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">工作地点</label>
            <input type="text" class="inputUnit" readonly="readonly" @tap.stop.prevent="selectCity()">
            <svg class="icon modify" aria-hidden="true" @tap.stop.prevent="selectCity()">
              <use xlink:href="#icon-shuru"></use>
            </svg>
          </div>

          <div class="selectedWrapper">
                    <span class="selected" v-for="(address, index) in work_address">{{ address.text }}<svg class="icon"
                                                                                                           aria-hidden="true"
                                                                                                           @tap.stop.prevent="closeAddress(index)">
                    <use xlink:href="#icon-guanbi"></use>
                </svg></span>
          </div>
        </li>
      </ul>


      <div class="buttonWrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit()"
                :disabled="disabledButton">下一步

        </button>
      </div>

    </div>

  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import { selectTime, selectKeyValue, selectCityThreeLevel } from '../../utils/select'
  import cityData from '../../components/city/city.data'
  import { setCacheInfo, getCacheInfo } from '../../utils/project'

  export default {
    data () {
      var cacheData = getCacheInfo()
      if (cacheData && cacheData.concrete) {
        return cacheData.concrete
      }

      return {
        project_id: null,
        worker_num: '',
        worker_num_text: '',
        worker_level: 1,
        project_amount: '',
        billing_mode: 1,
        project_begin_time: '',
        project_cycle: '',
        project_cycle_text: '',
        work_intensity: '',
        work_intensity_text: '',
        remote_work: 1,
        travel_expense: 1,
        work_address: [],
        disabledButton: true,
        loading: 1
      }
    },
    computed: {},
    methods: {
      isEnableButton: function () {
        this.disabledButton = true
        if (!this.worker_num) {
          return
        }

        if (!this.worker_level) {
          return
        }

        if (!this.project_amount) {
          return
        }

        if (!this.billing_mode) {
          return
        }

        if (!this.project_begin_time) {
          return
        }

        if (!this.project_cycle) {
          return
        }

        if (!this.work_intensity) {
          return
        }

        if (this.work_address.length === 0) {
          return
        }

        this.disabledButton = false
      },
      submit: function () {
        if (!this.worker_num) {
          window.mui.toast('请输入顾问数量')
          return
        }

        if (!this.worker_level) {
          window.mui.toast('请输入顾问级别')
          return
        }

        if (!this.project_amount) {
          window.mui.toast('请输入项目预算')
          return
        }

        if (!this.billing_mode) {
          window.mui.toast('请输入计费模式')
          return
        }

        if (!this.project_begin_time) {
          window.mui.toast('请输入开始时间')
          return
        }

        if (!this.project_cycle) {
          window.mui.toast('请输入项目周期')
          return
        }

        if (!this.work_intensity) {
          window.mui.toast('请输入工作密度')
          return
        }

        if (this.work_address.length === 0) {
          window.mui.toast('请输入工作地点')
          return
        }

        var data = {
          project_id: this.project_id,
          worker_num: this.worker_num,
          worker_level: this.worker_level,
          project_amount: this.project_amount,
          billing_mode: this.billing_mode,
          project_begin_time: this.project_begin_time,
          project_cycle: this.project_cycle,
          work_intensity: this.work_intensity,
          remote_work: this.remote_work,
          travel_expense: this.travel_expense,
          work_address: this.work_address
        }

        postRequest(`project/step_two`, data).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          setCacheInfo('concrete', this.$data)

          this.$router.push('/project/company?pid=' + this.project_id)
        })
      },
      closeAddress: function (index) {
        this.work_address.splice(index, 1)
      },
      selectProjectBeginTime: function () {
        selectTime({
          'type': 'date',
          'beginYear': (new Date()).getFullYear(),
          'value': this.project_begin_time
        }, (selected) => {
          this.project_begin_time = selected
        })
      },

      selectCounselorNum () {
        selectKeyValue(this.worker_num, [
          {
            value: '1',
            text: '1个'
          },
          {
            value: '2',
            text: '2个'
          },
          {
            value: '3',
            text: '3~5个'
          },
          {
            value: '4',
            text: '5~8个'
          },
          {
            value: '5',
            text: '8个以上'
          },
          {
            value: '6',
            text: '其他'
          },
          {
            value: '7',
            text: '不确定'
          }
        ], (value, key) => {
          this.worker_num = value
          this.worker_num_text = key
        })
      },

      selectProjectCycle () {
        selectKeyValue(this.project_cycle, [
          {
            value: '1',
            text: '小于1周'
          },
          {
            value: '2',
            text: '1-2周'
          },
          {
            value: '3',
            text: '2-4周'
          },
          {
            value: '4',
            text: '1-2月'
          },
          {
            value: '5',
            text: '2-4月'
          },
          {
            value: '6',
            text: '4-6月'
          },
          {
            value: '7',
            text: '半年以上'
          },
          {
            value: '8',
            text: '不确定'
          },
          {
            value: '9',
            text: '其他'
          }
        ], (value, key) => {
          this.project_cycle = value
          this.project_cycle_text = key
        })
      },
      selectWorkIntensity () {
        selectKeyValue(this.work_intensity, [
          {
            value: '1',
            text: '2H/W'
          },
          {
            value: '2',
            text: '4H/W'
          },
          {
            value: '3',
            text: '8H/W'
          },
          {
            value: '4',
            text: '16H/W'
          },
          {
            value: '5',
            text: '24H/W'
          },
          {
            value: '6',
            text: '32H/W'
          },
          {
            value: '7',
            text: '40H/W'
          },
          {
            value: '8',
            text: '其他'
          },
          {
            value: '9',
            text: '我不确定'
          }
        ], (value, key) => {
          this.work_intensity = value
          this.work_intensity_text = key
        })
      },
      selectCity () {
        var newCityData = [
          {
            value: '1',
            text: '中国',
            children: cityData
          },
          {
            value: '2',
            text: '海外',
            children: []
          }
        ]

        var defaultValues = null

        selectCityThreeLevel(defaultValues, newCityData, (items) => {
          var obj = {
            value: items[2].value ? items[2].value : items[0].value,
            text: items[2].text ? items[1].text + ' ' + items[2].text : items[0].text
          }
          if (obj.value === '2') {
            window.mui.prompt('输入海外地点', '', ' ', ['确定', '取消'], (e) => {
              if (e.index === 0) {
                if (e.value) {
                  obj = {
                    value: e.value,
                    text: e.value
                  }
                  this.work_address.push(obj)
                }
              }
            }, 'div')
          } else {
            this.work_address.push(obj)
          }
        })
      }
    },

    mounted () {

    },
    watch: {
      worker_num: function (newMoney, oldMoney) {
        this.isEnableButton()
      },
      project_amount: function (newMoney, oldMoney) {
        this.isEnableButton()
      },
      project_begin_time: function (newMoney, oldMoney) {
        this.isEnableButton()
      },
      project_cycle: function (newMoney, oldMoney) {
        this.isEnableButton()
      },
      work_intensity: function (newMoney, oldMoney) {
        this.isEnableButton()
      },
      work_address: function (newMoney, oldMoney) {
        this.isEnableButton()
      }
    },

    created () {
      this.project_id = this.$route.query.pid
      if (!this.project_id) {
        window.mui.back()
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .schedule {
    width: 25%;
    height: 3px;
    background: #03aef9;
  }

  .schedule-2 {
    margin-left: 25%;
  }

  .basic {
    height: 150px;
    position: relative;
    text-align: center;
  }

  .basic .title {
    position: relative;
    top: 50px;
    font-size: 20px;
    color: #444;
  }

  .basic .titleSub {
    position: relative;
    top: 55px;
    font-size: 14px;
    color: #808080;
  }

  .companyForm {
    font-size: 14px;
  }

  .companyForm:before {
    left: 16px;
    background-color: #dcdcdc;
    right: 16px;
  }

  .companyForm:after {
    left: 16px;
    background-color: #dcdcdc;
    right: 16px;
  }

  .companyForm label {
    padding-left: 0;
    color: #808080;

  }

  .companyForm input {
    width: 61% !important;
    text-align: right;
    font-size: 14px;
    padding-right: 0;

  }

  .companyForm .mui-table-view-cell {
    padding: 6px 15px;
  }

  .companyForm .mui-table-view-cell:after {
    left: 16px;
    right: 16px;
    background-color: #dcdcdc;
    transform: scaleY(0.5);

  }

  .companyForm .mui-table-view-cell .modify {
    position: absolute;
    right: 0;
    top: 10px;
    color: #c8c8c8;
    font-size: 18px;
  }

  .companyForm .unit {
    padding: 10px 0;
    float: right;
    margin-left: -15px;
  }

  .companyForm label {
    width: auto !important;
    max-width: 39%;
    padding-right: 0;
    line-height: normal;
  }

  .companyForm label .optional {
    color: #c8c8c8;
  }

  .companyForm input::placeholder {
    color: #c8c8c8;
  }

  .companyForm .inputUnit {
    padding: 10px;
    margin-right: 15px;
  }

  .companyForm .textRight {
    float: right;
    display: inline-block;
  }

  .radioWrapper {
    display: inline-block;
    padding: 11px 0 11px 25px;
    margin-left: 18px;
  }

  .radioWrapper:first-child {
    margin-left: 0;
  }

  .radioWrapper input[type='radio'] {
    left: 0;
    top: 11px;
  }

  .radioWrapper input[type='radio']:before {
    position: absolute;
    left: 0px;
    color: #c8c8c8;
    font-size: 20px;
  }

  .radioWrapper input[type='radio']:checked:before {
    color: #03aef9;
  }

  .noBottomBorder:after {
    display: none;
  }

  .fileSelect {
    font-size: 14px;
    color: #c8c8c8;
    background: #fff;
    padding: 15px;
    position: relative;
  }

  .fileSelect .icon {
    position: absolute;
    right: 15px;
    color: #03aef9;
    font-size: 22px;
  }

  .fileList {
    padding: 0 15px 30px;
    background: #fff;
    font-size: 14px;
  }

  .fileList .item {
    padding: 5px 0;
  }

  .fileList .icon {
    font-size: 16px;
    color: #c8c8c8;
    margin-right: 10px;
  }

  .buttonWrapper {
    padding: 14px 16px 30px;
    background: #fff;
    text-align: center;
  }

  .buttonWrapper button {
    display: inline-block;
    width: 115px;
    margin-top: 10px;
    background: #03aef9;
    border: 1px solid #03aef9;
  }

  .buttonWrapper button:disabled {
    background: #dcdcdc;
    border: 1px solid #dcdcdc;
    color: #b4b4b6;
    opacity: 1;
  }

  .selected {
    display: inline-block;
    color: #03aef9;
    border: 1px solid #03aef9;
    border-radius: 5px;
    padding: 4px 10px 3px;
    font-size: 14px;
    margin: 5px 7px 0 0;
  }

  .selected .icon {
    color: #c8c8c8;
    font-size: 11px;
    margin-left: 7px;
    position: relative;
    top: -1px;
  }


</style>
