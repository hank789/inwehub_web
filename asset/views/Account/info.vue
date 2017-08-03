<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的名片</h1>
      <!--<a class="mui-icon myicon myicon-share mui-pull-right"></a>-->
    </header>

    <div class="mui-content" v-show="!loading">
     
     <div class="info-professor">
     	<div class="info-look" @tap.stop.prevent="$router.pushPlus('/my/resume')">
     		<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-gongkai"></use>
			</svg>
			<span>预览</span>
     	</div>
     	<p  @tap.stop.prevent="show">
     		<img :src="user.info.avatar_url" class="avatar"/>
     		<span>
     		<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-xiangji"></use>
			</svg>
			</span>
     	</p>
     	<p>
     		<span>{{ user.info.name }}</span>
     		<svg class="icon" aria-hidden="true">
			  <use xlink:href="#icon-zhuanjiabiaoji"></use>
			</svg>
     	</p>
     	<p>
     		<span>{{ user.info.company }}</span>
     		<i></i>
     		<span>{{ user.info.title }}</span>
     	</p>
     	<p>
     	  {{ user.info.mobile }}
     	</p>
     	<p>
     		{{ user.info.email }}
     	</p>
     	<p>
     		<span class="info-progress"><i  :style="'width:'+ user.info.account_info_complete_percent +'%'"></i></span>
     		<span class="info-text">已编辑{{ user.info.account_info_complete_percent }}%</span>
     	</p>
     </div>

      <div class="part3">
        <ul class="mui-table-view mui-table-view-chevron firstItem">
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/basic')">基本资料
                <span class="desc important">{{ user.infos }}</span>
            </a>

          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/jobs')">工作经历
              
            </a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/projects')">项目经历
               
            </a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/edus')">教育经历
                
            </a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/trains')">培训认证
                
            </a>
          </li>
          <li class="mui-table-view-cell">
            <a class="mui-navigate-right" @tap.stop.prevent="$router.pushPlus('/my/info/privacy')"><span class="mui-icon myicon myicon-help"></span>隐私设置
             
            </a>
          </li>
        </ul>
      </div>

      <div class="paizhao">
        填写嫌麻烦，可发送简历到 <a class="mailLink" href="mailto:hi@inwehub.com?subject=简历维护：用户姓名+注册手机号码">hi@inwehub.com</a> ,小哈帮您维护！
       </div>
       
        
    <div class="info-choose mui-popover mui-popover-action mui-popover-bottom" id="mui-popover-action">
    	   <p @tap.stop.prevent="changeAvatarH5">
    	   	 <svg class="icon" aria-hidden="true">
		     <use xlink:href="#icon-xiangce"></use>
		 </svg>
		 <span>相册</span>
    	   </p>
	   <p @tap.stop.prevent="changeAvatar">
	   	 <svg class="icon" aria-hidden="true">
		   <use xlink:href="#icon-xiangji"></use>
		 </svg>
		  <span>相机</span>
	   </p>
	</div>
	</div>
   
       
    </div>
  </div>
</template>

