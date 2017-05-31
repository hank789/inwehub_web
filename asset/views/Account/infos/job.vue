<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-btn mui-btn-link mui-btn-nav mui-pull-left" @tap.stop.prevent="muiViewBack">取消</a>
      <h1 class="mui-title">工作经历</h1>
      <a @tap.stop.prevent="submit"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right" :disabled="buttonSaveDisabled">保存</a>
    </header>

    <div class="mui-content">
            <ul class="mui-table-view">
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">公司</label>
                  <input type="text"  v-model.trim="job.company" placeholder="必填">
                </div>
              </li>
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <label class="mui-navigate">职位</label>
                  <input type="text"  v-model.trim="job.title" placeholder="必填">
                </div>
              </li>
              <li class="mui-table-view-cell">
                <div class="mui-input-row">
                  <a href="#page_industry_tags"
                     class="mui-navigate-right">行业领域<span class="mui-pull-right account-setting-field mui-ellipsis"
                                                          v-if="infoIndustryTagsNames">{{ infoIndustryTagsNames
                    }}</span><span class="mui-pull-right account-setting-field emptyFields" v-else>请选择</span></a>
                </div>
              </li>
              <!--<li class="mui-table-view-cell">-->
                <!--<div class="mui-input-row">-->
                  <!--<a href="#page_product_tags" class="mui-navigate-right mui-ellipsis">产品类型<span-->
                    <!--class="mui-pull-right account-setting-field mui-ellipsis" v-text="infoProductTagsNames"-->
                    <!--v-if="infoProductTagsNames"></span><span class="mui-pull-right account-setting-field emptyFields"-->
                                                             <!--v-else>请选择</span></a>-->
                <!--</div>-->
              <!--</li>-->
              <li class="mui-table-view-cell">
                <div class="mui-input-row" @tap.stop.prevent="initDate(1)">
                  <label class="mui-navigate-right">开始时间</label><label class="mui-pull-right account-setting-field"
                                                                       v-text="job.begin_time"
                                                                       v-if="job.begin_time"></label><label
                  class="mui-pull-right account-setting-field emptyFields" v-else>请选择</label>
                </div>
              </li>
              <li class="mui-table-view-cell">
                <div class="mui-input-row" @tap.stop.prevent="initDate(2)">
                  <label class="mui-navigate-right">结束时间</label><label class="mui-pull-right account-setting-field"
                                                                       v-text="job.end_time"
                                                                       v-if="job.end_time"></label><label
                  class="mui-pull-right account-setting-field emptyFields" v-else>请选择</label>
                </div>
              </li>
              <li class="mui-table-view-cell">


              </li>
            </ul>
            <div class="account_item_title">
              工作经历详情描述



            </div>
            <div class="textarea-wrapper">
              <textarea v-model.trim="job.description" rows="5"
                        placeholder="请详细填写该工作经历的详细信息"></textarea>
              <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
            </div>
            <div class="deleteWrapper" v-show="id">
              <button type="button" class="mui-btn mui-btn-primary" @tap.stop.prevent="deleteItem">删除
              </button>
            </div>
    </div>


    <div id="page_industry_tags" class="mui-modal mui-pageSub">
      <div class="mui-scroll-wrapper">
        <div class="mui-scroll">
          <industry-tags-indexed-list :tag_type="3" :selected="job.industry_tags"  :back_id="page_industry_tags_id" :object_type="object_type"
                                      v-on:selectedIndustryTags="selectedIndustryTags">

          </industry-tags-indexed-list>
        </div>
      </div>
    </div>


    <div id="page_product_tags" class="mui-modal mui-pageSub">
      <div class="mui-scroll-wrapper">
        <div class="mui-scroll">
          <!--这里放置真实显示的DOM内容-->
          <industry-tags-indexed-list :tag_type="4" :selected="job.product_tags" :back_id="page_product_tags_id"  :object_type="object_type" v-on:selectedIndustryTags="selectedProductTags">
          </industry-tags-indexed-list>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {NOTICE} from '../../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../../utils/request';
  import localEvent from '../../../stores/localStorage';
  import industryTagsIndexedList from '../../Tags/industryTagsIndexedlist.vue';
  import ACCOUNT_API from '../../../api/account';
  import dPickerComponent from '../../../components/picker/date-picker.vue';

  export default {
    data: () => ({
      id:null,
      bak:'',
      object_type:'',
      job:{
        company:'',
        title:'',
        begin_time:'',
        end_time:'',
        description:'',
        industry_tags:'',
        product_tags:'',
      },
      page_industry_tags_id: 'page_industry_tags',
      page_product_tags_id: 'page_product_tags',
      descMaxLength: 2000,
      buttonSaveDisabled:false
    }),
    methods: {
      muiViewBack: function () {
        var newItemChange = JSON.stringify(this.job);
        if (this.bak != '' && newItemChange !== this.bak) {
          mui.confirm("您还未保存，确定退出么? ", '退出编辑', ['取消', '确定'], e => {
            if (e.index == 1) {
              this.$router.go(-1);
            } else {
              return false;
            }
          }, 'div');
        } else {
          this.$router.go(-1);
        }
      },

      initDate: function (objType) {
        let currentDate = new Date();

        var toNow = false;

        if (objType === 2) {
          toNow = true;
        }

        var value = '1990-07-01';
        switch (objType) {
          case 1 :
            value = this.job.begin_time;
            break;
          case 2:
            value = this.job.end_time;
            break;
          case 3:
            value = this.job.get_time;
            break;
        }

        let param = {
          "type": "month",
          "beginYear": "1990",
          "endYear": currentDate.getFullYear(),
          "toNow": toNow,
          "value":value
        };

        let picker = new mui.DtPicker(param);
        picker.show((rs) => {

          rs.text = rs.text === '至今-至今' ? '至今' : rs.text;

          switch (objType) {
            case 1 :
              this.job.begin_time = rs.text;
              break;
            case 2:
              this.job.end_time = rs.text;
              break;
            case 3:
              this.job.get_time = rs.text;
              break;
          }
        });
      },
      selectedIndustryTags(tags, object_type) {
        this.job.industry_tags = tags;
      },
      selectedProductTags(tags, object_type) {
        this.job.product_tags = tags;
      },
      submit(){

        if (!this.job.company) {
          mui.toast("公司名称不能为空");
          return;
        }

        if (!this.job.title) {
          mui.toast("公司职位不能为空");
          return;
        }

        if (this.job.industry_tags.length === 0) {
          mui.toast("行业领域不能为空");
          return;
        }

        this.job.product_tags = ['1'];
//        if (this.job.product_tags.length === 0) {
//          mui.toast("产品类型不能为空");
//          return;
//        }

        if (!this.job.begin_time) {
          mui.toast("开始时间不能为空");
          return;
        }

        if (!this.job.end_time) {
          mui.toast("结束时间不能为空");
          return;
        }

        if (this.job.end_time < this.job.begin_time) {
          mui.alert("开始时间需早于结束时间");
          return;
        }


        var url = '';
        if (this.id) {
          url = ACCOUNT_API.UPDATE_ACCOUNT_JOB;
        } else {
          url = ACCOUNT_API.ADD_ACCOUNT_JOB;
        }

        var json = JSON.stringify(this.job);
        var data = JSON.parse(json);

        if (this.id) {
            data.id = this.id;
        }

        if (this.buttonSaveDisabled) return;
        this.buttonSaveDisabled = true;

        data.industry_tags = this.userIndustryTagsCodes;


        postRequest(url, data).then(response => {
          this.buttonSaveDisabled = false;

          var code = response.data.code;

          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          mui.toast('操作成功');
          this.bak = '';
          this.$router.go(-1);
        });
      },
      deleteItem(){
        var btnArray = ['否', '是'];
        mui.confirm('确认要删除？', '删除', btnArray, e => {
            if (e.index == 1) {
                var url = ACCOUNT_API.DELETE_ACCOUNT_JOB;
                postRequest(url, {id:this.id}).then(response => {
                  mui.toast('删除成功');
                  this.$router.go(-1);
                });
            }
        });
      }
    },
    beforeRouteLeave(to, from, next) {
      var popDiv = document.querySelector('.mui-dtpicker');
      if (popDiv) {
        document.body.removeChild(popDiv);
      }


      popDiv = document.querySelector('.mui-poppicker');
      if (popDiv) {
        document.body.removeChild(popDiv);
      }

      next();
    },
    mounted () {
      mui('.mui-scroll-wrapper').scroll();
    },
    computed:{
      descLength() {
        if (this.job.description)
          return this.job.description.length;
        else return 0;
      },
      infoIndustryTagsNames() {
        if (this.job.industry_tags) {
          var newValue = [];
          for (var i in this.job.industry_tags) {
            newValue.push(this.job.industry_tags[i].text);
          }
          return newValue.join();
        } else {
          return '';
        }
      },
      userIndustryTagsCodes(){
        var newValue = [];
        for (var i in this.job.industry_tags) {
          if (typeof(this.job.industry_tags[i]) === 'object') {
            newValue.push(this.job.industry_tags[i].value);
          } else {
            newValue.push(this.job.industry_tags[i]);
          }
        }
        return newValue;
      },
      infoProductTagsNames() {
        if (this.job.product_tags && this.job.product_tags.length) {
          return this.job.product_tags.join();
        } else {
          return '';
        }
      }
    },
    components: {
      industryTagsIndexedList,
      dPickerComponent
    },
    created () {
      let id = parseInt(this.$route.params.id);
      this.id = id;
      if (this.id) {
         var jobs = localEvent.getLocalItem('jobs');

         if (!jobs || !jobs[id]) {
           this.$store.dispatch(NOTICE, cb => {
             cb({
               text: '发生一些错误',
               time: 1500,
               status: false
             });
           });
           this.$router.back();
           return;
         }
         this.job = jobs[id];
         this.bak = JSON.stringify(this.job);
      }


    }
  }
