<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">我的擅长</h1>
    </header>

    <div class="mui-content absolute">
      <ul class="myLabel" >
        <div>
          <!--{{selectNum}}-->
          <p>标签（{{skill_tags.length}}／20） </p>
          <p>让机遇更精准匹配，让内容更容易检索 </p>
          <button @tap.stop.prevent="keepTags()">确认保存</button>
        </div>
        <li v-for="(item, index) in skill_tags" v-if="skill_tags.length" @tap.stop.prevent="toTagDetail(item.text)">
          {{item.text}}
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="delSkillTag(item.value)">
            <use xlink:href="#icon-times--"></use>
          </svg>
        </li>
      </ul>
      <div class="gray"></div>

      <div class="addLable">
        <p>添加标签</p>
        <div class="search">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuo"></use>
          </svg>
          <input type="text" v-model="searchText" maxlength="15"/>
        </div>
        <ul>
          <!--搜素到的标签名 -->
          <li  v-if="isNewTag" @tap.stop.prevent="addSkillTag(list[0])">
            {{list[0].text}}<span>  (新标签)</span>
            <i class="bot"></i>
          </li>

          <li v-for="(item, index) in list" @tap.stop.prevent="addSkillTag(item)" v-if="!(isNewTag && index === 0)">
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
  import {getIndexByIdArray} from '../../utils/array'
  import localEvent from '../../stores/localStorage'
  import userAbility from '../../utils/userAbility'
  const currentUser = localEvent.getLocalItem('UserInfo')

  export default {
    data () {
      return {
        searchText: '',
        loading: 1,
        list: [],
        skill_tags: [],
        id: currentUser.user_id,
        sort: 1,
        selectNum: 0,
        tagName: [],
        newTagName: [],
        TagValue: [],
        oldAddTags: [],
        isupload: 1
      }
    },
    computed: {
      isNewTag () {
        if (this.list[0] && typeof (this.list[0].value) === 'string') {
          return true
        }
        return false
      }
    },
    methods: {
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      // 保存擅长标签；
      keepTags () {
        postRequest('profile/addSkillTag', {
          tags: this.TagValue,
          new_tags: this.newTagName
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          window.mui.toast('保存成功')
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
      // 删除擅长标签；
      delSkillTag (val) {
        var num = getIndexByIdArray(this.skill_tags, val)
        this.skill_tags.splice(num, 1)
        if (typeof (val) === 'number') {
          var m = this.TagValue.indexOf(val)
          this.TagValue.splice(m, 1)
          window.mui.toast('删除成功')
        } else {
          var index = this.newTagName.indexOf(val)
          this.newTagName.splice(index, 1)
        }
      },
      // 添加擅长标签；
      addSkillTag (item) {
        this.isupload = 0
        var index = getIndexByIdArray(this.skill_tags, item.value, 'value')
        if (index >= 0) {
          window.mui.toast('重复添加')
        } else {
          var list = {
            id: item.value,
            value: item.value,
            text: item.text
          }
//          选中的标签添加到数组中
          if (this.skill_tags.length < 20) {
            this.skill_tags.push(list)
         // 筛选新标签
            if (typeof (list.value) === 'string') {
              this.newTagName.push(list.value)
            } else {
              this.TagValue.push(list.value)
            }

            window.mui.toast('添加成功')
            this.searchText = ''
          } else {
            window.mui.toast('最多添加20个标签')
          }
        }
      },
      // 搜索标签列表；
      search (text, sort) {
        // 判断是否为空；
        postRequest('tags/load', {
          tag_type: 5,
          word: text,
          sort: this.sort
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          if (response.data.data.tags.length > 0) {
            this.list = response.data.data.tags
            for (var i = 0; i < this.list.length; i++) {
              this.tagName.push(this.list[i].text)
            }
          }
          if (!text) return

          var searchText = text.trim()
          if (searchText) {
            if (this.tagName.indexOf(searchText) === -1) {
              var obj = {
                text: searchText,
                value: searchText
              }
              if (typeof (this.list[0].value) !== 'string') {
                this.list.unshift(obj)
              } else {
                this.list[0].text = searchText
                this.list[0].value = searchText
              }
            }
          }
          this.loading = 0
        })
      }
    },
    watch: {
      searchText: function (newValue) {
        if (!newValue) {
          // 当无搜索内容时候
//          this.list = []
          this.sort = 1
          setTimeout(() => {
            this.search()
          }, 1100)
          return
        }
        this.sort = 0
        searchText(newValue, (text) => {
          this.search(newValue)
        })
      }
    },
    mounted () {
      // 默认加载热门标签
      this.sort = 1
      this.search()
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
    position: relative;
  }

  .myLabel div {
    font-size: 13px;
    margin-top: 15px;
    color: #808080;
    margin-left: 10px;
  }
  .myLabel button{
    width:75px;
    height:30px;
    background: #03aef9;
    font-size: 14px;
    color: #FFFFFF;
    border-color: #03aef9;
    position: absolute;
    right:4%;
    top:15px;
    padding: 0;
  }

  .myLabel li {
    display: inline-block;
    background: #f3f4f6;
    border: 8px;
    border-radius: 4px;
    padding: 5px 12px 5px 10px;
    margin-top: 10px;
    margin-left: 10px;
    color:#4c4c4c;
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

  /*按钮的color*/

  .mui-popup-buttons span.mui-popup-buttons span.mui-popup-button {
    color: #808080;
  }
</style>
