<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">项目概况</h1>
    </header>

    <div class="mui-content">
      <div class="schedule"></div>
      <div class="basic">
        <div class="title">说说你的项目</div>
        <div class="titleSub">填写项目概况</div>
      </div>

      <ul class="mui-table-view companyForm noBottomBorder">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目名称</label>
            <input type="text" v-model="project_name" maxlength="60"  v-if="project_name">
            <input type="text" v-model="project_name" placeholder="输入项目名称" maxlength="60" v-else>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目类型</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio1" type="radio" v-model="project_type" value="1">
                    一次性
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio1" type="radio" v-model="project_type" value="2">
                    持续性
                </span>
            </div>

          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目阶段</label>
            <input type="text" class="inputUnit" readonly="readonly" :value="project_stage_text"
                   @tap.stop.prevent="selectProjectStage">
            <svg class="icon modify" aria-hidden="true" @tap.stop.prevent="selectProjectStage">
              <use xlink:href="#icon-shuru"></use>
            </svg>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目描述</label>

            <MTextarea v-model.trim="project_description" :content="project_description" :rows="5" :descMaxLength="500"
                       :placeholder="''"></MTextarea>
          </div>
        </li>
      </ul>

      <div class="fileSelect">添加附件（.jpg）

        <svg class="icon" aria-hidden="true" @tap.stop.prevent="selectImgs()">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </div>
      <div class="fileList">
        <div class="item" v-for="(image, index) in images">
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="delImg(index)">
            <use xlink:href="#icon-times1"></use>
          </svg>
          <img :id="'image_' + index" :src="image.base64"/></div>
      </div>

      <div class="buttonWrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit()"
                :disabled="disableButton">下一步
        </button>
      </div>

    </div>

  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import MTextarea from '../../components/MTextarea.vue'
  import { selectFileH5, compressImg } from '../../utils/uploadFile'
  import { setCacheInfo, cacheProject, resetCache } from '../../utils/project'
  import { selectKeyValue } from '../../utils/select'

  export default {
    data () {
      return {
        project_id: null,
        project_name: '',
        project_type: '1',
        project_stage: null,
        project_stage_text: '',
        project_description: '',
        disableButton: true,
        deleted_images: [],
        percentCompleted: 0,
        editMode: false,
        images: [],
        loading: 1
      }
    },
    computed: {},
    methods: {
      // 点击时用封装好的调用体统的方法；
      selectProjectStage () {
        selectKeyValue(this.project_stage, [
          {
            value: '1',
            text: '只有个想法，还需要看看'
          },
          {
            value: '2',
            text: '项目已立项，就等顾问来操刀'
          },
          {
            value: '3',
            text: '项目进行中，需要大牛加入'
          }
        ], (value, key) => {
          this.project_stage = value
          this.project_stage_text = key
        })
      },
      selectImgs () {
        selectFileH5('img', (file, base64) => {
          var imgInfo = {
            name: file.name,
            size: file.size,
            base64: base64,
            isNew: true
          }

          this.images.push(imgInfo)
        })
      },
      delImg (index) {
        var img = this.images[index]
        if (!img.isNew) {
          this.deleted_images.push(img.base64)
        }
        this.images.splice(index, 1)
      },
      isEnableButton () {
        this.disableButton = true
        if (!this.project_name) {
          return
        }

        if (!this.project_type) {
          return
        }

        if (!this.project_stage) {
          return
        }

        if (!this.project_description) {
          return
        }

//        if (this.images.length === 0) {
//          return;
//        }

        this.disableButton = false
      },
      submit () {
        if (!this.project_name) {
          window.mui.toast('请输入项目名称')
          return
        }

        if (!this.project_type) {
          window.mui.toast('请选择项目类型')
          return
        }

        if (!this.project_stage) {
          window.mui.toast('请选择项目阶段')
          return
        }

        if (!this.project_description) {
          window.mui.toast('请填写项目描述')
          return
        }

//        if (this.images.length === 0) {
//            mui.toast('请添加附件');
//            return;
//        }
        // 向后端发送的值；
        var data = {
          project_id: this.project_id,
          project_name: this.project_name,
          project_type: this.project_type,
          project_stage: this.project_stage,
          project_description: this.project_description,
          deleted_images: this.deleted_images
        }

        for (var i in this.images) {
          if (this.images[i].isNew) {
            var compressBase64 = compressImg('image_' + i)
            data['image_' + i] = compressBase64  // this.images[i].base64;
          }
        }

        var options = {
          onUploadProgress: function (progressEvent) {
            this.percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            window.mui.uploadWaitingValue(this.percentCompleted)
          }
        }

        window.mui.showUploadWaiting()

        // 提交时把信息
        postRequest(`project/step_one`, data, false, options).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          this.project_id = response.data.data.id
          var serverImages = response.data.data.images
          this.images = []
          for (var i in serverImages) {
            var newImage = {
              name: '',
              size: '',
              base64: serverImages[i],
              isNew: false
            }
            // 把图片赋给初始的images
            this.images.push(newImage)
          }

          setCacheInfo('basic', this.$data)

          this.$router.push('/project/concrete?pid=' + this.project_id)
          // 刷新页面；
          // location.reload();
        })
      },
      getData () {
        var projectId = this.$route.query.id ? this.$route.query.id : 0
        console.log('projectId:' + projectId)
        if (projectId) {
          // 缓存projectInfo
          this.editMode = true
          cacheProject(projectId, this)
        } else {
          this.editMode = false
          resetCache(this)
        }
      }
    },
    mounted () {
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        if (this.$router.currentRoute.path === '/project/basic') {
          this.getData()
        }
      })
    },
    components: {
      MTextarea
    },
    created () {
      // showInwehubWebview();

      this.getData()
    },
    watch: {
      project_name: function (newMoney, oldMoney) {
        this.isEnableButton()
      },
      project_type: function (newMoney, oldMoney) {
        this.isEnableButton()
      },
      project_stage: function (newMoney, oldMoney) {
        this.isEnableButton()
      },
      project_description: function (newMoney, oldMoney) {
        this.isEnableButton()
      },
      images: function (newMoney, oldMoney) {
        this.isEnableButton()
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
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
    width: 69% !important;
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
    max-width: 39%;
    padding-right: 0;
    line-height: normal;
  }

  .companyForm label .optional {
    color: #c8c8c8;
  }

  .textarea-wrapper {

    margin: 1.226rem 0 0;
    height: 4.373rem;
    position: relative;
    border-radius: 0.133rem;
    border: 0.026rem solid #dcdcdc;
    background: #fff;
    padding-bottom: 0.533rem;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 0.186rem;
    font-size: 0.373rem;
    bottom: 0.133rem;
    color: #c8c8c8;
  }

  .textarea-wrapper textarea {
    border: none;
    height: 100%;
    margin: 0;
    padding-bottom: 0;
  }

  .companyForm input::placeholder {
    color: #c8c8c8;
  }

  .companyForm .inputUnit {
    padding: 0.266rem;
    margin-right: 0.453rem;
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
    color: #c8c8c8;
    background: #fff;
    padding: 0.293rem 0.4rem;
    position: relative;
  }

  .fileSelect .icon {
    position: absolute;
    right: 0.426rem;
    color: #03aef9;
    font-size: 0.586rem;
  }

  .fileList {
    padding: 0 0.4rem 0;
    background: #fff;
    font-size: 0.373rem;
  }

  .fileList .item {
    position: relative;
    width: 1.626rem;
    height: 1.626rem;
    margin-right: 0.16rem;
    background-color: #e3e3e3;
    border-radius: 0.133rem;
    display: inline-block;
  }

  .fileList .item img {
    border-radius: 0.133rem;
    width: 100%;
    height: 100%;
  }

  .fileList .icon {
    position: absolute;
    right: -0.106rem;
    top: -0.106rem;
    font-size: 0.48rem;
    color: #808080;
  }

  .buttonWrapper {
    padding: 0.186rem 0.426rem 0.8rem;
    background: #fff;
    text-align: center;
  }

  .buttonWrapper button {
    display: inline-block;
    width: 3.066rem;
    margin-top: 0.266rem;
    background: #03aef9;
    border: 0.026rem solid #03aef9;
  }

  .buttonWrapper button:disabled {
    background: #dcdcdc;
    border: 0.026rem solid #dcdcdc;
    color: #b4b4b6;
    opacity: 1;
  }


</style>
