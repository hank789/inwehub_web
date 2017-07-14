<template>
<div>
  <header class="mui-bar mui-bar-dark mui-bar-nav">
    <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    <h1 class="mui-title">认证企业用户</h1>
  </header>

  <div class="mui-content">
    <div class="title">企业信息</div>
    <ul class="mui-table-view companyForm noBottomBorder">
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">企业名称</label>
          <input type="text" v-model="name" placeholder="输入企业名称" maxlength="60">
        </div>
      </li>
      <li :class="{'mui-table-view-cell':true, noBottomBorder:industryTags.length}">
        <div class="mui-input-row">
          <label class="mui-navigate">行业领域</label>
          <a href="#page_industry_tags" @tap="fixSelect"><svg class="icon modify" aria-hidden="true">
              <use xlink:href="#icon-shuru"></use>
            </svg></a>
        </div>
        <div class="selectedWrapper">

                    <span class="selected" v-for="(industry, index) in industryTags">{{industry.text}}<svg class="icon" aria-hidden="true" @tap.stop.prevent="closeIndustry(index)">
                    <use xlink:href="#icon-guanbi"></use>
                </svg></span>

        </div>
      </li>
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">公司规模</label>
          <span class="unit">人</span>
          <input type="text"  pattern="\d*" v-model="company_workers" class="inputUnit"  placeholder="输入公司人数">
        </div>
      </li>
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">统一社会信用代码</label>
          <input type="text" v-model="company_credit_code" placeholder="输入代码">
        </div>
      </li>
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">开户银行</label>
          <input type="text" v-model="company_bank" placeholder="输入开户银行">
        </div>
      </li>
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">开户账户</label>
          <input type="text" v-model="company_bank_account" placeholder="输入开户账户">
        </div>
      </li>
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">公司地址<span class="optional">（选填）</span></label>
          <input type="text" v-model="company_address" placeholder="输入公司地址">
        </div>
      </li>
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">公司电话<span class="optional">（选填）</span></label>
          <input type="text" v-model="company_work_phone" placeholder="输入公司电话">
        </div>
      </li>
    </ul>
    <div class="river"></div>
    <div class="title">对接人信息</div>
    <ul class="mui-table-view companyForm">
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">对接人员</label>
          <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio1" type="radio" v-model="company_represent_person_is_self" value="1">
                    发布者本人
                </span>
            <span class="mui-radio radioWrapper">
                    <input name="radio1" type="radio" checked="checked" v-model="company_represent_person_is_self" value="0">
                    其他人
                </span>
          </div>

        </div>
      </li>
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">对接人名</label>
          <input type="text" v-model="company_represent_person_name" placeholder="输入对接人名">
        </div>
      </li>
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">对接职位</label>
          <input type="text" v-model="company_represent_person_title" placeholder="输入对接人职位">
        </div>
      </li>
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">对接手机</label>
          <input type="text" pattern="\d*" v-model="company_represent_person_phone" placeholder="输入对接人手机">
        </div>
      </li>
      <li class="mui-table-view-cell">
        <div class="mui-input-row">
          <label class="mui-navigate">对接邮箱</label>
          <input type="text" v-model="company_represent_person_email" placeholder="输入对接人邮箱">
        </div>
      </li>
    </ul>


    <div class="buttonWrapper">
      <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit">确认</button>
    </div>

  </div>

  <div id="page_industry_tags" class="mui-modal mui-pageSub">

    <industry-tags-indexed-list :tag_type="3" :back_id="page_industry_tags_id" :object_type="object_type"
                                v-on:selectedIndustryTags="selectedIndustryTags">

    </industry-tags-indexed-list>

  </div>

  <div id="validMode" style="display: none;">
    <div class="validMode">
      <div class="item">
             <span class="mui-radio radioWrapper">
                 <label>
             <input name="radio3" type="radio" checked="checked">
                 <b>协议验证：</b>请应用内/公众号联系客服或发送申请邮件到hi@inwehub.com，获取专业客服一对一对接服务</label>
             </span>
      </div>
      <div class="item">
             <span class="mui-radio radioWrapper">
                 <label>
                     <input name="radio3" type="radio" disabled="disabled">
                     <b>打款验证：</b>我司3个工作日内会向贵司开户银行汇入一笔随机金额的资金，请随时关注打款进度并及时在应用内反馈打款金额<span class="noZhichi">（暂不支持）</span>
                 </label>

             </span>
      </div>
    </div>
  </div>


