<template>
  <div>
    <header class="mui-bar mui-bar-dark mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">企业信息</h1>
    </header>

    <div class="mui-content">
      <div class="schedule schedule-3"></div>
      <div class="basic">
        <div class="title">很好</div>
        <div class="titleSub">现在完善你的企业信息</div>
      </div>

      <ul class="mui-table-view companyForm">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">企业名称</label>
            <input type="text"  placeholder="输入企业名称" v-model="company_name">
          </div>
        </li>

        <li class="mui-table-view-cell noBottomBorder">
          <div class="mui-input-row">
            <label class="mui-navigate">企业简介</label>

            <MTextarea v-model.trim="company_description" :content="company_description" :rows="5" :descMaxLength="500" :placeholder="''"></MTextarea>
          </div>
        </li>

        <li :class="{'mui-table-view-cell':true, noBottomBorder:company_industry_tags.length}">
          <div class="mui-input-row">
            <label class="mui-navigate">行业领域</label>
            <a href="#page_industry_tags" @tap="fixSelect"><svg class="icon modify" aria-hidden="true">
              <use xlink:href="#icon-shuru"></use>
            </svg></a>
          </div>

          <div class="selectedWrapper">

                    <span class="selected" v-for="(industry, index) in company_industry_tags">{{industry.text}}<svg class="icon" aria-hidden="true" @tap.stop.prevent="closeIndustry(index)">
                    <use xlink:href="#icon-guanbi"></use>
                </svg></span>

          </div>
        </li>

        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">对接人员</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio1" type="radio" v-model="company_represent_person_is_self" value="1">
                    发布者本人
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio1" type="radio" v-model="company_represent_person_is_self" value="0">
                    其他人
                </span>
            </div>

          </div>
        </li>

        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">对接人名</label>
            <input type="text" name="company_represent_person_name" v-model="company_represent_person_name" placeholder="输入对接人名" v-if="parseInt(company_represent_person_is_self) === 0 ">
            <input type="text" name="company_represent_person_name_1" v-model="company_represent_person_name" @tap.stop.prevent="blurThis($event)" readonly="readonly" v-else>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">对接职位</label>
            <input type="text" name="company_represent_person_title" v-model="company_represent_person_title" placeholder="输入对接人职位" v-if="parseInt(company_represent_person_is_self) ===0">
            <input type="text" name="company_represent_person_title_1" v-model="company_represent_person_title" @tap.stop.prevent="blurThis($event)" readonly="readonly" v-else>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">对接手机</label>
            <input type="text" name="company_represent_person_phone" pattern="\d*" v-model="company_represent_person_phone" placeholder="输入对接人手机" v-if="parseInt(company_represent_person_is_self) === 0 ">
            <input type="text" name="company_represent_person_phone_1" pattern="\d*" v-model="company_represent_person_phone" @tap.stop.prevent="blurThis($event)" readonly="readonly"  v-else>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">对接邮箱</label>
            <input type="text" name="company_represent_person_email" v-model="company_represent_person_email" placeholder="输入对接人邮箱" v-if="parseInt(company_represent_person_is_self) === 0">
            <input type="text" name="company_represent_person_email1" v-model="company_represent_person_email" @tap.stop.prevent="blurThis($event)" readonly="readonly" v-else>
          </div>
        </li>

        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">开票信息</label>
            <div class="textRight">
                    <span class="mui-radio radioWrapper">
                    <input name="radio2" type="radio" value="0" v-model="company_billing_need">
                    不需要
                </span>
              <span class="mui-radio radioWrapper">
                    <input name="radio2" type="radio" value="1" v-model="company_billing_need">
                    现在填写
                </span>
            </div>
          </div>
        </li>

        <li class="mui-table-view-cell" v-show="company_billing_need === '1'">
          <div class="mui-input-row">
            <label class="mui-navigate">抬头信息</label>
            <input type="text" placeholder="填写抬头" v-model="company_billing_title">
          </div>
        </li>
        <li class="mui-table-view-cell" v-show="company_billing_need === '1'">
          <div class="mui-input-row">
            <label class="mui-navigate">开户银行</label>
            <input type="text" placeholder="填写银行" v-model="company_billing_bank">
          </div>
        </li>
        <li class="mui-table-view-cell" v-show="company_billing_need === '1'">
          <div class="mui-input-row">
            <label class="mui-navigate">开户账户</label>
            <input type="text" placeholder="填写账户" v-model="company_billing_account">
          </div>
        </li>
        <li class="mui-table-view-cell" v-show="company_billing_need === '1'">
          <div class="mui-input-row">
            <label class="mui-navigate">纳税识别号</label>
            <input type="text" placeholder="填写识别号" v-model="company_billing_taxes">
          </div>
        </li>

      </ul>



      <div class="buttonWrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="submit()"  :disabled="disabledButton">下一步</button>
      </div>


    </div>


    <div id="page_industry_tags" class="mui-modal mui-pageSub">

      <industry-tags-indexed-list :tag_type="3" :back_id="page_industry_tags_id" :object_type="object_type" :selected="company_industry_tags"
                                  v-on:selectedIndustryTags="selectedIndustryTags">

      </industry-tags-indexed-list>

    </div>

  </div>
