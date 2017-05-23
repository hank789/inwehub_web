<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-btn mui-btn-link mui-btn-nav mui-pull-left" @tap.stop.prevent="muiViewBack">取消</a>
      <h1 class="mui-title">项目经历</h1>
      <a @tap.stop.prevent="submit"
         class="mui-btn mui-btn-blue mui-btn-link mui-pull-right">保存</a>
    </header>

    <div class="mui-content">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目名称</label>
            <input type="text"  v-model.trim="project.project_name" placeholder="必填">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">项目角色</label>
            <input type="text"  v-model.trim="project.title" placeholder="必填">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">客户名称</label>
            <input type="text"  v-model.trim="project.customer_name" placeholder="必填">
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
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <a href="#page_product_tags" class="mui-navigate-right mui-ellipsis">产品类型<span
              class="mui-pull-right account-setting-field mui-ellipsis" v-text="infoProductTagsNames"
              v-if="infoProductTagsNames"></span><span class="mui-pull-right account-setting-field emptyFields"
                                                       v-else>请选择</span></a>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row" @tap.stop.prevent="initDate(1)">
            <label class="mui-navigate-right">开始时间</label><label class="mui-pull-right account-setting-field"
                                                                 v-text="project.begin_time"></label>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row" @tap.stop.prevent="initDate(2)">
            <label class="mui-navigate-right">结束时间</label><label class="mui-pull-right account-setting-field"
                                                                 v-text="project.end_time"></label>
          </div>
        </li>

      </ul>
      <div class="account_item_title">
        项目经历详情描述



      </div>
      <div class="textarea-wrapper">
        <textarea v-model.trim="project.description" rows="5"  placeholder="请详细填写该项目经历的详细信息"></textarea>
        <span class="counter"><span>{{ descLength }}</span><span>/</span><span>{{ descMaxLength }}</span></span>
      </div>
      <div class="deleteWrapper" v-show="id">
        <button type="button" class="mui-btn mui-btn-primary" @tap.stop.prevent="deleteItem('project')">
          删除
        </button>
      </div>
    </div>


    <div id="page_industry_tags" class="mui-modal mui-pageSub">
      <div class="mui-scroll-wrapper">
        <div class="mui-scroll">
          <industry-tags-indexed-list :tag_type="3" :selected="project.industry_tags"  :back_id="page_industry_tags_id" :object_type="object_type"
                                      v-on:selectedIndustryTags="selectedIndustryTags">

          </industry-tags-indexed-list>
        </div>
      </div>
    </div>


    <div id="page_product_tags" class="mui-modal mui-pageSub">
      <div class="mui-scroll-wrapper">
        <div class="mui-scroll">
          <!--这里放置真实显示的DOM内容-->
          <industry-tags-indexed-list :tag_type="4" :selected="project.product_tags" :back_id="page_product_tags_id"  :object_type="object_type" v-on:selectedIndustryTags="selectedProductTags">
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
      project:{
        project_name:'',
        title:'',
        customer_name:'',
        begin_time:'',
        end_time:'',
        description:'',
        industry_tags:[],
        product_tags:[]
      },
      page_industry_tags_id: 'page_industry_tags',
      page_product_tags_id: 'page_product_tags',
      descMaxLength: 2000,
    }),
    methods: {
      muiViewBack: function () {
        var newItemChange = JSON.stringify(this.project);
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

        var value = '';
        switch (objType) {
          case 1 :
            value = this.project.begin_time;
            break;
          case 2:
            value = this.project.end_time;
            break;
          case 3:
            value = this.project.get_time;
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
              this.project.begin_time = rs.text;
              break;
            case 2:
              this.project.end_time = rs.text;
              break;
            case 3:
              this.project.get_time = rs.text;
              break;
          }
        });
      },
      selectedIndustryTags(tags, object_type) {
        this.project.industry_tags = tags;
      },
      selectedProductTags(tags, object_type) {
        this.project.product_tags = tags;
      },
      submit(){
        if (!this.project.project_name) {
          mui.toast("项目名称不能为空");
          return;
        }

        if (!this.project.title) {
          mui.toast("项目角色不能为空");
          return;
        }

        if (!this.project.customer_name) {
          mui.toast("客户名称不能为空");
          return;
        }

        if (!this.project.industry_tags.length) {
          mui.toast("行业领域不能为空");
          return;
        }


        if (!this.project.product_tags.length) {
          mui.toast("产品类型不能为空");
          return;
        }

        if (!this.project.begin_time) {
          mui.toast("开始时间不能为空");
          return;
        }

        if (!this.project.end_time) {
          mui.toast("结束时间不能为空");
          return;
        }

        if (this.project.end_time < this.project.begin_time) {
          mui.alert("开始时间需早于结束时间");
          return;
        }


        var url = '';
        if (this.id) {
          url = ACCOUNT_API.UPDATE_ACCOUNT_PROJECT;
        } else {
          url = ACCOUNT_API.ADD_ACCOUNT_PROJECT;
        }

        var data = this.project;

        if (this.id) {
            data.id = this.id;
        }

        postRequest(url, data).then(response => {
          var code = response.data.code;
          if (code !== 1000) {
            mui.alert(response.data.message);
            return;
          }

          mui.toast('操作成功');
          this.$router.go(-1);
          this.bak = '';
        });
      },
      deleteItem(){
        var btnArray = ['否', '是'];
        mui.confirm('确认要删除？', '删除', btnArray, e => {
            if (e.index == 1) {
                var url = ACCOUNT_API.DELETE_ACCOUNT_PROJECT;
                postRequest(url, {id:this.id}).then(response => {
                  mui.toast('删除成功');
                  this.$router.go(-1);
                });
            }
        });
      }
    },
    mounted () {
      mui('.mui-scroll-wrapper').scroll();
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
    computed:{
      descLength() {
        if (this.project.description)
          return this.project.description.length;
        else return 0;
      },
      infoIndustryTagsNames() {
        if (this.project.industry_tags && this.project.industry_tags.length) {
          return this.project.industry_tags.join();
        } else {
          return '';
        }
      },
      infoProductTagsNames() {
        if (this.project.product_tags && this.project.product_tags.length) {
          return this.project.product_tags.join();
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
         var projects = localEvent.getLocalItem('projects');

         if (!projects || !projects[id]) {
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
         this.project = projects[id];
         this.bak = JSON.stringify(this.project);
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
