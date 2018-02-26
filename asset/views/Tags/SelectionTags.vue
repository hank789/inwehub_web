<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">选择标签</h1>
    </header>

    <div class="mui-content absolute">
      <ul class="myLabel" >
        <div>
          <!--{{selectNum}}-->
          <p>标签（{{skill_tags.length}}／20） </p>
          <p>让机遇更精准匹配，让内容更容易检索 </p>
          <button @tap.stop.prevent="keepTags()">确认保存</button>
        </div>
        <li v-for="(item, index) in skill_tags" v-if="skill_tags.length">
          {{item.text}}
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="delSkillTag(item.text)">
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
  const currentUser = localEvent.getLocalItem('UserInfo')

  export default {
    data () {
      return {
        searchText: '',
        loading: 1,
        list: [],
        skill_tags: [],
        tags: [],
        id: currentUser.user_id,
        sort: 1,
        selectNum: 0,
        tagName: []
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
      // 删除擅长标签；
      delSkillTag (text) {
        for (var i in this.skill_tags) {
          if (this.skill_tags[i].text === text) {
            this.skill_tags.splice(i, 1)
          }
        }
      },
      keepTags () {
        if (this.$route.query.from === 'ask' || this.$route.query.from === 'interaction' || this.$route.query.from === 'discover') {
          localEvent.setLocalItem(this.$route.query.from + '_skill_tags' + this.id, this.skill_tags)
          window.mui.back()
          return
        } else {
          return false
        }
      },
      // 添加擅长标签；
      addSkillTag (item) {
        var index = getIndexByIdArray(this.skill_tags, item.value)
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
      if (this.$route.query.from === 'ask' || this.$route.query.from === 'interaction' || this.$route.query.from === 'discover') {
        this.skill_tags = localEvent.getLocalItem(this.$route.query.from + '_skill_tags' + this.id)
        this.selectNum = localEvent.getLocalItem(this.$route.query.from + '_skill_tags' + this.id).length
      } else {
        return false
      }
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
    right: 0rem;
    bottom: 0;
    left: 0rem;
    height: 0.1rem;
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
    padding: 0 4% 1.5rem 2%;
    position: relative;
  }

  .myLabel div {
    font-size: 1.3rem;
    margin-top: 1.5rem;
    color: #808080;
    margin-left: 1rem;
  }
  .myLabel button{
    width:7.5rem;
    height:3rem;
    background: #03aef9;
    font-size: 1.4rem;
    color: #FFFFFF;
    border-color: #03aef9;
    position: absolute;
    right:4%;
    top:1.5rem;
    padding: 0;
  }

  .myLabel li {
    display: inline-block;
    background: #f3f4f6;
    border: 0.8rem;
    border-radius: 0.4rem;
    padding: 0.5rem 1.2rem 0.5rem 1rem;
    margin-top: 1rem;
    margin-left: 1rem;
    color:#4c4c4c;
  }

  .myLabel li svg {
    font-size: 1rem;
    color: #c8c8c8;
    margin-bottom: 0.2rem;
    margin-left: 0.5rem;
  }

  .gray {
    width: 100%;
    height: 1rem;
    background: #f3f4f6;
  }

  .addLable {
    width: 100%;
    background: #FFFFFF;
    padding: 1.5rem 4% 0 4%;
  }

  .addLable p {
    font-size: 1.3rem;
    color: #808080;
  }

  .search {
    width: 100%;
    height: 3.8rem;
    margin-top: 0.9rem;
    background: #F3F4F5;
    border-radius: 10rem;
  }

  .search svg {
    font-size: 1.7rem;
    color: #c8c8c8;
    margin-top: 0.9rem;
    margin-left: 1.6rem;
    /*margin-right: 0.5rem;*/
    float: left;
  }

  .search input {
    background: #F3F4F5;
    width: 80%;
    height: 3.5rem;
    margin-top: 0.2rem;
    float: left;
    border: none;
    font-size: 1.4rem;
    color: #444444;
  }

  .addLable ul {
    width: 100%;
    overflow: hidden;
    margin-top: 2.2rem;
  }

  .addLable ul li {
    width: 100%;
    height: 4.4rem;
    position: relative;
    text-align: left;
    line-height: 4.4rem;
    font-size: 1.4rem;
    color: #808080;
  }

  /*按钮的color*/

  .mui-popup-buttons span.mui-popup-buttons span.mui-popup-button {
    color: #808080;
  }
</style>
