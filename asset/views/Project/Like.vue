<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">偏好设置</h1>
    </header>

    <div class="mui-content">
      <div class="schedule schedule-4"></div>
      <div class="basic">
        <div class="title">马上就可以发布了</div>
        <div class="titleSub">还有什么要交代的</div>

      </div>

      <ul class="mui-table-view companyForm">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <div class="fileSelect">资质要求<span class="option">（选填）</span>
              <svg class="icon" aria-hidden="true" @tap.stop.prevent="inputQualification()">
                <use xlink:href="#icon-plus"></use>
              </svg>
            </div>
            <div class="fileList">
              <div class="item" v-for="(item, index) in qualification_requirements">
                <svg class="icon" aria-hidden="true" @tap.stop.prevent="closeQualification(index)">
                  <use xlink:href="#icon-times"></use>
                </svg>
                {{item}}
              </div>

            </div>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <div class="fileSelect">其他条件<span class="option">（选填）</span>
              <svg class="icon" aria-hidden="true" @tap.stop.prevent="inputOther()">
                <use xlink:href="#icon-plus"></use>
              </svg>
            </div>
            <div class="fileList">
              <div class="item" v-for="(item, index) in other_requirements">
                <svg class="icon" aria-hidden="true" @tap.stop.prevent="closeOtherRequirements(index)">
                  <use xlink:href="#icon-times"></use>
                </svg>
                {{ item }}
              </div>

            </div>

          </div>
        </li>

        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">是否需要查看顾问简历</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio2" type="radio" value="1" v-model="is_view_resume">
                    是
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio2" type="radio" value="0" v-model="is_view_resume">
                    否
                </span>
            </div>

          </div>
        </li>

        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">是否需要顾问投递申请</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio3" type="radio" value="1" v-model="is_apply_request">
                    是
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio3" type="radio" value="0" v-model="is_apply_request">
                    否
                </span>
            </div>

          </div>
        </li>
      </ul>


      <div class="buttonWrapper">
        <button type="button" class="mui-btn mui-btn-block preview" @tap.stop.prevent="submit(true)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-gongkai"></use>
          </svg>
          <span>预览</span></button>
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit()">完成</button>
      </div>
    </div>

  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import { setCacheInfo, getCacheInfo, clearCacheInfo } from '../../utils/project'

  export default {
    data () {
      var cacheData = getCacheInfo()
      if (cacheData && cacheData.like) {
        return cacheData.like
      }

      return {
        qualification_requirements: [],
        other_requirements: [],
        is_view_resume: 0,
        is_apply_request: 0,
        loading: 1
      }
    },
    computed: {},
    methods: {
      closeQualification (index) {
        this.qualification_requirements.splice(index, 1)
      },
      closeOtherRequirements (index) {
        this.other_requirements.splice(index, 1)
      },
      inputQualification () {
        window.mui.prompt('输入资质要求', '', ' ', ['确定', '取消'], (e) => {
          if (e.index === 0) {
            if (e.value) {
              this.qualification_requirements.push(e.value)
            }
          }
        }, 'div')
      },
      inputOther () {
        window.mui.prompt('输入其他条件', '', ' ', ['确定', '取消'], (e) => {
          if (e.index === 0) {
            if (e.value) {
              this.other_requirements.push(e.value)
            }
          }
        }, 'div')
      },
      submit (isReview = false) {
        var data = {
          project_id: this.project_id,
          qualification_requirements: this.qualification_requirements,
          other_requirements: this.other_requirements,
          is_view_resume: this.is_view_resume,
          is_apply_request: this.is_apply_request,
          status: isReview ? 0 : 1
        }
        postRequest(`project/step_four`, data).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          if (isReview) {
            setCacheInfo('like', this.$data)
            this.$router.push('/project/review?id=' + this.project_id)
          } else {
            clearCacheInfo()
            window.mui.toast('操作成功')
            this.$router.push('/project/list')
          }
        })
      }

    },
    mounted () {
    },
    beforeRouteLeave (to, from, next) {
      document.body.style.backgroundColor = '#efeff4'
      next()
    },

    created () {
      this.project_id = this.$route.query.pid
      if (!this.project_id) {
        window.mui.back()
      }

      document.body.style.backgroundColor = '#fff'
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .mui-content {
    position: relative;
    min-height: 100%;
    width: 100%;
    background: #fff;
  }

  .schedule-4 {
    margin-left: 75%;
  }

  .schedule {
    width: 25%;
    height: 0.08rem;
    background: #03aef9;
  }

  .basic {
    height: 4rem;
    position: relative;
    text-align: center;
  }

  .basic .title {
    position: relative;
    top: 1.333rem;
    font-size: 0.533rem;
    color: #444;
  }

  .basic .titleSub {
    position: relative;
    top: 1.466rem;
    font-size: 0.373rem;
    color: #808080;
  }

  .companyForm {
    font-size: 0.373rem;
  }

  .companyForm:before {
    left: 0.426rem;
    background-color: #dcdcdc;
    right: 0.426rem;
  }

  .companyForm:after {
    left: 0.426rem;
    background-color: #dcdcdc;
    right: 0.426rem;
  }

  .companyForm label {
    padding-left: 0;
    color: #808080;

  }

  .companyForm input {
    width: 61% !important;
    text-align: right;
    font-size: 0.373rem;
    padding-right: 0;

  }

  .companyForm .mui-table-view-cell {
    padding: 0.16rem 0.4rem;
  }

  .companyForm .mui-table-view-cell:after {
    left: 0.426rem;
    right: 0.426rem;
    background-color: #dcdcdc;
    transform: scaleY(0.5);

  }

  .companyForm .mui-table-view-cell .modify {
    position: absolute;
    right: 0;
    top: 0.266rem;
    color: #c8c8c8;
    font-size: 0.48rem;
  }

  .companyForm .unit {
    padding: 0.266rem 0;
    float: right;
  }

  .companyForm label {
    width: auto !important;
    max-width: 49%;
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
    padding: 0.266rem;
    margin-right: 0.4rem;
  }

  .companyForm .textRight {
    float: right;
    display: inline-block;
  }

  .radioWrapper {
    display: inline-block;
    padding: 0.293rem 0 0.293rem 0.666rem;
    margin-left: 0.48rem;
  }

  .radioWrapper:first-child {
    margin-left: 0;
  }

  .radioWrapper input[type='radio'] {
    left: 0;
    top: 0.293rem;
  }

  .radioWrapper input[type='radio']:before {
    position: absolute;
    left: 0rem;
    color: #c8c8c8;
    font-size: 0.533rem;
  }

  .radioWrapper input[type='radio']:checked:before {
    color: #03aef9;
  }

  .noBottomBorder:after {
    display: none;
  }

  .fileSelect {
    font-size: 0.373rem;
    color: #808080;
    background: #fff;
    padding: 0.293rem 0;
    position: relative;
  }

  .fileSelect .icon {
    position: absolute;
    right: 0.026rem;
    color: #03aef9;
    top: 0.24rem;
    font-size: 0.586rem;
  }

  .fileSelect .option {
    color: #c8c8c8;
  }

  .fileList {
    padding: 0 0.4rem 0 0;
    background: #fff;
    font-size: 0.373rem;
  }

  .fileList .item {
    position: relative;
    line-height: 0.586rem;
    padding: 0.026rem 0 0.266rem 0.666rem;
    color: #808080;
  }

  .fileList .icon {
    position: absolute;
    left: 0;
    top: 0.106rem;
    font-size: 0.426rem;
    color: #c8c8c8;
  }

  .buttonWrapper {
    padding: 0.373rem 0.426rem 0.8rem;
    background: #fff;
    text-align: right;
  }

  .buttonWrapper button {
    position: relative;
    display: inline-block;
    width: 3.066rem;
    margin-top: 0.266rem;
    background: #03aef9;
    border: 0.026rem solid #03aef9;
  }

  .buttonWrapper button .icon {
    color: #03aef9;
    font-size: 0.693rem;
    position: absolute;
    top: 0.16rem;
    left: 0.56rem;
    margin-right: 0.133rem;
    vertical-align: top;
  }

  .buttonWrapper button.preview {
    background: #ececee;
    border: 0.026rem solid #ececee;
    color: #03aef9;
    opacity: 1;
    float: left;
  }

  .buttonWrapper button.preview span {
    margin-left: 0.64rem;
  }

  .selected {
    display: inline-block;
    color: #03aef9;
    border: 0.026rem solid #03aef9;
    border-radius: 0.133rem;
    padding: 0.106rem 0.266rem 0.08rem;
    font-size: 0.373rem;
    margin: 0.186rem 0.186rem 0 0;
  }

  .selected .icon {
    color: #c8c8c8;
    font-size: 0.293rem;
    margin-left: 0.186rem;
  }
</style>