</script>

<style scoped>
  .mui-input-row label{
    padding-right:0;
  }

  .mui-input-row textarea {
    border: none !important;
  }

  .mui-input-row input {
    text-align: right;
    padding-right: 40px;
  }

  .mui-input-row a {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    line-height: 1.1;
    float: left;
    width: 35%;
    padding: 11px 15px;
  }

  .mui-input-row a {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    line-height: 1.1;
    float: left;
    width: 35%;
    padding: 11px 15px;
  }

  .mui-table-view-cell{
    padding: 0;
  }

  .textarea-wrapper {
    margin: 0 5px;
    height: 100%;
    position: relative;
    border-radius: 5px;
    border: 1px solid #bbbbbb;
    background: #fff;
    padding-bottom: 20px;
  }

  .textarea-wrapper .counter {
    position: absolute;
    right: 4px;
    font-size: 12px;
    bottom: 2px;
    color: #b0b0b0;
  }

  .textarea-wrapper textarea {
    border: none;
    margin: 0;
    padding-bottom: 0;
  }

  .deleteWrapper {
    text-align: right;
    padding: 10px;
  }

  .mui-table-view-cell .mui-navigate-right, .mui-table-view-cell .mui-navigate {
    color: #999;
  }

  .account_item_title {
    padding: 5px;
    color: #a6a6a6;
    font-size: 12px;
  }

  .account-setting-field {
    position: absolute;
    text-align: right;
    width: 200px;
    right: 40px;
    height: 32px;
    color: #3f3f3f;
    padding-right: 0;
  }
</style>
