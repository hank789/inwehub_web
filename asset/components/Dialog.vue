<template>
    <div :style="style">
        <!--级别限制提示的弹窗-->
        <div id="test">
           <div class="p-level">
             <svg class="icon" aria-hidden="true"><use xlink:href="#icon-xitongbengkuimeiyouwangluo"></use></svg>
             <p>努努力 升升级 即可解锁功能</p>
             <p>
             	<span>当前等级</span>
             	<span>{{ options.level?options.level:''}}</span>
             </p>
            <!--  {{ options.level?options.level:''}}-->
            </div>
        </div>
        <!-- 升级的弹窗-->
        <div id="p-upgrade">
        	    <div class="p-upgrade">
        	    	   <div class="upgrade_t">
        	    	   	  <p><span>恭喜你升级L{{options.level?options.level:''}}</span>
        	    	   	  	<span>{{options.level?options.level:''}}</span>
        	    	   	  </p>
        	    	   	  <p>以下特权已解锁</p>
        	    	   </div>
        	    	   <div class="upgrade_b">
        	    	   	   <p v-if="options.level =='1'">
        	    	   	   	 <svg class="icon" aria-hidden="true"><use xlink:href="#icon-chengchangye-zhuanyewenda"></use></svg>
        	    	   	   	 <span>专业问答</span>
        	    	   	   </p>
        	    	   	   <p v-if="options.level =='1'">
        	    	   	   	 <svg class="icon" aria-hidden="true"><use xlink:href="#icon-chengchangye-hudongpinglun"></use></svg>
        	    	   	   	 <span>评论互动</span>
        	    	   	   </p>
        	    	   	   <p v-if="options.level =='2'">
        	    	   	   	 <svg class="icon" aria-hidden="true"><use xlink:href="#icon-chengchangye-baominghuodong"></use></svg>
        	    	   	   	 <span>活动报名</span>
        	    	   	   </p>
        	    	   	   <p v-if="options.level =='2'">
        	    	   	   	 <svg class="icon" aria-hidden="true"><use xlink:href="#icon-chengchangye-baominghuodong"></use></svg>
        	    	   	   	 <span>活动报名</span>
        	    	   	   </p>
        	    	   	   <p v-if="options.level =='3'">
        	    	   	   	 <svg class="icon" aria-hidden="true"><use xlink:href="#icon-chengchangye-fabuqiyexuqiu"></use></svg>
        	    	   	   	 <span>企业需求对接</span>
        	    	   	   </p>
        	    	   	   <p v-if="options.level =='3'">
        	    	   	   	 <svg class="icon" aria-hidden="true"><use xlink:href="#icon-wendashequ"></use></svg>
        	    	   	   	 <span>问答社区</span>
        	    	   	   </p>
        	    	   	    <p v-if="options.level =='3'">
        	    	   	   	 <svg class="icon" aria-hidden="true"><use xlink:href="#icon-xiangmujiyu"></use></svg>
        	    	   	   	 <span>项目机遇</span>
        	    	   	   </p>
        	    	   	   <p v-if="options.level =='3'">
        	    	   	   	 <svg class="icon" aria-hidden="true"><use xlink:href="#icon-chengchangye-zhuanshumishu"></use></svg>
        	    	   	   	 <span>专属秘书</span>
        	    	   	   </p>
        	    	   	   <p v-if="options.level =='4'">
        	    	   	   	 <svg class="icon" aria-hidden="true"><use xlink:href="#icon-fujinqiye"></use></svg>
        	    	   	   	 <span>附近企业</span>
        	    	   	   </p>
        	    	   	   <p v-if="options.level =='4'">
        	    	   	   	 <svg class="icon" aria-hidden="true"><use xlink:href="#icon-gengduozhuanjia"></use></svg>
        	    	   	   	 <span>更多专家</span>
        	    	   	   </p>
        	    	   </div>
        	    	   <div class="upgrade_btn alertConfirm">确定</div>
        	    </div>
        </div>
         <!-- 领取新手任务-->
         <div id="p-task">
         <div class="p-task">
             <div class="task_t">
             	<p>快来领取新手任务!</p>
             	<p>完成任务参与积分奖励，升级L2获取新特权！</p>
             </div>
             
             <ul class="task_b">
             	<li>
             		<p>完善顾问名片</p>
             		<p>个人信息保持90%以上完整度</p>
             	</li>
             	<li>
             		<p>参与评论互动</p>
             		<p>前往发现阅读，参与评论</p>
             	</li>
             	<li>
             		<p>发起专业提问</p>
             		<p>送你首次提问1元特惠卷</p>
             	</li>
             </ul>
             <div class="task_btn alertConfirm">确定</div>
         </div>
         </div>
 		       

    </div>
</template>
<script type="text/javascript">
  export default {
    data () {
      return {
        style:'display:none',
        options: {
            ok:'test',
            level:3,
        },
      }
    },
    created(){
        if (this.$route.path == '/dialog/list') {
            this.style = '';
        }  else {
            this.style = 'display:none';
        }
    },
    methods: {
      getHtml(id, options, callback) {
          this.options = options;
          this.$nextTick(() => {
            var obj = document.getElementById(id);
            if (obj) {
              callback(obj.innerHTML.toString().trim().replace(/\n/g, ''));
            } else {
              callback('');
            }
          })
      }
    }
  };
