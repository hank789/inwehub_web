<template>

  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">推荐专家</h1>
    </header>

    <div class="mui-content professor">
      <div class="title">在这里填写推荐专家信息：</div>
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">专家姓名</label>
            <input id="name" type="text" class="mui-input-clear" v-model="name" placeholder="必填">
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">专家性别</label>
            <a href="javascript:void(0)" @tap.stop.prevent="selectGender"
               class="link mui-navigate-right mui-ellipsis"><span v-show="!gender">请选择</span><span
              class="mui-input-clear">{{ gender }}</span></a>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">从业时间</label>
            <a href="#page_industry_tags" class="link mui-navigate-right mui-ellipsis" @tap.stop.prevent="selectWorkYear"><span
              v-show="!workYears">请选择</span><span class="mui-input-clear">{{ workYears }}</span></a>
            <span class="year">年</span>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row mui-navigate-right">
            <label class="mui-navigate">行业领域</label>
            <a href="#page_industry_tags" class="link mui-navigate-right mui-ellipsis" @tap="fixSelect"><span
              v-show="!infoIndustryTagsNames">请选择</span><span class="mui-input-clear">{{ infoIndustryTagsNames }}</span></a>
          </div>
        </li>
        <li class="mui-table-view-cell">
          <div class="mui-input-row">
            <label class="mui-navigate">联系电话</label>
            <input type="text" class="mui-input-clear" v-model="mobile" placeholder="必填">
          </div>
        </li>
      </ul>
      <div class="title">在这里补充推荐专家信息：</div>

      <MTextarea v-model.trim="description" :content="description" :rows="4" :descMaxLength="500" :placeholder="'描述'"></MTextarea>

      <div class="title">上传专家名片：</div>

      <div class="image-list">

        <template v-for="(file, index) in files">
          <div class="image-item">
            <div class="image-close" @tap.stop.prevent="delFile(index)">X</div>
            <img class="file" :src="file.url"/>
          </div>
        </template>


        <div class="image-item space" @tap.stop.prevent="selectImages" v-show="files.length < 2">
          <div class="image-close">X</div>
          <svg class="icon mui-icon" aria-hidden="true">
            <use xlink:href="#icon-plus--"></use>
          </svg>

        </div>

      </div>


      <div class="button-wrapper">
        <button type="button" class="mui-btn mui-btn-block mui-btn-primary" @tap.stop.prevent="goSubmit">提交</button>
      </div>
    </div>

    <div id="page_industry_tags" class="mui-modal mui-pageSub">

          <industry-tags-indexed-list :tag_type="3" :back_id="page_industry_tags_id" :object_type="object_type"
                                      v-on:selectedIndustryTags="selectedIndustryTags">

          </industry-tags-indexed-list>

    </div>

  </div>