</template>

<script>
  import {apiRequest, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';
  import MTextarea from '../../components/MTextarea.vue';
  import industryTagsIndexedList from '../Tags/industryTagsIndexedlist.vue';
  import {setCacheInfo, getCacheInfo} from '../../utils/project';

  export default {
    data(){
      var cacheData = getCacheInfo();
      if (cacheData && cacheData.company) {
        return cacheData.company;
      }

      const currentUser = localEvent.getLocalItem('UserInfo');
      return {
        project_id:null,
        company_name:'',
        company_description:'',
        company_industry_tags:'',
        company_represent_person_is_self:0,
        company_represent_person_name:'',
        company_represent_person_title:'',
        company_represent_person_phone:'',
        company_represent_person_email:'',
        company_billing_need:'1',
        company_billing_title:'',
        company_billing_bank:'',
        company_billing_account:'',
        company_billing_taxes:'',
        disabledButton: true,
        page_industry_tags_id: 'page_industry_tags',
        object_type: 'project',
        localUser:currentUser,
        loading: 1
      }
    },
    computed: {
      infoIndustryTagsCodes() {
        var newValue = [];
        for (var i in this.company_industry_tags) {
          if (typeof(this.company_industry_tags[i]) === 'object') {
            newValue.push(this.company_industry_tags[i].value);
          } else {
            newValue.push(this.company_industry_tags[i]);
          }
        }
        return newValue;
      }
    },
    methods: {
      blurThis:function(e){
          e.target.blur();
      },
      isEnableButton:function () {
        this.disabledButton = true;
        if (!this.company_name) {
          return;
        }

        if (!this.company_description) {

          return;
        }

        if (this.company_industry_tags.length === 0) {

          return;
        }


        if (parseInt(this.company_represent_person_is_self) === 0) {
          if (!this.company_represent_person_name) {

            return;
          }

          if (!this.company_represent_person_title) {

            return;
          }

          if (!this.company_represent_person_phone) {

            return;
          }


          if (!this.company_represent_person_email) {

            return;
          }
        }

        if (parseInt(this.company_billing_need) === 1) {
          if (!this.company_billing_title) {

            return;
          }

          if (!this.company_billing_bank) {

            return;
          }

          if (!this.company_billing_account) {

            return;
          }

          if (!this.company_billing_taxes) {

            return;
          }
        }

        this.disabledButton = false;
      },
      submit(){
        if (!this.company_name) {
          mui.toast('请输入企业名称');
          return;
        }

        if (!this.company_description) {
          mui.toast('请输入企业简介');
          return;
        }

        if (this.company_industry_tags.length === 0) {
          mui.toast('请选择行业领域');
          return;
        }


        if (parseInt(this.company_represent_person_is_self) === 0) {
            if (!this.company_represent_person_name) {
              mui.toast('请输入对接人名');
              return;
            }

          if (!this.company_represent_person_title) {
            mui.toast('请输入对接职位');
            return;
          }

          if (!this.company_represent_person_phone) {
            mui.toast('请输入对接手机');
            return;
          }

          if (this.company_represent_person_phone.length !== 11) {
            mui.toast("请正确填写对接人手机");
            return;
          }

          if (!this.company_represent_person_email) {
            mui.toast('请输入对接邮箱');
            return;
          }

          var Regex = /^(?:\w+\.?)*\w+@(?:\w+\.)*\w+$/;
          if (!Regex.test(this.company_represent_person_email)){
            mui.toast('请正确输入邮箱');
            return;
          }
        }

        if (parseInt(this.company_billing_need) === 1) {
          if (!this.company_billing_title) {
            mui.toast("请输入抬头信息");
            return;
          }

          if (!this.company_billing_bank) {
            mui.toast("请输入开户银行");
            return;
          }

          if (!this.company_billing_account) {
            mui.toast("请输入开户账户");
            return;
          }

          if (!this.company_billing_taxes) {
            mui.toast("请输入纳税识别号");
            return;
          }
        }

        var data = {
          project_id:this.project_id,
          company_name:this.company_name,
          company_description:this.company_description,
          company_industry_tags:this.infoIndustryTagsCodes,
          company_represent_person_is_self:this.company_represent_person_is_self,
          company_represent_person_name:this.company_represent_person_name,
          company_represent_person_title:this.company_represent_person_title,
          company_represent_person_phone:this.company_represent_person_phone,
          company_represent_person_email:this.company_represent_person_email,
          company_billing_title:this.company_billing_title,
          company_billing_bank:this.company_billing_bank,
          company_billing_account:this.company_billing_account,
          company_billing_taxes:this.company_billing_taxes,
        };

        postRequest(`project/step_three`, data).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          setCacheInfo('company', this.$data);
          this.$router.push('/project/like?pid='+this.project_id);
        });
      },
      closeIndustry(index) {
        this.company_industry_tags.splice(index, 1);
      },
      fixSelect:function(){
        setTimeout(() => {
          mui.trigger(mui('.mui-indexed-list-item')[0],'tap');
          mui.trigger(mui('.mui-indexed-list-item')[0],'tap');
        }, 200)
      },
      selectedIndustryTags(tags, object_type) {
        this.company_industry_tags = tags;
      },
    },
    components: {
      MTextarea,
      industryTagsIndexedList
    },
    mounted(){

    },
    watch: {
      company_represent_person_is_self: function (newValue) {

        if (parseInt(newValue) === 1) {
          this.company_represent_person_name = this.localUser.name;
          this.company_represent_person_title = this.localUser.title;
          this.company_represent_person_phone = this.localUser.phone;
          this.company_represent_person_email = this.localUser.email;
        } else {
          this.company_represent_person_name = '';
          this.company_represent_person_title = '';
          this.company_represent_person_phone = '';
          this.company_represent_person_email = '';
        }

        this.isEnableButton();
      },
      company_name: function (newMoney, oldMoney) {
        this.isEnableButton();
      },
      company_description: function (newMoney, oldMoney) {
        this.isEnableButton();
      },
      company_industry_tags: function (newMoney, oldMoney) {
        this.isEnableButton();
      },
      company_represent_person_name: function (newMoney, oldMoney) {
        this.isEnableButton();
      },
      company_represent_person_title: function (newMoney, oldMoney) {
        this.isEnableButton();
      },
      company_represent_person_phone: function (newMoney, oldMoney) {
        this.isEnableButton();
      },
      company_represent_person_email: function (newMoney, oldMoney) {
        this.isEnableButton();
      },
      company_billing_title: function (newMoney, oldMoney) {
        this.isEnableButton();
      },
      company_billing_bank: function (newMoney, oldMoney) {
        this.isEnableButton();
      },
      company_billing_account: function (newMoney, oldMoney) {
        this.isEnableButton();
      },
      company_billing_taxes: function (newMoney, oldMoney) {
        this.isEnableButton();
      },
      company_billing_need:function (newMoney, oldMoney) {
        this.isEnableButton();

        if (!parseInt(newMoney)) {
            this.company_billing_title = '';
            this.company_billing_bank = '';
            this.company_billing_account = '';
            this.company_billing_taxes = '';
        }
      },
    },

    created(){
      this.company_represent_person_is_self = 1;
      this.project_id = this.$route.query.pid;
      if (!this.project_id) {
        mui.back();
      }
    }
  };
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .schedule{
    width:25%;
    height:3px;
    background: #03aef9;
  }

  .schedule-3{
    margin-left:50%;
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
    width:61% !important;
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
    max-width: 49%;
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
    padding:10px;
    margin-right:15px;
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

  .buttonWrapper{
    padding:17px 16px 30px;
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
    margin: 0;
    font-size:14px;
    height:100%;
    padding-bottom: 0;
  }


</style>
