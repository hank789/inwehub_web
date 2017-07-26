<template>
  <div>
    <div class="mui-content" v-if="!loading">
      <div class="projectPreviewCard" >
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <div class="header">
          <div class="avatar">
            <div class="avatarInner"><img class="avatar" :src="avatar_url">
            </div>
          </div>
        </div>
        <div class="title">{{ info.project_name }}</div>
        <div class="titleSub">{{ info.company_represent_person_name }}<i class="separate"></i>{{info.company_name}}</div>
        <div class="state">{{ project_stage_text }}</div>
      </div>
      <div class="section">
        <h5>项目简介</h5>
        <div class="contentWrapper">
          <div class="item">
            <div class="title">项目类型：</div>
            <div class="content">{{ project_type_text }}</div>
          </div>
          <div class="item">
            <div class="title">项目描述：</div>
            <div class="content hide mui-ellipsis-3">{{ info.project_description }}</div>
          </div>
          <div class="toggle show" @tap.stop.prevent="toggleDeatil" v-if="info.project_description.length > 50"></div>
          <div class="item">
            <div class="title">上传附件：</div>
            <div class="content files">
              <img v-if="info.images.length === 0" width="58" height="58"/>
              <img v-for="(image, index) in info.images"  width="58" height="58"
                                            :src="image"/>
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
                <div class="row1">{{ info.project_amount }}万</div>
                <div class="row2">项目预算<span>（包含差旅费）</span></div>
              </div>
              <div class="line"></div>
              <div class="mui-col-sm-6 mui-col-xs-6" @tap.stop.prevent="goRequirement()">
                <div class="row1">{{ info && info.project_begin_time && info.project_begin_time.replace(/-/g, '/') }}</div>
                <div class="row2">项目开始时间</div>
              </div>
            </div>
          </div>
          <table>
            <tr>
              <td class="tdTitle" width="70">顾问数量：</td>
              <td class="tdContent" width="101">{{ worker_num_text }}</td>
              <td class="tdTitle" width="70">项目周期：</td>
              <td class="tdContent">{{ project_cycle_text }}</td>
            </tr>
            <tr>
              <td class="tdTitle">计费模式：</td>
              <td class="tdContent">{{ billing_mode_text }}</td>
              <td class="tdTitle">工作密度：</td>
              <td class="tdContent">{{ work_intensity_text }}</td>
            </tr>
            <tr>
              <td class="tdTitle">顾问级别：</td>
              <td class="tdContent">{{ worker_level_text }}</td>
              <td class="tdTitle">远程工作：</td>
              <td class="tdContent">{{ remote_work_text }}</td>
            </tr>
            <tr>
              <td class="tdTitle">工作地点：</td>
              <td class="tdContent" colspan="3">{{ work_address_text }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="section">
        <h5>企业信息</h5>
        <div class="contentWrapper">
          <div class="item">
            <div class="title">企业名称：</div>
            <div class="content">{{info.company_name}}</div>
          </div>
          <div class="selectedWrapper"><span class="selected" v-for="(industry, index) in info.company_industry_tags" >{{industry.text}}</span></div>
          <div class="description">
            {{ info.company_description }}
          </div>
          <div class="item">
            <div class="title">项目对接：</div>
            <div class="content">{{ info.company_represent_person_is_self?'发布者本人':'其他人'}}（{{  info.company_represent_person_name }}）</div>
          </div>
          <div class="item">
            <div class="title">对接职位：</div>
            <div class="content">{{ info.company_represent_person_title }}</div>
          </div>
          <div class="item">
            <div class="title">对接手机：</div>
            <div class="content">{{ info.company_represent_person_phone }}</div>
          </div>
          <div class="item">
            <div class="title">对接邮箱：</div>
            <div class="content">{{ info.company_represent_person_email }}</div>
          </div>
          <div class="item">
            <div class="title">开票抬头：</div>
            <div class="content colorC8">{{ info.company_billing_title}}</div>
          </div>
          <div class="item">
            <div class="title">开户银行：</div>
            <div class="content colorC8">{{ info.company_billing_bank }}</div>
          </div>
          <div class="item">
            <div class="title">开户账户：</div>
            <div class="content colorC8">{{ info.company_billing_account }}</div>
          </div>
          <div class="item">
            <div class="title">纳税识别号：</div>
            <div class="content content-5 colorC8">{{ info.company_billing_taxes }}</div>
          </div>
        </div>
      </div>
      <div class="section">
        <h5>需求偏好</h5>
        <div class="contentWrapper">
          <div class="requirement">
            <template v-if="info.is_view_resume">
              <svg class="icon one" aria-hidden="true">
                <use xlink:href="#icon-gongkai"></use>
              </svg>
              需要查看顾问简历
            </template>

            <template v-if="info.is_apply_request">
            <svg class="icon two" aria-hidden="true">
              <use xlink:href="#icon-xuyaoguwentoudishenqing"></use>
            </svg>
            需要顾问投递申请
            </template>

          </div>
          <div class="item" v-if="info.qualification_requirements && info.qualification_requirements.length">
            <div class="title">资质要求</div>
            <div class="content">
              <div class="li" v-for="(qualification_requirement, index) in info.qualification_requirements">{{ qualification_requirement }}</div>
            </div>
          </div>
          <div class="item" v-if="info.other_requirements && info.other_requirements.length">
            <div class="title">其他条件</div>
            <div class="content">
              <div class="li" v-for="(other_requirement, index) in info.other_requirements">{{ other_requirement }}</div>
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
      var userInfo = localEvent.getLocalItem('UserInfo');
      return {
        project_id:null,
        avatar_url:userInfo.avatar_url,
        info:{
          project_description:'',
          images:[],
          project_begin_time:'',
        },
        loading: 1
      }
    },
    computed: {
        project_stage_text() {
            switch(parseInt(this.info.project_stage)) {
              case 1:
                  return '只有个想法，还需要看看';
                  break;
              case 2:
                  return '项目已立项，就等顾问来操刀';
                  break;
              case 3:
                  return '项目进行中，需要大牛加入';
                  break;
            }
        },
      project_type_text(){
        switch(parseInt(this.info.project_type)) {
          case 1:
            return '一次性';
            break;
          case 2:
            return '持续性';
            break;
        }
      },
      worker_num_text(){
        switch(parseInt(this.info.worker_num)) {
          case 1:
            return '1个';
            break;
          case 2:
            return '2个';
            break;
          case 3:
            return '3~5个';
            break;
          case 4:
            return '5~8个';
            break;
          case 5:
            return '8个以上';
            break;
          case 6:
            return '其他';
            break;
          case 7:
            return '不确定';
            break;
        }
      },
      project_cycle_text(){
        switch(parseInt(this.info.project_cycle)) {
          case 1:
            return '小于1周';
            break;
          case 2:
            return '1-2周';
            break;
          case 3:
            return '2-4周';
            break;
          case 4:
            return '1-2月';
            break;
          case 5:
            return '2-4月';
            break;
          case 6:
            return '4-6月';
            break;
          case 7:
            return '半年以上';
            break;
          case 8:
            return '不确定';
            break;
          case 9:
            return '其他';
            break;
        }
      },
      billing_mode_text(){
        switch(parseInt(this.info.billing_mode)) {
          case 1:
            return '按人计算';
            break;
          case 2:
            return '2整体打包';
            break;
        }
      },
      work_intensity_text(){
        switch(parseInt(this.info.work_intensity)) {
          case 1:
            return '2H/W';
            break;
          case 2:
            return '4H/W';
            break;
          case 3:
            return '8H/W';
            break;
          case 4:
            return '16H/W';
            break;
          case 5:
            return '24H/W';
            break;
          case 6:
            return '32H/W';
            break;
          case 7:
            return '40H/W';
            break;
          case 8:
            return '其他';
            break;
          case 9:
            return '我不确定';
            break;
        }
      },
      worker_level_text(){
        switch(parseInt(this.info.worker_level)) {
          case 1:
            return '熟练';
            break;
          case 2:
            return '精通';
            break;
          case 3:
            return '3资深';
            break;
        }
      },
      remote_work_text(){
        switch(parseInt(this.info.remote_work)) {
          case 1:
            return '接受';
            break;
          case 2:
            return '不接受';
            break;
        }
      },
      work_address_text(){
          var bmp = [];
          for(var i in this.info.work_address) {
              bmp.push(this.info.work_address[i].text);
          }
          return bmp.join('; ');
      }
    },
    methods: {
      toggleDeatil(event){

        var Desc = event.target.previousSibling.previousSibling.lastChild;


        if (/hide/.test(Desc.className)) {
          Desc.className = Desc.className.replace(' hide', '');
          Desc.className = Desc.className.replace(' mui-ellipsis-3', '');
          Desc.className += ' show';

          event.target.className = "toggle hide";
        } else {
          Desc.className = Desc.className.replace(' show', '');
          Desc.className += ' hide mui-ellipsis-3';

          event.target.className = "toggle show";
        }

      },

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
        this.loading = 0;
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
    border-bottom: 10px solid #d8d8d8;
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
    top: 10px;
    background: #03aef9;
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 3px;
  }

  .mui-content{
    overflow: hidden;
  }

  .section .contentWrapper .files img {
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    width: 58px;
    height: 58px;
    margin-right: 15px;
  }
  .section .contentWrapper .requirement .icon:first-child{
    margin-left:0 !important;
  }
</style>
