<template>
  <div>
    <div class="mui-content">
      <div class="projectPreviewCard" >
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <div class="header">
          <div class="avatar">
            <div class="avatarInner"><img class="avatar"
                                          src="http://wx.qlogo.cn/mmopen/PiajxSqBRaEIVaaLLXibu2J52gbpia5qw1VsJdoPmYVoaaB90xEWZHJJkYHe8mBwjictcjpPOONQ0VI8RicDqrpQf6g/0">
            </div>
          </div>
        </div>
        <div class="title">Inwehub平台搭建</div>
        <div class="titleSub">郭大红<i class="separate"></i>樱维信息</div>
        <div class="state">项目已立项，就等顾问来操刀</div>
      </div>
      <div class="section">
        <h5>项目简介</h5>
        <div class="contentWrapper">
          <div class="item">
            <div class="title">项目类型：</div>
            <div class="content">一次性项目</div>
          </div>
          <div class="item">
            <div class="title">项目描述：</div>
            <div class="content">从事计算机信息科技、网络科技、电子科技通信科技领域内的技术开发、技术咨询、技术服务、技术转让，市场信息咨询</div>
          </div>
          <div class="toggle show"></div>
          <div class="item">
            <div class="title">上传附件：</div>
            <div class="content files"><img width="58" height="58"
                                            src="http://wx.qlogo.cn/mmopen/PiajxSqBRaEIVaaLLXibu2J52gbpia5qw1VsJdoPmYVoaaB90xEWZHJJkYHe8mBwjictcjpPOONQ0VI8RicDqrpQf6g/0"><img
              width="58" height="58"
              src="http://wx.qlogo.cn/mmopen/PiajxSqBRaEIVaaLLXibu2J52gbpia5qw1VsJdoPmYVoaaB90xEWZHJJkYHe8mBwjictcjpPOONQ0VI8RicDqrpQf6g/0">
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <h5>具体需求</h5>
        <div class="contentWrapper">
          <div class="nav">
            <div class="navWrapper mui-row">
              <div class="mui-col-sm-6 mui-col-xs-6" @tap.stop.prevent="goSubmitRequirement()">
                <div class="row1">5.0万</div>
                <div class="row2">项目预算<span>（包含差旅费）</span></div>
              </div>
              <div class="line"></div>
              <div class="mui-col-sm-6 mui-col-xs-6" @tap.stop.prevent="goRequirement()">
                <div class="row1">2017/8/12</div>
                <div class="row2">项目开始时间</div>
              </div>
            </div>
          </div>
          <table>
            <tr>
              <td class="tdTitle" width="70">顾问数量：</td>
              <td class="tdContent" width="101">3</td>
              <td class="tdTitle" width="70">项目周期：</td>
              <td class="tdContent">2-4周</td>
            </tr>
            <tr>
              <td class="tdTitle">计费模式：</td>
              <td class="tdContent">按人头天数</td>
              <td class="tdTitle">工作密度：</td>
              <td class="tdContent">2H/W</td>
            </tr>
            <tr>
              <td class="tdTitle">顾问级别：</td>
              <td class="tdContent">高级</td>
              <td class="tdTitle">远程工作：</td>
              <td class="tdContent">可接受</td>
            </tr>
            <tr>
              <td class="tdTitle">工作地点：</td>
              <td class="tdContent" colspan="3">江苏南京；上海</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="section">
        <h5>企业信息</h5>
        <div class="contentWrapper">
          <div class="item">
            <div class="title">企业名称：</div>
            <div class="content">樱维信息</div>
          </div>
          <div class="selectedWrapper"><span class="selected">专业服务</span><span class="selected">生命科学行业</span></div>
          <div class="description">
            从事计算机信息科技、网络科技、电子科技、通信科技领域内的技术开发、技术咨询、技术服务、技术转让，市场信息咨询与调查（不得从事社会调查、社会调研、民意调查、民意测验），企业管理咨询，电子商务（不得从事金融业务）
          </div>
          <div class="item">
            <div class="title">项目对接：</div>
            <div class="content">发布者本人（武浩）</div>
          </div>
          <div class="item">
            <div class="title">对接职位：</div>
            <div class="content">策划</div>
          </div>
          <div class="item">
            <div class="title">对接手机：</div>
            <div class="content">18010008800</div>
          </div>
          <div class="item">
            <div class="title">对接邮箱：</div>
            <div class="content">hao.wu@inwehub.com</div>
          </div>
          <div class="item">
            <div class="title">开票抬头：</div>
            <div class="content colorC8">樱维信息</div>
          </div>
          <div class="item">
            <div class="title">开户银行：</div>
            <div class="content colorC8">招商银行</div>
          </div>
          <div class="item">
            <div class="title">开户账户：</div>
            <div class="content colorC8">12812778898</div>
          </div>
          <div class="item">
            <div class="title">纳税识别号：</div>
            <div class="content content-5 colorC8">28998879</div>
          </div>
        </div>
      </div>
      <div class="section">
        <h5>需求偏好</h5>
        <div class="contentWrapper">
          <div class="requirement">
            <svg class="icon one" aria-hidden="true">
              <use xlink:href="#icon-gongkai"></use>
            </svg>
            需要查看顾问简历

            <svg class="icon two" aria-hidden="true">
              <use xlink:href="#icon-xuyaoguwentoudishenqing"></use>
            </svg>
            需要顾问投递申请

          </div>
          <div class="item">
            <div class="title">资质要求</div>
            <div class="content">
              <div class="li">建筑业企业资质等级标准是建筑业企业资质的一个分级标准。</div>
              <div class="li">建筑业企业资质</div>
            </div>
          </div>
          <div class="item">
            <div class="title">其他条件</div>
            <div class="content">
              <div class="li">建筑业企业资质</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {apiRequest, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';

  export default {
    data(){
      return {
        project_id:null,
        info:{},
        loading: 1
      }
    },
    computed: {

    },
    methods: {

    },
    mounted(){

    },

    created(){
      this.project_id = this.$route.query.id;
      if (!this.project_id) {
        mui.back();
      }

      postRequest(`project/info`, {
        id:this.project_id
      }).then(response => {
        var code = response.data.code;
        if (code !== 1000) {
          mui.alert(response.data.message);
          return;
        }

        this.info = response.data.data;
      });
    }
  };
</script>

<style scoped>
  .projectPreviewCard {
    background: #b4b4b6;
    height: 196.5px;
    text-align: center;
    color: #fff;
  }

  .projectPreviewCard a {
    position: absolute;
    z-index:777;
    color: #fff;
    font-size: 30px;
    top: 12px;
    left: 6px;
  }

  .projectPreviewCard .header {
    position: relative;
    height: 92px;
  }

  .projectPreviewCard .header .avatar {
    position: absolute;
    left: 50%;
    margin-top: 13px;
    margin-left: -36.5px;
    z-index: 9;
    color: #ffffff;
    display: inline-block;
    height: 73.5px;
    width: 73.5px;
    font-size: 20px;
    text-align: center;
    border-radius: 50%;
    vertical-align: top;
  }

  .projectPreviewCard .header .avatar .avatarInner {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: 100%;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  .projectPreviewCard .header .avatar img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
  }

  .projectPreviewCard .title {
    margin-top: 20px;
    font-size: 17px;
  }

  .projectPreviewCard .titleSub {
    font-size: 14px;
    margin: 3px 0;
  }

  .projectPreviewCard .state {
    font-size: 14px;
  }

  .projectPreviewCard i.separate {
    display: inline-block;
    position: relative;
    top: 2px;
    height: 14px;
    margin: 0 8px;
    border-left: 1px solid #c8c8c8;
  }

  .section {
    background: #fff;
    margin-top: 10px;
    padding: 0 16px 9px;
  }

  .section h5 {
    position: relative;
    font-size: 16px;
    color: #444;
    padding: 19px 0;
  }

  .section h5:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    background-color: #dcdcdc;
  }

  .section .contentWrapper {
    margin-top: 15px;
  }

  .section .contentWrapper .toggle {
    position: relative;
    font-size: 13px;
    height: 8px;
  }

  .section .contentWrapper .toggle.show:after {
    border: none;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 10px solid #d8d8d8;
  }

  .section .contentWrapper .toggle:after {
    position: absolute;
    right: 0;
    top: -6px;
    width: 0;
    height: 0;
    content: '';
    border: none;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 10px solid #d8d8d8;
  }

  .section .contentWrapper .nav {
    margin: 20px 0 14px;
    background: #f3f4f6;
    text-align: center;
  }

  .section .contentWrapper .nav .navWrapper {
    height: 90px;
    position: relative;
    background: #f3f4f6;
    font-size: 14px;
    color: #808080;
  }

  .section .contentWrapper .nav .navWrapper .line {
    position: absolute;
    left: 50%;
    top: 10px;
    bottom: 10px;
    width: 1px;
    background: #dcdcdc;
  }

  .section .contentWrapper .nav .row1 {
    margin-top: 25px;
    color: #444;
    font-size: 20px;
  }

  .section .contentWrapper .nav .row2 {
    margin-top: 5px;
    color: #808080;
    font-size: 14px;
  }

  .section .contentWrapper .nav .row2 span {
    font-size: 12px;
  }

  .section .contentWrapper table {
    width: 100%;
  }

  .section .contentWrapper table td {
    padding: 5px 0;
  }

  .section .contentWrapper table .tdTitle {
    color: #808080;
    font-size: 14px;
  }

  .section .contentWrapper table .tdContent {
    text-align: left;
    color: #444;
    font-size: 14px;
  }

  .section .contentWrapper .selectedWrapper .selected {
    display: inline-block;
    color: #03aef9;
    border: 1px solid #03aef9;
    border-radius: 5px;
    padding: 4px 10px 3px;
    font-size: 14px;
    margin: 5px 14px 0 0;
  }

  .section .contentWrapper .description {
    color: #444;
    font-size: 14px;
    line-height: 24px;
    margin-top: 15px;
  }

  .section .contentWrapper .requirement {
    margin-top: 20px;
    font-size: 14px;
    color: #444;
  }

  .section .contentWrapper .requirement .icon {
    color: #c8c8c8;
    margin-right: 8px;
    vertical-align: middle;
  }

  .section .contentWrapper .requirement .icon.one {
    font-size: 25px;
    position: relative;
    top: 0;
  }

  .section .contentWrapper .requirement .icon.two {
    font-size: 18px;
    margin-left: 15px;
  }

  .section .contentWrapper .item {
    position: relative;
    padding-left: 70px;
    margin: 10px 0;
  }

  .section .contentWrapper .item .title {
    color: #808080;
    font-size: 14px;
    line-height: 24px;
    position: absolute;
    left: 0;
  }

  .section .contentWrapper .item .content {
    font-size: 13px;
    line-height: 24px;
    color: #444;
  }

  .section .contentWrapper .item .content-5 {
    padding-left: 12px;
  }

  .section .contentWrapper .item .li {
    position: relative;
    padding-left: 11px;
    margin-bottom: 8px;
  }

  .section .contentWrapper .item .li:before {
    position: absolute;
    left: -4px;
    top: 8px;
    background: #03aef9;
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 3px;
  }

  .section .contentWrapper .files img {
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    width: 58px;
    height: 58px;
    margin-right: 15px;
  }

</style>
