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
            <input type="text" v-model="project_name" maxlength="60" v-if="project_name">
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
            <input type="text"  class="inputUnit" readonly="readonly" :value="project_stage_text" @tap.stop.prevent="selectProjectStage">
            <svg class="icon modify" aria-hidden="true" @tap.stop.prevent="selectProjectStage">
              <use xlink:href="#icon-shuru"></use>
            </svg>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目描述</label>

            <MTextarea v-model.trim="project_description" :content="project_description" :rows="5" :descMaxLength="500" :placeholder="''"></MTextarea>
          </div>
        </li>
      </ul>

      <div class="fileSelect">添加附件（.jpg）
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="selectImgs()">
        <use xlink:href="#icon-plus"></use>
      </svg>
      </div>
      <div class="fileList">
        <div class="item" v-for="(image, index) in images"><svg class="icon" aria-hidden="true" @tap.stop.prevent="delImg(index)">
          <use xlink:href="#icon-times1"></use>
        </svg><img :id="'image_' + index" :src="image.base64"/></div>
      </div>

      <div class="buttonWrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit()" :disabled="disableButton">下一步</button>
      </div>

    </div>

  </div>
</template>

<script>
  import {apiRequest, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';
  import MTextarea from '../../components/MTextarea.vue';
  import {selectFileH5, compressImg} from '../../utils/uploadFile';
  import {setCacheInfo, getCacheInfo, cacheProject, resetCache} from '../../utils/project';
  import {selectKeyValue} from '../../utils/select';


  export default {
    data(){
      return {
        project_id:null,
        project_name:'',
        project_type:'1',
        project_stage:null,
        project_stage_text:'',
        project_description:'',
        disableButton:true,
        deleted_images:[],
        percentCompleted:0,
        editMode:false,
        images:[],
        loading: 1
      }
    },
    computed: {
    },
    methods: {
    	//点击时用封装好的调用体统的方法；
      selectProjectStage(){
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
          },
        ], (value, key) => {
          this.project_stage = value;
          this.project_stage_text = key;
        });
      },
      selectImgs(){
        selectFileH5('img', (file, base64) => {
            var imgInfo = {
              name : file.name,
              size: file.size,
              base64: base64,
              isNew:true,
            };

            this.images.push(imgInfo);
        });
      },
      delImg(index) {
          var img = this.images[index];
          if (!img.isNew) {
              this.deleted_images.push(img.base64);
          }
          this.images.splice(index, 1);
      },
      isEnableButton() {
        this.disableButton = true;
        if (!this.project_name) {

          return;
        }

        if (!this.project_type) {

          return;
        }

        if (!this.project_stage) {

          return;
        }

        if (!this.project_description) {

          return;
        }

//        if (this.images.length === 0) {
//          return;
//        }

        this.disableButton = false;
      },
      submit(){
        if (!this.project_name) {
            mui.toast('请输入项目名称');
            return;
        }

        if (!this.project_type) {
          mui.toast('请选择项目类型');
          return;
        }

        if (!this.project_stage) {
          mui.toast('请选择项目阶段');
          return;
        }

        if (!this.project_description) {
          mui.toast('请填写项目描述');
          return;
        }

//        if (this.images.length === 0) {
//            mui.toast('请添加附件');
//            return;
//        }
         //向后端发送的值；
        var data = {
          project_id:this.project_id,
          project_name:this.project_name,
          project_type:this.project_type,
          project_stage:this.project_stage,
          project_description:this.project_description,
          deleted_images:this.deleted_images,
        };


        for (var i in this.images) {
            if (this.images[i].isNew) {
              var compressBase64 = compressImg('image_' +i);
              data['image_' +i] = compressBase64; //this.images[i].base64;
            }
        }

        var options = {
          onUploadProgress: function(progressEvent) {
            this.percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            mui.uploadWaitingValue(this.percentCompleted);
          }
        };

        mui.showUploadWaiting();

        //提交时把信息
        postRequest(`project/step_one`, data, false, options).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          this.project_id = response.data.data.id;
          var serverImages = response.data.data.images;
          this.images = [];
          for(var i in serverImages) {
            var newImage = {
              name : '',
              size: '',
              base64: serverImages[i],
              isNew:false,
            };
            //把图片赋给初始的images
            this.images.push(newImage);
          }

          setCacheInfo('basic', this.$data);

          this.$router.push('/project/concrete?pid='+this.project_id);
          //刷新页面；
          //location.reload();
        });
      },
      getData(){
        var projectId = this.$route.query.id?this.$route.query.id:0;
        console.log('projectId:' + projectId);
        if (projectId) {
          //缓存projectInfo
          this.editMode = true;
          cacheProject(projectId, this);
        } else {
          this.editMode = false;
          resetCache(this);
        }
      }
    },
    mounted(){
      window.addEventListener('refreshData', (e)=>{
        //执行刷新
        if (this.$router.currentRoute.path === '/project/basic') {
          this.getData();
        }
      });
    },
    components: {
      MTextarea
    },
    created(){
      //showInwehubWebview();

      this.getData();
    },
    watch: {
      project_name: function (newMoney, oldMoney) {
          this.isEnableButton();
      },
      project_type: function (newMoney, oldMoney) {
        this.isEnableButton();
      },
      project_stage: function (newMoney, oldMoney) {
        this.isEnableButton();
      },
      project_description: function (newMoney, oldMoney) {
        this.isEnableButton();
      },
      images: function (newMoney, oldMoney) {
        this.isEnableButton();
      },
    }
  };
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .schedule{
    width:25%;
    height:3px;
    background: #03aef9;
  }

  .basic{
    height:150px;
    position: relative;
    text-align: center;
  }

  .basic .title{
    position: relative;
    top:50px;
    font-size:20px;
    color:#444;
  }

  .basic .titleSub{
    position: relative;
    top:55px;
    font-size:14px;
    color:#808080;
  }


  .companyForm{
    font-size:14px;
  }
  .companyForm:before{
    left:16px;
    background-color: #dcdcdc;
    right:16px;
  }
  .companyForm:after{
    left:16px;
    background-color: #dcdcdc;
    right:16px;
  }

  .companyForm label{
    padding-left:0;
    color:#808080;

  }

  .companyForm input{
    width:69% !important;
    text-align: right;
    font-size:14px;
    padding-right: 0;
  }

  .companyForm .mui-table-view-cell{
    padding:6px 15px;
  }

  .companyForm .mui-table-view-cell:after{
    left:16px;
    right:16px;
    background-color: #dcdcdc;
    transform: scaleY(0.5);

  }

  .companyForm .mui-table-view-cell .modify{
    position: absolute;
    right: 0;
    top:10px;
    color:#c8c8c8;
    font-size:18px;
  }

  .companyForm .unit{
    padding:10px 0;
    float: right;
  }

  .companyForm label{
    width:auto !important;
    max-width:39%;
    padding-right:0;
    line-height: normal;
  }

  .companyForm label .optional{
    color:#c8c8c8;
  }

  .textarea-wrapper {

    margin: 46px 0 0 ;
    height: 164px;
    position: relative;
    border-radius: 5px;
    border: 1px solid #dcdcdc;
    background: #fff;
    padding-bottom: 20px;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 7px;
    font-size: 14px;
    bottom: 5px;
    color: #c8c8c8;
  }

  .textarea-wrapper textarea {
    border: none;
    height: 100%;
    margin: 0;
    padding-bottom: 0;
  }




  .companyForm input::placeholder{
    color:#c8c8c8;
  }

  .companyForm .inputUnit{
    padding:10px;
    margin-right:17px;
  }

  .companyForm .textRight{
    float: right;
    display: inline-block;
  }

  .radioWrapper {
    display: inline-block;
    padding:11px 0 11px 25px;
    margin-left:18px;
  }
  .radioWrapper:first-child{
    margin-left:0;
  }
  .radioWrapper input[type='radio']{
    left:0;
    top:11px;
  }
  .radioWrapper input[type='radio']:before{
    position: absolute;
    left:0px;
    color:#c8c8c8;
    font-size:20px;
  }
  .radioWrapper input[type='radio']:checked:before{
    color:#03aef9;
  }

  .noBottomBorder:after{
    display: none;
  }

  .fileSelect{
    font-size:14px;
    color:#c8c8c8;
    background: #fff;
    padding:11px 15px;
    position: relative;
  }
  .fileSelect .icon{
    position: absolute;
    right:16px;
    color: #03aef9;
    font-size:22px;
  }

  .fileList{
    padding:0 15px 0;
    background: #fff;
    font-size:14px;
  }
  .fileList .item{
    position: relative;
    width:61px;
    height:61px;
    margin-right:6px;
    background-color:#e3e3e3;
    border-radius: 5px;
    display: inline-block;
  }
  .fileList .item img{
    border-radius: 5px;
    width: 100%;
    height: 100%;
  }
  .fileList .icon{
    position: absolute;
    right:-4px;
    top:-4px;
    font-size:18px;
    color:#808080;
  }

  .buttonWrapper{
    padding:7px 16px 30px;
    background: #fff;
    text-align: center;
  }

  .buttonWrapper button{
    display: inline-block;
    width:115px;
    margin-top:10px;
    background: #03aef9;
    border:1px solid #03aef9;
  }

  .buttonWrapper button:disabled{
    background: #dcdcdc;
    border:1px solid #dcdcdc;
    color:#b4b4b6;
    opacity: 1;
  }


</style>