</div>
</template>

<script>
  import {apiRequest, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';
  import industryTagsIndexedList from '../Tags/industryTagsIndexedlist.vue';

  export default {
    data(){
      const currentUser = localEvent.getLocalItem('UserInfo');
      return {
        loading: 1,
        name:'',
        industryTags:[],
        company_workers:'',
        company_credit_code:'',
        company_bank:'',
        company_bank_account:'',
        company_address:'',
        company_work_phone:'',
        company_represent_person_is_self:0,
        company_represent_person_name:'',
        company_represent_person_title:'',
        company_represent_person_phone:'',
        company_represent_person_email:'',
        company_auth_mode:'',
        object_type: 'company',
        apply_status:0,
        page_industry_tags_id: 'page_industry_tags',
        localUser:currentUser
      }
    },
    computed: {
      infoIndustryTagsCodes() {
        var newValue = [];
        for (var i in this.industryTags) {
          if (typeof(this.industryTags[i]) === 'object') {
            newValue.push(this.industryTags[i].value);
          } else {
            newValue.push(this.industryTags[i]);
          }
        }
        return newValue;
      }
    },
    watch: {
      company_represent_person_is_self: function (newValue) {

         if (parseInt(newValue) === 1) {
             this.company_represent_person_name = this.localUser.name;
             this.company_represent_person_title = this.localUser.title;
             this.company_represent_person_phone = this.localUser.phone;
             this.company_represent_person_email = this.localUser.email;
         } else {
             if (parseInt(this.apply_status) === 3) {
                 return;
             }

             this.company_represent_person_name = '';
             this.company_represent_person_title = '';
             this.company_represent_person_phone = '';
             this.company_represent_person_email = '';
         }
      }
    },
    components: {
      industryTagsIndexedList
    },
    methods: {
      initData:function(){
        postRequest(`company/applyInfo`, {}).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          var data = response.data.data;

          this.name = data.company_name;
          this.industryTags = data.industry_tags;
          this.company_workers = data.company_workers;
          this.company_credit_code = data.company_credit_code;
          this.company_bank = data.company_bank;
          this.company_bank_account = data.company_bank_account;
          this.company_address = data.company_address;
          this.company_work_phone = data.company_work_phone;
          this.company_represent_person_is_self = data.company_represent_person_is_self;
          this.company_represent_person_name = data.company_represent_person_name;
          this.company_represent_person_title = data.company_represent_person_title;
          this.company_represent_person_phone = data.company_represent_person_phone;
          this.company_represent_person_email = data.company_represent_person_email;
          this.company_auth_mode = data.company_auth_mode;
          this.apply_status = data.apply_status;
          if (parseInt(this.apply_status) !== 0 && parseInt(this.apply_status) !== 3) {
             mui.back();
          }

        });
      },
      fixSelect:function(){
        setTimeout(() => {
          mui.trigger(mui('.mui-indexed-list-item')[0],'tap');
          mui.trigger(mui('.mui-indexed-list-item')[0],'tap');
        }, 200)
      },
      closeIndustry(index) {
        this.industryTags.splice(index, 1);
      },
      selectedIndustryTags(tags, object_type) {
        this.industryTags = tags;
      },
      nothing(){

      },
      alertProtocol(){
        var html=document.getElementById('validMode').innerHTML;
        mui.alert(html, '选择验证模式', '确定', () => {
            this.submitLast();
        }, 'div');
      },
      submitLast(){
        var data = {
          company_name:this.name,
          industry_tags:this.infoIndustryTagsCodes,
          company_workers:this.company_workers,
          company_credit_code:this.company_credit_code,
          company_bank:this.company_bank,
          company_bank_account:this.company_bank_account,
          company_address:this.company_address,
          company_work_phone:this.company_work_phone,
          company_represent_person_is_self:this.company_represent_person_is_self,
          company_represent_person_name:this.company_represent_person_name,
          company_represent_person_title:this.company_represent_person_title,
          company_represent_person_phone:this.company_represent_person_phone,
          company_represent_person_email:this.company_represent_person_email,
          company_auth_mode:1,
        };

        postRequest(`company/apply`, data).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          this.$router.replace('/company/success');
        });
      },
      submit(){
        if (!this.name) {
          mui.toast('请输入企业名称');
          return;
        }

        if (this.industryTags.length < 1) {
          mui.toast('请输入行业领域');
          return;
        }

        if (!this.company_workers) {
          mui.toast('请输入公司规模');
          return;
        }

        if (!this.company_credit_code) {
          mui.toast('请输入统一社会信用代码');
          return;
        }

        if (!this.company_bank) {
          mui.toast('请输入开户银行');
          return;
        }

        if (!this.company_bank_account) {
          mui.toast('请输入开户账户');
          return;
        }

        if (!this.company_represent_person_name) {
          mui.toast('请输入对接人名');
          return;
        }

        if (!this.company_represent_person_title) {
          mui.toast('请输入对接人职位');
          return;
        }

        if (!this.company_represent_person_phone) {
          mui.toast('请输入对接人手机');
          return;
        }

        if (!this.company_represent_person_email) {
          mui.toast('请输入对接人邮箱');
          return;
        }

        this.alertProtocol();
      },
    },
    mounted(){

    },
    created(){
      this.company_represent_person_is_self = 1;
      var companyStatus = localEvent.getLocalItem('companyStatus');
      if (companyStatus && companyStatus.status === 3) {
         this.initData();
      }
    }
  };
