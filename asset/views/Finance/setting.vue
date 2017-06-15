<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">安全设置</h1>
    </header>

    <div class="mui-content">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <a class="mui-navigate">绑定手机<span
              class="mui-pull-right account-setting-field mui-ellipsis">18623424***</span></a>
          </div>

        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <div class="mui-navigate-right"><label>绑定微信</label><label
              class="mui-pull-right account-setting-field">老中医包治一针灵</label></div>
          </div>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
  import {NOTICE} from '../../stores/types';
  import {createAPI, addAccessToken, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';
  import ACCOUNT_API from '../../api/account';
  import dPickerComponent from '../../components/picker/date-picker.vue';
  import popPickerComponent from '../../components/picker/poppicker.vue';
  import MTextarea from '../../components/MTextarea.vue';

  export default {
    data: () => ({
      id: null,
      bak: '',
      object_type: '',
      edu: {
        school: '',
        major: '',
        degree: '',
        begin_time: '',
        end_time: '',
        description: ''
      },
      description: '',
      descMaxLength: 2000,
      buttonSaveDisabled: false
    }),
    methods: {
      selectMajor(){
        var degreePicker = new mui.PopPicker();

        degreePicker.setData([
          {
            value: '大专',
            text: '大专'
          },
          {
            value: '本科',
            text: '本科'
          },
          {
            value: '硕士',
            text: '硕士'
          },
          {
            value: '博士',
            text: '博士'
          },
          {
            value: '其它',
            text: '其它'
          }
        ]);

        degreePicker.show(items => {
          this.edu.degree = items[0].value;
        });
      },
      muiViewBack: function () {
        var newItemChange = JSON.stringify(this.edu);
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
            value = this.edu.begin_time;
            break;
          case 2:
            value = this.edu.end_time;
            break;
          case 3:
            value = this.edu.get_time;
            break;
        }

        let param = {
          "type": "month",
          "beginYear": "1990",
          "endYear": currentDate.getFullYear(),
          "toNow": toNow,
          "value": value
        };

        let picker = new mui.DtPicker(param);
        picker.show((rs) => {

          rs.text = rs.text === '至今-至今' ? '至今' : rs.text;

          switch (objType) {
            case 1 :
              this.edu.begin_time = rs.text;
              break;
            case 2:
              this.edu.end_time = rs.text;
              break;
            case 3:
              this.edu.get_time = rs.text;
              break;
          }
        });
      },
      submit(){
        if (!this.edu.school) {
          mui.toast("学校不能为空");
          return;
        }

        if (!this.edu.major) {
          mui.toast("专业不能为空");
          return;
        }

        if (!this.edu.degree) {
          mui.toast("学历不能为空");
          return;
        }

        if (!this.edu.begin_time) {
          mui.toast("开始时间不能为空");
          return;
        }

        if (!this.edu.end_time) {
          mui.toast("结束时间不能为空");
          return;
        }

        if (this.edu.end_time < this.edu.begin_time) {
          mui.alert("开始时间需早于结束时间");
          return;
        }


        var url = '';
        if (this.id) {
          url = ACCOUNT_API.UPDATE_ACCOUNT_EDU;
        } else {
          url = ACCOUNT_API.ADD_ACCOUNT_EDU;
        }

        var data = this.edu;

        if (this.id) {
          data.id = this.id;
        }

        if (this.buttonSaveDisabled) {
          return;
        }

        data.description = this.description;

        this.buttonSaveDisabled = true;
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
            var url = ACCOUNT_API.DELETE_ACCOUNT_EDU;
            postRequest(url, {id: this.id}).then(response => {
              mui.toast('删除成功');
              this.$router.go(-1);
            });
          }
        });
      }
    },
    mounted () {

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
    computed: {},
    components: {
      popPickerComponent,
      dPickerComponent,
      MTextarea
    },
    created () {
      let id = parseInt(this.$route.params.id);
      this.id = id;
      if (this.id) {
        var edus = localEvent.getLocalItem('edus');

        if (!edus || !edus[id]) {
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
        this.edu = edus[id];
        this.description = this.edu.description;
        this.bak = JSON.stringify(this.edu);
      }


    }
  }
</script>

<style scoped>
  .mui-input-row label {
    padding-right: 0;
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

  .mui-table-view-cell {
    padding: 0;
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