</template>
<script>
  import {createAPI, apiRequest, postRequest} from '../../utils/request';
  import localEvent from '../../stores/localStorage';
  import industryTagsIndexedList from '../Tags/industryTagsIndexedlist.vue';
  import MTextarea from '../../components/MTextarea.vue';

  export  default {
    data: () => ({
      name: '',
      description: '',
      gender: '',
      genderValue: '',
      workYears: '',
      industryTags: [],
      page_industry_tags_id: 'page_industry_tags',
      object_type: 'user',
      files: [],
      mobile: ''
    }),
    created () {
      //showInwehubWebview();
    },
    computed: {
      infoIndustryTagsNames() {
        if (this.industryTags) {
          var newValue = [];
          for (var i in this.industryTags) {
            newValue.push(this.industryTags[i].text);
          }
          return newValue.join();
        } else {
          return '';
        }
      },
      infoIndustryTagsCodes(){
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
    methods: {
      fixSelect:function(){
        setTimeout(() => {
          mui.trigger(mui('.mui-indexed-list-item')[0],'tap');
          mui.trigger(mui('.mui-indexed-list-item')[0],'tap');
        }, 200)
      },
      delFile(index){
        this.files.splice(index, 1);
      },
      selectImages(){
        var t = this;
        if (mui.os.plus) {
          plus.gallery.pick(function (e) {
            var name = e.substr(e.lastIndexOf('/') + 1);

            plus.zip.compressImage({
              src: e,
              dst: '_doc/' + name,
              overwrite: true,
              quality: 50
            }, function (zip) {
              if (zip.size > (10 * 1024 * 1024)) {
                return mui.toast('文件超大,请重新选择~');
              }

              var newurl = plus.io.convertLocalFileSystemURL(zip.target);

              if (mui.os.ios) {
                newurl = 'file://' + newurl;
              }

              plus.io.resolveLocalFileSystemURL(newurl, function (entry) {
                var localUrl = entry.toRemoteURL();
                t.files.push({
                  name: name,
                  path: zip.target,
                  url: localUrl
                });
              });

            }, function (zipe) {
              mui.toast('压缩失败！')
            });

          });
        } else {
            mui.alert('该功能仅支持app使用');
        }
      },
      goSubmit(){
        if (!this.name) {
          mui.toast('请填写专家姓名');
          return;
        }
        if (!this.gender) {
          mui.toast('请选择专家性别');
          return;
        }
        if (!this.workYears) {
          mui.toast('请选择从业时间');
          return;
        }
        if (!this.infoIndustryTagsNames) {
          mui.toast('请选择行业领域');
          return;
        }
        if (!this.mobile) {
          mui.toast('请填写联系电话');
          return;
        }

        if (this.mobile.length != 11) {
          mui.toast('请正确填写联系电话');
          return;
        }

        if (!this.description) {
          mui.toast('请填写专家信息');
          return;
        }

        if (!this.files.length) {
          //mui.toast('请上传专家名片');
          //return;
        }

        if (mui.os.plus) {
          this.uploadPlus();
        } else {



          postRequest(`expert/recommend`, {
            name: this.name,
            gender: this.genderValue,
            work_years: this.workYears,
            mobile: this.mobile,
            industry_tags: this.infoIndustryTagsCodes.join(','),
            description: this.description,
            images: []
          }).then(response => {
            var code = response.data.code;
            if (code !== 1000) {
              mui.alert(response.data.message);
              return;
            }

            mui.toast('提交成功');
            this.$router.replace('/home');
          });
        }

      },
      uploadPlus(){
        var that = this;
        mui.waiting();
        var task = plus.uploader.createUpload(createAPI('expert/recommend'),
          {method: "POST", blocksize: 204800, priority: 100},
          function (t, status) {
            mui.closeWaiting();
            // 上传完成
            if (status == 200) {
              var response = JSON.parse(t.responseText);
              if (response.code == 1000) {
                mui.alert('提交成功');
                that.$router.replace('/expert');
              } else {
                mui.alert(t.responseText + response.message);
              }
            } else {
              mui.alert("Upload failed: " + status);
            }
          }
        );

        for (var i in this.files) {
          var file = this.files[i];
          task.addFile(file.path, {key: "images_" + i});
        }

        task.addData("name", this.name);
        task.addData("gender", this.genderValue);
        task.addData("work_years", this.workYears);
        task.addData("mobile", this.mobile);
        task.addData("industry_tags", this.infoIndustryTagsCodes.join(','));
        task.addData("description", this.description);


        const UserLoginInfo = localEvent.getLocalItem('UserLoginInfo');
        task.setRequestHeader('Authorization', 'bearer ' + UserLoginInfo.token);
        task.start();
      },
      selectedIndustryTags(tags, object_type) {
        this.industryTags = tags;
      },
      selectGender: function () {
        var Picker = new mui.PopPicker();

        Picker.setData([
          {
            value: '1',
            text: '男'
          },
          {
            value: '2',
            text: '女'
          }
        ]);

        Picker.show(items => {
          this.gender = items[0].text;
          this.genderValue = items[0].value;
        });
      },
      selectWorkYear: function () {
        var Picker = new mui.PopPicker();

        Picker.setData([
          {
            value: '10-15年',
            text: '10-15年'
          },
          {
            value: '15-20年',
            text: '15-20年'
          },
          {
            value: '20年以上',
            text: '20年以上'
          }
        ]);

        Picker.show(items => {
          this.workYears = items[0].value;
        });
      }
    },
    mounted(){
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
    components: {
      industryTagsIndexedList,
      MTextarea
    }
  }

</script>

<style scoped>
  .professor .title {
    height: 40px;
    margin-left: 10px;
    line-height: 40px;
  }

  .professor li {
    padding: 5px 0;
  }

  .professor li input {
    color: #999;
  }

  .professor .year {
    position: absolute;
    right: 35px;
    top: 10px
  }

  .professor .link {
    display: inline-block;
    float: right;
    width: 65%;
    height: 40px;
    line-height: 37px;
    padding-right: 30px;
  }

  .mui-table-view-cell {
    padding: 0;
  }

  .expert-setting-field {
    position: absolute;
    text-align: right;
    font-size: 12px;
    width: 200px;
    right: 40px;
    color: #3f51b5;
  }

  .account_item_title {
    padding: 5px;
    color: #a6a6a6;
    font-size: 12px;
  }

  .button-wrapper {
    padding: 0 50px;
  }

  .image-list {
    width: 100%;
    /*height: 85px;*/
    background-size: cover;
    padding: 10px;
    overflow: hidden;
  }

  .image-item {
    width: 65px;
    height: 65px;
    /* background-image: url(../images/iconfont-tianjia.png); */
    background-size: 100% 100%;
    display: inline-block;
    position: relative;
    border-radius: 5px;
    margin-right: 10px;
    margin-bottom: 10px;
    border: solid 1px #e8e8e8;
    vertical-align: top;
  }

  .image-item .mui-icon {
    font-size: 40px;
    position: absolute;
    top: 11px;
    left: 11px;
    color: #ccc;
  }

  .image-item .file {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    cursor: pointer;
    z-index: 0;
  }

  .image-item .image-close {
    position: absolute;
    display: inline-block;
    right: -6px;
    top: -6px;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    border-radius: 12px;
    background-color: #FF5053;
    color: #f3f3f3;
    border: solid 1px #FF5053;
    font-size: 9px;
    font-weight: 200;
    z-index: 1;
  }

  .space .image-close {
    display: none;
  }

  .image-item .image-up:after {
    font-family: "微软雅黑";
    content: '+';
    font-size: 60px;
  }


</style>
