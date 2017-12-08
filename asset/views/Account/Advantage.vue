<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的擅长</h1>
    </header>

    <div class="mui-content absolute">
      <ul class="myLabel" v-if="skill_tags.length">
        <p>擅长标签</p>
        <li v-for="(item, index) in skill_tags">
          {{item.text}}
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="delSkillTag(item.value)">
            <use xlink:href="#icon-times--"></use>
          </svg>
        </li>
      </ul>
      <div class="gray" v-if="skill_tags.length"></div>

      <div class="addLable">
        <p>添加标签</p>
        <div class="search">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <input type="text" v-model="searchText" />
        </div>
        <ul>
          <li>
            <p>搜不到?</p>
            <p @tap.stop.prevent="Obtain()">申请添加</p>
            <i class="bot"></i>
          </li>
          <!--搜素到的标签名 -->
          <li v-if="list.length" v-for="(item, index) in list" @tap.stop.prevent="addSkillTag(item.value,item.text)">
            {{item.text}}
            <i class="bot"></i>
          </li>

        </ul>

      </div>

    </div>
  </div>
</template>

<script>
  import { searchText } from '../../utils/search'
  import { postRequest } from '../../utils/request'

  export default {
    data () {
      return {
        searchText: '',
        loading: 1,
        list: [],
        skill_tags: [],
        tags: []
      }
    },
    methods: {
      Obtain () {
        var that = this

        var btnArray = ['取消', '确定']
        window.mui.prompt('', '标签名称', '输入标签名称', btnArray, function (e) {
          if (e.index === 1) {
            // 申请添加擅长标签；
            if (e.value) {
              that.applySkillTag(e.value)
            }
          }
        }, 'div')
      },
      // 删除擅长标签；
      delSkillTag (val) {
//      console.error(val);
        postRequest('profile/delSkillTag', {
          tags: [val]
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
//        console.error(response.data);
          window.mui.toast('删除成功')
          // 刷新我的擅长列表；
          this.skillTags()

          this.loading = 0
        })
      },
      // 添加擅长标签；
      addSkillTag (val, text) {
//      console.error(text);
        postRequest('profile/addSkillTag', {
          tags: [val]
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          var data = []
          for (var i = 0; i < this.skill_tags.length; i++) {
            data.push(this.skill_tags[i].text)
          }

          // 判断是否已经添加；
          if (data.indexOf(text) > -1) {
            // 有重复；
            window.mui.toast('已经添加')
          } else {
            // 无重复；
 //          mui.toast("添加成功");
          }

          // 刷新我的擅长列表
          this.skillTags()
          this.loading = 0
        })
      },
      // 申请添加擅长标签；
      applySkillTag (text) {
        postRequest('system/applySkillTag', {
          tag_name: text
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
          window.mui.toast('申请提交成功')
          this.loading = 0
        })
      },
      // 我的擅长列表；
      skillTags () {
        postRequest('profile/info', {}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          if (response.data.data.info.skill_tags.length >= 0) {
            this.skill_tags = response.data.data.info.skill_tags
          }
          this.loading = 0
        })
      },
      // 搜索标签列表；
      search (text) {
        // 判断是否为空；
        if (text) {
          postRequest('tags/load', {
            tag_type: 5,
            word: text
          }).then(response => {
            var code = response.data.code
            if (code !== 1000) {
              window.mui.alert(response.data.message)
              window.mui.back()
              return
            }
            if (response.data.data.tags.length > 0) {
              this.list = response.data.data.tags
            }
            this.loading = 0
          })
        } else {
          this.list = []
        }
      }
    },
    watch: {
      searchText: function (newValue) {
        if (!newValue) {
          this.list = []
        }
        searchText(newValue, () => {
          this.search(newValue)
        })
      }
    },
    mounted () {
      this.skillTags()
    }
  }
</script>

<style scoped>
  ul,
  li,
  p,
  span,
  a,
  i {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .bot {
    position: absolute;
    right: 0px;
    bottom: 0;
    left: 0px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .mui-content {
    background: #FFFFFF;
  }

  .myLabel {
    width: 100%;
    overflow: hidden;
    background: #FFFFFF;
    padding: 0 4% 15px 2%;
  }

  .myLabel p {
    font-size: 13px;
    margin-top: 15px;
    margin-bottom: 4px;
    color: #808080;
    margin-left: 10px;
  }

  .myLabel li {
    display: inline-block;
    background: #f3f4f6;
    border: 8px;
    border-radius: 4px;
    padding: 5px 12px 5px 10px;
    margin-top: 10px;
    margin-left: 10px;
  }

  .myLabel li svg {
    font-size: 10px;
    color: #c8c8c8;
    margin-bottom: 2px;
    margin-left: 5px;
  }

  .gray {
    width: 100%;
    height: 10px;
    background: #f3f4f6;
  }

  .addLable {
    width: 100%;
    background: #FFFFFF;
    padding: 15px 4% 0 4%;
  }

  .addLable p {
    font-size: 13px;
    color: #808080;
  }

  .search {
    width: 100%;
    height: 38px;
    margin-top: 9px;
    background: #F3F4F5;
    border-radius: 100px;
  }

  .search svg {
    font-size: 17px;
    color: #c8c8c8;
    margin-top: 9px;
    margin-left: 16px;
    /*margin-right: 5px;*/
    float: left;
  }

  .search input {
    background: #F3F4F5;
    width: 80%;
    height: 35px;
    margin-top: 2px;
    float: left;
    border: none;
    font-size: 14px;
    color: #444444;
  }

  .addLable ul {
    width: 100%;
    overflow: hidden;
    margin-top: 22px;
  }

  .addLable ul li {
    width: 100%;
    height: 44px;
    position: relative;
    text-align: left;
    line-height: 44px;
    font-size: 14px;
    color: #808080;
  }

  .addLable ul li:nth-of-type(1) p:nth-of-type(1) {
    float: left;
    color: #03aef9;
  }

  .addLable ul li:nth-of-type(1) p:nth-of-type(2) {
    width: 86px;
    height: 27px;
    border: 1px solid #03aef9;
    border-radius: 100px;
    text-align: center;
    line-height: 27px;
    margin-top: 8.5px;
    float: right;
    color: #03aef9;
  }
  /*按钮的color*/

  .mui-popup-buttons span.mui-popup-buttons span.mui-popup-button {
    color: #808080;
  }
</style>