</script>

<style scoped="scoped">
    #test{
      width: 240px;
      height: 110px;
      border: 1px solid #007AFF;
    }
    ul,li,p,span,a,i{
   	margin: 0;
   	padding: 0;
   	list-style: none;
   }
/*显示等级弹窗样式*/
.p-level{
	width: 240px;
	height: 110px;
	/*background: #CCCCCC;*/
	text-align: center;
}
.p-level >svg{
	font-size: 50px;
}

.p-level >p:nth-of-type(1){
	font-size: 16px;
	color: #444444;
	margin-top: 10px;
	width: 100%;
    height: 20px;
    text-align: center;
    line-height: 20px;
}

.p-level >p:nth-of-type(2){
	width: 36%;
	margin-left: 32%;
	height: 20px;
	margin-top: 3px;
	/*background: #CCCCCC;*/
}

.p-level >p:nth-of-type(2) span:nth-of-type(1){
	display: block;
	width: 80%;
	height: 100%;
	float: left;
	font-size: 14px;
	color: #b4b4b6;
}
.p-level >p:nth-of-type(2) span:nth-of-type(2){
	display: block;
	float: left;
	width: 20%;
	height: 100%;
	background:url(../statics/images/rank.png) no-repeat;
	background-size: 100%;
	margin-top: 2px;
    text-align: center;
    line-height: 12px;
    color: #FFFFFF;
}


/*升级的弹窗*/
  #p-upgrade {
  	  width: 240px;
      /*height: 160px;*/
      border: 1px solid #009689;
  }
  .p-upgrade{
  	width: 240px;
    /*height: 160px;*/
   
  }
  .upgrade_t{
  	width: 100%;
  	height: 65px;
  	border-bottom: 0.5px dashed #DCDCDC;
  }
   .upgrade_t p:nth-of-type(1){
   	width: 60%;
   	margin-left: 20%;
   	height: 21px;
   	
   }
  .upgrade_t p:nth-of-type(1) span:nth-of-type(1){
  	color: #03aef9;
  	font-size: 19px;
  	float: left;
  	width: 85%;
  	/*background: #007AFF;*/
  }
  .upgrade_t p:nth-of-type(1) span:nth-of-type(2){
  	width: 15%;
  	height: 100%;
  	background:url(../statics/images/rank.png) no-repeat;
	background-size: 100%;
	float: left;
	text-align: center;
	line-height: 18px;
	color: #FFFFFF;
	}
	
   .upgrade_t p:nth-of-type(2){
   	width: 50%;
   	margin-left: 20%;
   	text-align: center;
	line-height: 18px;
   	margin-top: 3px;
   	font-size: 14px;
   	color: #808080;
   }
   .upgrade_b{
   	width: 100%;
   	/*height: 95px;*/
   	overflow: hidden;
   	text-align: center;
   	border-bottom:0.5px solid #DCDCDC ;
   }
   .upgrade_b > p{
   	width: 27%;
   	height: 100px;
   	float: left;
   	margin-left: 4.75%;
   }
   .upgrade_b > p svg{
   	 font-size: 40px;
   	 color:#fcc916;
   	 margin-top: 18px;
   }
   .upgrade_b > p span{
   	 display: block;
   	 font-size:13px ;
   	 color:#444444;
   }
   .upgrade_btn{
   	width:100%;
   	height: 50px;
   	/*background: #CCCCCC;*/
   	text-align: center;
   	line-height: 50px;
   	color: #03aef9;
   	font-size: 16px;
   }
   
   /*领取新手任务*/
   #p-task{
  	width: 245px;
    height: 320px;
   
  }
  .p-task{
  	width: 245px;
    height: 320px;
    border: 1px solid #ffffff;
  }
  .task_t{
  	width: 100%;
  	height: 49px;
  	
  }
  .task_t p:nth-of-type(1){
  	color: #03aef9;
  	font-size: 16px;
  	font-weight: 500;
  	text-align: center;
  	
  }
  .task_t p:nth-of-type(2){
  	color: #808080;
  	font-size: 12px;
  	text-align: center;
  	
  }
  .task_b{
  	width: 100%;
  	height:231px;
  	margin: 0;
  }
  .task_b li{
  	width: 100%;
  	height: 77px;
  	text-align: center;
  	border-bottom: 0.5px solid #DCDCDC;
  	padding-top: 17px;
  }
  .task_b li p:nth-of-type(1){
  	width: 100%;
     text-align: center;
  	font-size: 16px;
  	color: #444444;
  
  }
   .task_b li p:nth-of-type(2){
  	font-size: 14px;
  	color: #808080;
  }
  
  
  .task_btn{
   	width:100%;
   	height: 50px;
   	/*background: #CCCCCC;*/
   	text-align: center;
   	line-height: 50px;
   	color: #03aef9;
   	font-size: 16px;
   }

</style>