<script>
  import {NOTICE, USERS_APPEND} from '../../stores/types';
  import {apiRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';
  import ACCOUNT_API from '../../api/account';
  import {updateUserInfoCache, getUserInfo} from '../../utils/user';
  export default {
    data: () => ({
      user: {
        info: {
          name:'',
          gender:'',
          company:'',
          title:'',
          province:'',
          city:'',
          hometown_city:'',
          hometown_province:'',
          account_info_complete_percent:0,
          address_detail:'',
          email:'',
          birthday:'',
          description:'',
          industry_tags:[],
        },
      },
      loading: true,
      loading_gif: loading_gif
    }),
    created () {
      showInwehubWebview();
      this.getUserInfo();
    },
    mounted(){
      window.addEventListener('refreshData', (e)=>{
        //执行刷新
        console.log('refresh-info');
        this.getUserInfo();
      });
    },
    methods: {
    	show(){
    		
			mui(".info-choose").popover('toggle'); 
		   
		    
    	},
      warning:function(){
          mui.confirm("<div style='text-align: left'>InweHub是一个真实诚信的社区，每一位用户的信息都真实有效，我们保证对平台所有个人信息绝对保密，绝不会提供给任何第三方，平台中个人信息的开放范围完全取决于用户个性的设置，默认值为不开放。\n【注意】您填写个人信息时务必真实，如发现虚假信息，第一次将给予警告，第二次发现将永久封号。</div>", '警告说明', ['我已了解', '继续补充'], function(){}, 'div');
      },
      uploadAvatar:function(){
        if (mui.os.plus) {
          this.changeAvatar();
        } else {
          this.changeAvatarH5();
        }
      },
      changeAvatarH5:function(){
        let fileInput = document.body.querySelector('input.upload-avatar[type=file]');
        if (fileInput == null) {
          fileInput = document.createElement('input');
          fileInput.setAttribute('type', 'file');
          fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/jpg, image/bmp, image/x-icon');
          fileInput.classList.add('upload-avatar');
          fileInput.addEventListener('change', () => {
            if (fileInput.files != null && fileInput.files[0] != null) {

              var file = fileInput.files[0];

              var size = file.size/1000;  //kb
              if (size > 5120) {
                mui.alert('图片单张不允许超过5M！');
                return false;
              }

              let reader = new FileReader();
              reader.onload = (e) => {
                fileInput.value = "";

                this.$router.push({path:'/header-h5', params:{file:file}}, function(router){
                  router.params.file = e.target.result;
                });
              }
              reader.readAsDataURL(file);

            }
          });
          document.body.appendChild(fileInput);
        }
        fileInput.click();
      },
      changeAvatar:function(){
        if (mui.os.plus) {
          var a = [{
            title: "拍照"
          }, {
            title: "从手机相册选择"
          }];
          plus.nativeUI.actionSheet({
            title: "修改头像",
            cancel: "取消",
            buttons: a
          }, (b) => {
            switch (b.index) {
              case 0:
                break;
              case 1:
                this.getImage();
                break;
              case 2:
                this.galleryImg();
                break;
              default:
                break
            }
          })
        }
      },
      uploadFile(){
          mui.alert('开发中');
      },
      getImage:function(){
        var t = this;
        var c = plus.camera.getCamera();
        c.captureImage(function (e) {
          t.toClip(e);

        }, function (s) {
          console.log("error" + s);
        }, {
          filename: "_doc/head.jpg"
        })
      },
      toClip(path)
      {
        var t = this;
        plus.zip.compressImage({
            src: path,
            dst: "_doc/c.jpg",
            overwrite: true,
            quality: 20
          },
          function (event) {

            var newurl = plus.io.convertLocalFileSystemURL(event.target);
            if (mui.os.ios) {
              newurl = 'file://' + newurl;
            }

            plus.io.resolveLocalFileSystemURL(newurl, function (entry) {
              t.localUrl = entry.toRemoteURL();
              localEvent.setLocalItem('avatar', {url: t.localUrl, path: entry.toLocalURL()});
              t.$router.push('/header');
            }, function (error) {
              alert(error.message);
            });
          }, function (error) {
            alert("Compress error!" + error.message);
          });
      },
      galleryImg:function(){
        plus.gallery.pick((a) => {
          this.toClip(a);
        }, function (a) {
        }, {
          filter: "image"
        })
      },
      getUserInfo()
      {

        this.$store.dispatch(USERS_APPEND, cb => getUserInfo(null, user => {
          cb(user);

          var newJobs = [];
          for (var i in user.jobs) {
            var info = user.jobs[i];
            var id = info.id;
            newJobs[id] = info;
          }
          localEvent.setLocalItem('jobs', newJobs);


          var newProjects = [];
          for (var i in user.projects) {
            var info = user.projects[i];
            var id = info.id;
            newProjects[id] = info;
          }
          localEvent.setLocalItem('projects', newProjects);


          var newEdus = [];
          for (var i in user.edus) {
            var info = user.edus[i];
            var id = info.id;
            newEdus[id] = info;
          }
          localEvent.setLocalItem('edus', newEdus);


          var newTrains = [];
          for (var i in user.trains) {
            var info = user.trains[i];
            var id = info.id;
            newTrains[id] = info;
          }
          localEvent.setLocalItem('trains', newTrains);

          this.work_city = user.info.province.name + ' ' + user.info.city.name;
          this.home_city = user.info.hometown_province.name + ' ' + user.info.hometown_city.name;

          this.user = user;
          this.loading = 0;

        }));
      }
    }
  }
</script>
<style scoped>
  .mui-bar .myicon {
    width: 16px;
    height: 16px;
    right: 8px;
    top: 8px;
  }
  p,span{
  	margin: 0;
  	padding: 0;
  }
.info-professor{
	width: 100%;
	padding:20px 15px 20px 16px;
	background: #F3F4F6;
	text-align: center;
	position: relative;
}
.info-look{
	position: absolute;
	top: 20px;
	right: 15px;
}
.info-look svg{
	font-size: 24px;
	color: rgb(3,174,249);
	margin-bottom: -2px;
}
.info-look span{
	font-family: "PingFangSC";
	font-size:14px;
	color:#444444;
	
}
 .info-professor p:nth-of-type(1) img{
 	width: 69px;
 	height: 69px;
 	border-radius: 50%;
 }
 .info-professor p:nth-of-type(1) span{
 	display:inline-block;
 	width: 18px;
 	height:18px;
 	border-radius: 50%;
 	background: #FFFFFF;
 	margin-left: -18px;
    margin-bottom:6px;
    position: relative;
 }
 .info-professor p:nth-of-type(1) span svg{
   font-size: 25px;
   color:#808080;
   position: absolute;
   left: -4px;
   top: -3px;
  
	}
.info-professor p:nth-of-type(2){
	margin-top: 12px;
}
.info-professor p:nth-of-type(2) span{
	font-family: "PingFangSC";
	font-size: 16px;
	font-weight: 600;
	color:#444444;
}
.info-professor p:nth-of-type(2) svg{
	font-size: 20px;
	color: rgb(3,174,249);
	margin-bottom: -2px;
	
}
.info-professor p:nth-of-type(3){
	margin-top: 7px;
}
.info-professor p:nth-of-type(3) span{
	font-family: "PingFangSC";
	font-size: 13px;
	color: #444444;
}
.info-professor p:nth-of-type(3) i{
	display: inline-block;
	width: 1px;
	height: 13px;
	background:#c8c8c8;
	margin: 0 3px -2px 3px;
}
.info-professor p:nth-of-type(4){
	margin-top: 7px;
}
.info-professor p:nth-of-type(5){
	margin-top: 6px;
	margin-bottom: 8px;
}

.info-professor p:nth-of-type(4),.info-professor p:nth-of-type(5){
	font-family: "PingFangSC";
	font-size: 14px;
	color: #444444;

	
}
.info-professor p:nth-of-type(6) .info-progress{
	display: inline-block;
	width: 70%;
	height: 12px;
	border:1px solid rgb(3,174,249);
	border-radius: 50px;
	margin-right: 10px;
	margin-bottom: -3px;
	overflow: hidden;
	
}
.info-professor p:nth-of-type(6) .info-progress>i{
	font-style: normal;
	display: inline-block;
	width: 80px;
	height:13px;
	background: rgb(3,174,249);
	margin-bottom: 3px;
	margin-left: -161px;
}
.info-professor p:nth-of-type(6) .info-text{
	font-family: "PingFangSC";
	font-size:12px;
	color:#808080;
}
  .paizhao {
  	width: 100%;
	height:100px;
	background: #FFFFFF;
	padding: 19px 12px 0 12px;
  	
  	font-family: "PingFangSC";
	font-size:12px;
	color: rgb(128,128,128);
	

  }
  .part3 .desc {
    margin-left: 40px;
    font-size: 12px;
  }

  .part3 .important {
    color: #F6A623;
  }
  
  .info-choose{
  	width: 100%;
  	height:95px;
  	background: #FFFFFF;
  	position: absolute;
  	bottom: 0;
  	padding-top:13px;
  	padding-left: 39px;
  	z-index: 999;
  	display: none;
   
  }
  .info-choose p{
  	width: 45px;
  	height: 71px;
    float: left;
  	
  }
.info-choose p:nth-of-type(2){
	margin-left: 36px;
}
.info-choose p svg{
	font-size: 48px;
	color: rgb(220,220,220);
}

.info-choose p span{
	display: block;
	margin-left: 10px;
	margin-top: 2px;
	color:#808080;
	font-size: 13px;
	
}

#mui-popover-action{
	background: #FFFFFF;
}

  @media (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) {
    .part2 .progressBar{
        width:160px !important;
    }
  }

  @media (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) {
    .part2 .progressBar{
      width:160px !important;
    }
  }
</style>
