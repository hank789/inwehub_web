<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">邀请回答</h1>
    </header>

    <div class="mui-content">
      <Contact
        @click="choose"
        :list="list"
        v-model="lastList"
        :search="search">
        <div slot="header" class="indexHeader">
          <div class="searchWrapper">
            <input type="text"
                   placeholder="输入用户名" v-model.trim="search">
          </div>

          <div class="notFound">
            找不到成员？<span>添加新的关注</span> 或 <span @tap.stop.prevent="toFollowMore()">微信直接邀请</span>
          </div>

        </div>

        <div class="indexTitle">
          已关注的成员
        </div>

        <div class="groupWrapper">
          <ul v-for="(list, key) in lastList" class="index-bar-group">
            <li :id="key" class="index-bar-cell index-bar-cell-head">{{key}}</li>
            <li v-for="(item, index) in list" :key="index" :data-raw="item.raw"
                class="index-bar-cell tap-active" :class="{bottomBorder:index !== list.length-1  }">

              <div class="avatar">
                <div class="avatarInner" @tap.stop.prevent="">
                  <img :src="item.avatar_url">

                  <svg class="icon" aria-hidden="true" v-show="item.is_expert">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </div>
              </div>

              <div class="textBody ">
                <div class="name mui-ellipsis">{{item.name}} &nbsp;</div>
                <div class="desc mui-ellipsis">{{item.description}} &nbsp;</div>
              </div>

              <div class="ibutton active" v-if="item.is_answered">已回答</div>
              <div class="ibutton active" v-else-if="item.is_invited">已邀请</div>
              <div class="ibutton" @tap.stop.prevent="chooseItem(item)" v-else>邀请</div>

            </li>
          </ul>
        </div>
      </Contact>
    </div>
    <Share
      ref="ShareBtn"
      :hideShareBtn="true"
      :title="shareTitle"
      :shareName="shareName"
      :link="shareUrl"
      :content="shareContent"
      :imageUrl="shareImg"
      :thumbUrl="shareImg"
      :targetId="id"
      :targetType="'invite_answer'"
      @success="shareSuccess"
      @fail="shareFail"
    ></Share>
  </div>
</template>

<script>

  import Contact from './../components/contact/Index.vue'
  import { postRequest } from '../utils/request'
  import Share from '../components/Share.vue'
  import { getInviteAnswerDetail } from '../utils/shareTemplate'

  export default {
    data () {
      return {
        id: 0,
        search: '',
        username: '',
        shareUrl: '',
        shareImg: '',
        shareTitle: '',
        shareName: '',
        shareContent: '',
        answernum: 0,
        followednum: 0,
        title: '',
        list: [],
        lastList: []
      }
    },
    components: {
      Contact,
      Share
    },
    computed: {},
    methods: {
      shareSuccess () {

      },
      shareFail () {

      },
      choose (item) {
        postRequest(`question/inviteAnswer`, {
          question_id: this.id,
          user_id: item.id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }
        })
      },
      toFollowMore () {
        this.$refs.ShareBtn.share()
      },
      getList (id) {
        postRequest(`question/inviterList`, {
          question_id: id
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            window.mui.back()
            return
          }

          if (response.data.data.length > 0) {
            this.list = response.data.data
          }
          this.loading = 0
        })
      },
      refreshPageData () {
        console.log('refreshPageData')
        this.id = parseInt(this.$route.params.id)
        this.username = this.$route.query.username
        this.title = this.$route.query.title
        this.answernum = this.$route.query.answernum
        this.followednum = this.$route.query.followednum

        var shareOptions = getInviteAnswerDetail(
          this.id,
          this.title,
          this.answernum,
          this.followednum
        )

        this.shareUrl = shareOptions.link
        this.shareImg = shareOptions.imageUrl
        this.shareContent = shareOptions.shareContent
        this.shareName = shareOptions.shareName
        this.shareTitle = shareOptions.title

        this.getList(this.id)
      },
      chooseItem (item) {
        item.is_invited = true
        this.choose(item)
      }
    },
    watch: {
      '$route': 'refreshPageData'
    },
    mounted () {
      window.addEventListener('refreshData', (e) => {
        // 执行刷新
        console.log('refresh-contact')
        this.refreshPageData()
      })
    },
    created () {
      this.refreshPageData()
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .indexHeader {
    background-color: #f3f4f6;
    padding: 10px 15px;

    .searchWrapper {

      input {
        height: 34px;
        font-size: 14px;
        border-radius: 50px;
        background: #fff;
        border: 1px solid #dcdcdc;
        margin-bottom: 5px;

        &::placeholder {
          color: #c8c8c8;
        }
      }
    }

    .notFound {
      font-size: 13px;
      color: #808080;

      span {
        color: #03aef9;
      }
    }
  }

  .indexTitle {
    background: #ececee;
    font-size: 13px;
    height: 25px;
    line-height: 25px;
    padding: 0 15px;
    color: #808080;
  }

  .mui-content {
    background: #fff;
  }
</style>
