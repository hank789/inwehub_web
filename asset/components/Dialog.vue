<template>
    <div :style="style">
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


    </div>
</template>
<script type="text/javascript">
  export default {
    data () {
      return {
        style:'display:none',
        options: {
            ok:'test',
            level:'',
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
      width:100%;
      height:100%;
      background-color:#CCCCCC;
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
</style>
