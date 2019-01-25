<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title">发布</h1>
      <div class="submit font-family-medium" @tap.stop.prevent="submit">确认发布</div>
    </header>
    <div class="mui-content" v-if="!loading">

      <div class="shareTitle font-family-medium">分享到首页</div>

      <div class="inputWrapper">
        <input class="input" v-model="url" type="text" placeholder="输入文章链接">
        <div class="line-river-after line-river-after-top"></div>
      </div>

      <div class="linkWrapper" v-show="urlTitle">
        <div class="leftText">
          <div class="text font-family-medium text-line-2">{{ urlTitle }}</div>
          <svg class="icon" aria-hidden="true" @tap.stop.prevent="resetUrl">
            <use xlink:href="#icon-times--"></use>
          </svg>
        </div>
        <div class="right" v-show="urlImage">
          <div class="articleImg">
            <ImageView :src="urlImage" width="97" height="71"></ImageView>
          </div>
        </div>
      </div>

      <div class="tagsWapper">
        <div class="title">所属领域</div>

        <div class="tagsList">
          <span v-for="(item, index) in regions" v-if="item.value>0" :class="{active: item.selected}" @tap.stop.prevent="choiceItem(index, item)">{{item.text}}</span>
        </div>
      </div>

      <div class="footerWrapper">
        <div class="text"><span>1.</span>分享的文章链接会出现在首页的全部中</div>
        <div class="text"><span>2.</span>热门的文章链接会被推荐</div>
        <div class="text"><span>3.</span>优质内容会得到更多的曝光和传播</div>
      </div>

    </div>
  </div>
</template>

<script>
  import { getHomeData } from '../../utils/home'
  import Vue from 'vue'
  import { fetchArticle, isUrl } from '../../utils/url'
  import { searchText } from '../../utils/search'
  import { postRequest } from '../../utils/request'
  import { customCheckClipbord } from '../../utils/allPlatform'
  import { needRefresh } from '../../utils/plus'
  import localEvent from '../../stores/localStorage'

  export default {
    data () {
      return {
        loading: 1,
        regions: [],
        originRegions: [],
        urlTitle: '',
        urlImage: '',
        url: ''
      }
    },
    components: {
    },
    created () {
      this.refreshPageData()
      this.monitorResume()
    },
    watch: {
      url: function (newValue) {
        searchText(newValue, (text) => {
          var rs = isUrl(text)
          if (rs) {
            this.fetchUrlInfo(newValue)
          } else {
            window.mui.toast('请正确输入文章链接')
          }
        })
      }
    },
    methods: {
      resetUrl () {
        this.url = ''
        this.urlTitle = ''
        this.urlImage = ''
      },
      resetData () {
        this.resetUrl()
        this.regions = JSON.parse(JSON.stringify(this.originRegions))
      },
      fetchUrlInfo (url) {
        fetchArticle(this, url, (data) => {
          this.urlTitle = data.title
          this.urlImage = data.img_url
        })
      },
      submit () {
        if (!this.url) {
          window.mui.toast('请输入文章链接')
          return
        }

        var selectedTags = []
        for (var i = 0; i < this.regions.length; i++) {
          if (this.regions[i].selected) {
            selectedTags.push(this.regions[i].value)
          }
        }

        var data = {
          type: 'link',
          title: this.urlTitle,
          url: this.url,
          tags: selectedTags,
          draft: 0
        }
        postRequest(`article/store`, data).then(response => {
          var code = response.data.code
          if (code === 6101) {
            // 已存在
            window.mui.toast(response.data.message)
            this.$router.replace(response.data.data.exist_url)
            return
          }
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          this.resetData()
          needRefresh()
          localEvent.setLocalItem('refreshHomeByAddLink', {status: true})
          this.$router.pushPlus('/home')
        })
      },
      choiceItem (index, item) {
        item.selected = item.selected ? 0 : 1
        Vue.set(this.regions, index, item)
      },
      refreshPageData () {
        getHomeData((data) => {
          this.regions = data.regions
          this.originRegions = data.regions
          this.loading = 0
        })

        this.checkClipbord()
      },
      monitorResume () {
        window.addEventListener('resume', () => {
          this.checkClipbord()
        }, false)
      },
      checkClipbord () {
        customCheckClipbord((text) => {
          var urlReg = /[a-zA-z]+:\/\/[^\s"']*/g
          if (!urlReg.test(text)) {
            return
          }

          var matchs = text.match(urlReg)
          var firstMatch = matchs[0]
          window.mui.confirm('检测到您剪切板中有链接，是否添加？', '分享', ['取消', '确定'], e => {
            if (e.index === 1) {
              this.url = firstMatch
            }
          }, 'div')
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .mui-content {
    background: #FFF;
  }
  .submit {
    color: #03AEF9;
    font-size: 0.4rem;
    position: absolute;
    right: 0.426rem;
    top: 0.306rem;
  }
  .shareTitle {
    font-size: 0.533rem;
    color: #444444;
    text-align: center;
    margin: 0.933rem 0 1.466rem;
  }

  .inputWrapper {
    padding: 0 0.666rem;
    .input {
      border: none;
      margin-bottom: 0;
      padding-left: 0;
    }
  }

  .linkWrapper {
    display: flex;
    padding: 0 0.666rem;
    margin-top: 0.533rem;
    justify-content: space-between;
    .leftText {
      .text {
        color: #444444;
        font-size: 0.426rem;
        line-height: 0.613rem;
      }
      .icon {
        font-size: 0.213rem;
        color: #808080;
        margin-top: 0.293rem;
      }
    }
    .right {
      margin-left: 0.373rem;
      .articleImg {
        width: 2.586rem;
        height: 1.893rem;
        img {
          width: 100%;
          height: 100%;
          border-radius: 0.106rem;
          object-fit: cover;
        }
      }
    }
  }
  .tagsWapper {
    padding: 0 0.666rem;
    margin-top: 0.533rem;
    .title {
      color: #B4B4B6;
      font-size: 0.293rem;
    }
    .tagsList {
      margin-top: 0.213rem;
      font-size: 0;
      span {
        color: #444444;
        font-size: 0.32rem;
        padding: 0.133rem 0.266rem;
        border-radius: 2.666rem;
        display: inline-block;
        background: #F3F4F6;
        margin-right: 0.266rem;
        margin-bottom: 0.266rem;
        &.active {
          color: #FFF;
          background: #03AEF9;
        }
      }
    }
  }

  .footerWrapper {
    position: absolute;
    bottom: 0.8rem;
    left: 0.666rem;
    .text {
      color: #C8C8C8;
      font-size: 0.293rem;
      line-height: 0.506rem;
      span {
        margin-right: 0.213rem;
      }
    }
  }
</style>
