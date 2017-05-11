<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">推荐专家</h1>
    </header>

    <div id="expert_commend" class="mui-content">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">专家姓名</label>
            <input id="name" type="text" class="mui-input-clear" v-model="expertItem.name" placeholder="必填">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">专家性别</label>
            <input id="gender" type="text" class="mui-input-clear" v-model="expertItem.gender" placeholder="必填">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">从业时间</label>
            <input id="work_years" type="text" class="mui-input-clear" v-model="expertItem.work_years" placeholder="必填">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">行业领域</label>
            <input id="industry_tags" type="text" class="mui-input-clear" v-model="expertItem.industry_tags" placeholder="必填">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">联系电话</label>
            <input id="mobile" type="text" class="mui-input-clear" v-model="expertItem.mobile" placeholder="必填">
          </div>
        </li>

        <li class="mui-table-view-cell">

        </li>
      </ul>
      <div class="account_item_title">
        在这里补充推荐专家信息：
      </div>
      <div class="textarea-wrapper">
        <textarea id="description" v-model.trim="expertItem.description" rows="5" class="mui-input-clear" placeholder="描述"></textarea>
        <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
      </div>
      <div class="account_item_title">
        上传专家名片：
      </div>
      <div id='image-list' class="row image-list"></div>
      <div class="mui-table-view">
        <div class="mui-table-view-cell footer">
          <button type="button" id="submit" class="mui-btn-block mui-btn-primary">
            提交
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import {createAPI, apiRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';

  export  default {
    data: () => ({
      descMaxLength: 2000,
      expertItem: {
        name: '',
        gender: '',
        work_years: '',
        mobile: '',
        industry_tags: '',
        description: '',
        head_img: ''
      }
    }),
    created () {

    },
    computed: {
      descLength() {
        if(this.expertItem.description)
          return this.expertItem.description.length;
        else return 0;
      }
    },
    methods: {

    },
    mounted(){
      mui('.mui-switch')['switch']();
      var imageIndexIdNum = 0;
      var index = 1;
      var feedback = {
        imageList: document.getElementById('image-list'),
        submitBtn: document.getElementById('submit'),
        description: document.getElementById('description'),
        name: document.getElementById('name'),
        gender: document.getElementById('gender'),
        work_years: document.getElementById('work_years'),
        mobile: document.getElementById('mobile'),
        industry_tags: document.getElementById('industry_tags')
      };
      feedback.files = [];
      feedback.uploader = null;
      feedback.getFileInputArray = function() {
        return [].slice.call(feedback.imageList.querySelectorAll('.file'));
      };
      feedback.addFile = function(path) {
        feedback.files.push({name:"images"+index,path:path,id:"img-"+index});
        index++;
      };
      /**
       * 初始化图片域占位
       */
      feedback.newPlaceholder = function() {
        var fileInputArray = feedback.getFileInputArray();
        if (fileInputArray &&
          fileInputArray.length > 0 &&
          fileInputArray[fileInputArray.length - 1].parentNode.classList.contains('space')) {
          return;
        };
        imageIndexIdNum++;
        var placeholder = document.createElement('div');
        placeholder.setAttribute('class', 'image-item space');
        var up = document.createElement("div");
        up.setAttribute('class','image-up')
        //删除图片
        var closeButton = document.createElement('div');
        closeButton.setAttribute('class', 'image-close');
        closeButton.innerHTML = 'X';
        closeButton.id = "img-"+index;
        //小X的点击事件
        closeButton.addEventListener('tap', function(event) {
          setTimeout(function() {
            for(var temp=0;temp<feedback.files.length;temp++){
              if(feedback.files[temp].id==closeButton.id){
                feedback.files.splice(temp,1);
              }
            }
            feedback.imageList.removeChild(placeholder);
          }, 0);
          return false;
        }, false);

        //
        var fileInput = document.createElement('div');
        fileInput.setAttribute('class', 'file');
        fileInput.setAttribute('id', 'image-' + imageIndexIdNum);
        fileInput.addEventListener('tap', function(event) {
          var self = this;
          var index = (this.id).substr(-1);

          plus.gallery.pick(function(e) {
//				console.log("event:"+e);
            var name = e.substr(e.lastIndexOf('/') + 1);
            console.log("name:"+name);

            plus.zip.compressImage({
              src: e,
              dst: '_doc/' + name,
              overwrite: true,
              quality: 50
            }, function(zip) {
              size += zip.size
              console.log("filesize:"+zip.size+",totalsize:"+size);
              if (size > (10*1024*1024)) {
                return mui.toast('文件超大,请重新选择~');
              }
              if (!self.parentNode.classList.contains('space')) { //已有图片
                feedback.files.splice(index-1,1,{name:"images"+index,path:e});
              } else { //加号
                placeholder.classList.remove('space');
                feedback.addFile(zip.target);
                feedback.newPlaceholder();
              }
              up.classList.remove('image-up');
              placeholder.style.backgroundImage = 'url(' + zip.target + ')';
            }, function(zipe) {
              mui.toast('压缩失败！')
            });



          }, function(e) {
            mui.toast(e.message);
          },{});
        }, false);
        placeholder.appendChild(closeButton);
        placeholder.appendChild(up);
        placeholder.appendChild(fileInput);
        feedback.imageList.appendChild(placeholder);
      };

      feedback.newPlaceholder();

      feedback.submitBtn.addEventListener('tap', function(event) {

        if (feedback.description.value.length > 2000) {
          return mui.toast('信息超长,请重新填写~')
        }
        //判断网络连接
        if(plus.networkinfo.getCurrentType()==plus.networkinfo.CONNECTION_NONE){
          return mui.toast("连接网络失败，请稍后再试");
        }
        feedback.send(mui.extend({}, feedback.deviceInfo, {
          description: feedback.description.value,
          name: feedback.name.value,
          gender: feedback.gender.value,
          work_years: feedback.work_years.value,
          mobile: feedback.mobile.value,
          industry_tags: feedback.industry_tags.value,
          images: feedback.files,
        }))
      }, false);

      feedback.send = function(content) {
        feedback.uploader = plus.uploader.createUpload(createAPI('expert/apply'), {
          method: 'POST'
        }, function(upload, status) {
//			plus.nativeUI.closeWaiting()
          console.log("upload cb:"+upload.responseText);
          if(status==200){
            var data = JSON.parse(upload.responseText);
            //上传成功，重置表单
            if (data.status === 1000) {
//					mui.toast('反馈成功~')
              console.log("upload success");
//					feedback.clearForm();
            }
          }else{
            console.log("upload fail");
          }

        });
        const UserLoginInfo = localEvent.getLocalItem('UserLoginInfo');
        feedback.uploader.setRequestHeader('Authorization', 'bearer ' + UserLoginInfo.token);
        //添加上传数据
        mui.each(content, function(index, element) {
          if (index !== 'images') {
            console.log("addData:"+index+","+element);
//				console.log(index);
            feedback.uploader.addData(index, element)
          }
        });
        //添加上传文件
        mui.each(feedback.files, function(index, element) {
          var f = feedback.files[index];
          console.log("addFile:"+JSON.stringify(f));
          feedback.uploader.addFile(f.path, {
            key: f.name
          });
        });
        //开始上传任务
        feedback.uploader.start();
        mui.alert("感谢推荐，点击确定关闭","专家推荐","确定",function () {
          mui.back();
        });
//		plus.nativeUI.showWaiting();
      };

    }
  }

</script>

<style scoped>

  .mui-table-view {
    margin-top: 15px;
  }

  .myinfo li{
    color:#101010;
    padding-top:13px;
    padding-bottom:13px;
  }

  .myinfo > .mui-table-view:first-child{
    margin-top:0;
  }

  .my-header p{
    margin-top:5px;
    color:#fff;
    font-size:16px;
    font-weight:bold;
  }

  .expert-setting-field {
    position: absolute;
    text-align: right;
    font-size: 12px;
    width: 200px;
    right: 40px;
    color: #3f51b5;
  }

  .mui-table-view-cell .mui-navigate
  {
    color: #999;
  }

  .account_item_title {
    padding: 5px;
    color: #a6a6a6;
    font-size: 12px;
  }
  .textarea-wrapper {
    padding:2px;
    height:100%;
    position: relative;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 4px;
    font-size:12px;
    bottom: 10px;
    color: #b0b0b0;
  }

  .textarea-wrapper textarea {
    border-radius: 5px;
    margin:0;
  }

  .image-list {
    width: 100%;
    height: 85px;
    background-size: cover;
    padding: 10px 10px;
    overflow: hidden;
  }
  .image-item {
    width: 65px;
    height: 65px;
    /*background-image: url(../images/iconfont-tianjia.png);*/
    background-size: 100% 100%;
    display: inline-block;
    position: relative;
    border-radius: 5px;
    margin-right: 10px;
    margin-bottom: 10px;
    border: solid 1px #e8e8e8;
    vertical-align: top;
  }
  .image-item .file {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 0;
  }
  .image-item.space {
    border: none;
  }
  .image-item .image-close {
    position: absolute;
    display: inline-block;
    right: -6px;
    top: -6px;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    border-radius: 12px;
    background-color: #FF5053;
    color: #f3f3f3;
    border: solid 1px #FF5053;
    font-size: 9px;
    font-weight: 200;
    z-index: 1;
  }
  .image-item .image-up{
    height: 65px;
    width: 65px;
    border-radius: 10px;
    line-height: 65px;
    border: 1px solid #ccc;
    color: #ccc;
    display: inline-block;
    text-align: center;
  }
  .image-item .image-up:after{
    font-family: "微软雅黑";
    content: '+';
    font-size: 60px;
  }
</style>