</script>

<style>
  .mui-popup-title{
    font-size:16px !important;
    color:#444 !important;
    font-weight: normal !important;
  }
  .mui-popup-button{
    color:#03aef9 !important;
    font-size:16px !important;
    font-weight: normal !important;
  }

  .mui-radio input[type='radio'][disabled]:before{
    opacity: 1 !important;
  }
  /*.mui-popup-button{*/
    /*background:#fff !important;*/
  /*}*/
  /*.mui-popup-inner{*/
    /*background: #fff !important;*/
  /*}*/
</style>

<style scoped="scoped">
  .title{
    padding:17px 16px;
    color:#444;
    background: #fff;
    font-weight: bold;
  }

  .buttonWrapper{
    padding:20px 16px;
    background: #fff;
  }

  .buttonWrapper button{
    margin-top:10px;
    border-radius: 5px;
    background: #03aef9;
    border:1px solid #03aef9;
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
    width:61% !important;
    text-align: right;
    font-size:14px;
    padding-right: 0;

  }

  .companyForm .mui-table-view-cell{
    padding:5px 15px;
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

  .companyForm input::placeholder{
    color:#c8c8c8;
  }

  .companyForm .inputUnit{
    width:55% !important;
    padding:10px;
  }

  .companyForm .textRight{
    float: right;
    display: inline-block;
  }
  .selected{
    display: inline-block;
    color:#03aef9;
    border:1px solid #03aef9;
    border-radius: 5px;
    padding:4px 10px 3px;
    font-size:14px;
    margin:7px 7px 0 0;
  }

  .selected .icon{
    color:#c8c8c8;
    font-size:11px;
    margin-left:7px;
    position: relative;
    top: -1px;
  }

  .river{
    height:10px;
    background: #ececee;
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

  .validMode{
    color:#808080;
    font-size:12px;
  }
  .validMode b{
    font-weight: normal;
    color:#444;
  }
  .validMode .radioWrapper input[type='radio']{
    top:14px;
  }

  .validMode .noZhichi{
    color:#03aef9;
  }
  .validMode label{
    padding-right: 0;
  }
  .validMode .radioWrapper{
    padding-bottom:0;
    text-align: left;
  }
</style>
