<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" v-show="!noback"></a>
      <h1 class="mui-title">分享</h1>
    </header>

    <div class="mui-content" v-show="!loading">

      <!--私密的样式-->
      <!--圈子信息-->
      <div v-if="!detail.group.public">
      <div class="groupsCenter">
      <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-zanwushuju"></use>
      </svg>
      <p>私密圈子内容加入后可阅读</p>
      <p @tap.stop.prevent="$router.pushPlus('/groups')">去加入</p>
      </div>
      <div class="riverBot"></div>
      <div class="groupsBot">
      <groups-list class="small"
      :list="detail.group"
      :type="'small'"
      ></groups-list>
      </div>
      </div>



      <div v-else>
        <div class="mui-table-view detail-discover">
          <UserInfo
            :uuid="detail.owner.uuid"
            :avatar="detail.owner.avatar"
            :realname="detail.owner.name"
            :isFollow="isFollow"
            :isFollowed="detail.is_followed_author?true:false"
            :isShowPositionAndCompany="false"
            :isExpert="detail.owner.is_expert?1:0"
            @setFollowStatus="setFollowStatus"
          ></UserInfo>
          <!--删除按钮-->
          <div class="discover_datail_dalete" @tap.stop.prevent="deleterow(detail.id)" v-if="userId == detail.owner.id">
            删除
          </div>
        </div>

        <div class="discoverContentWrapper">
          <div class="contentWrapper quillDetailWrapper" id="contentWrapper" @tap.stop.prevent="goArticle(detail)">
            <!--<span class="tags" v-for="(tag, index) in detail.tags" v-if="detail.tags.length">#{{tag.name}}</span>-->
            <span v-html="textToLink(detail.title)"></span><span class="color-b4b4b6 font-12" v-if="detail.data.domain"> - {{detail.data.domain}}</span>
          </div>

          <!--<Images v-if="detail.type === 'text'" :images="detail.data.img" class="newestList container-images-discover"></Images>-->
          <div class="linkWrapper Column" v-if="detail.type === 'text' && detail.data.img">
            <template v-for="(image, index) in detail.data.img">
              <img class="discover_img lazyImg" :id="'image_' + index" v-lazy="image" :data-preview-src="image"
                   :data-preview-group="1"/>
            </template>
          </div>

          <div class="linkWrapper container-image" v-if="detail.type === 'link' && detail.data.img"
               @tap.stop.prevent="goArticle(detail)">
            <img :src="detail.data.img"/>
          </div>
        </div>


        <!--是否加入圈子/group/detail/:id-->
        <div class="groups" v-if="detail.group.is_joined < 0"
             @tap.stop.prevent="$router.pushPlus('/group/detail/' + detail.group.id)">加入圈子阅读全部内容
        </div>

        <div class="timeContainer">
          <span>{{detail.views}}浏览</span>
          <span>
          <timeago :since="timeago(detail.created_at)" :auto-update="60">
          </timeago>
        </span>
          <span>著作权归作者所有</span>
        </div>
        <div class="address" v-show="detail.data.current_address_name">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-dingwei1"></use>
          </svg>
          <span>{{detail.data.current_address_name}}</span>
        </div>

        <div class="statisticsWrapper">
          <Statistics
            :groupId = detail.group.id
            :is_joined = detail.group.is_joined
            :id="detail.id"
            :commentNum="detail.comments_number"
            :isCommented="!!detail.is_commented"
            :supportNum="detail.upvotes"
            :isSupported="!!detail.is_upvoted"
            :collectNum="detail.bookmarks"
            :isCollected="!!detail.is_bookmark"
            @supportNumDesc="supportNumDesc"
            @supportNumAdd="supportNumAdd"
            @setSupportStatus="setSupportStatus"
            @collectNumDesc="collectNumDesc"
            @collectNumAdd="collectNumAdd"
            @setCollectStatus="setCollectStatus"
          ></Statistics>
        </div>
        <!--灰色部分-->
        <div class="river"></div>
        <!--圈子信息-->
        <div class="groupsList"  v-if="detail.group !== null">
          <groups-list class="small detail"
                       :list="detail.group"
                       :type="'small'"
          ></groups-list>
        </div>
        <!--灰色部分-->
        <div class="river"></div>
        <!--点赞-->
        <div class="component-dianzanList" v-if="detail.upvotes">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-dianzan1"></use>
          </svg>
          <span v-for="(item, index) in detail.supporter_list"
                @tap.stop.prevent="toAvatar(item.uuid)">{{item.name}}</span>等{{detail.upvotes}}人
        </div>
        <!--灰色部分-->
        <div class="river"></div>
        <!--评论部分-->
        <Discuss
          v-if="detail.slug"
          :groupId = detail.group.id
          :is_joined = detail.group.is_joined
          :listApi="'article/comments'"
          :listParams="{'submission_slug': detail.slug, sort: 'hot'}"
          :storeApi="'article/comment-store'"
          :storeParams="{'submission_id': detail.id}"
          @comment="comment"
          @commentFinish="commentFinish"
          ref="discuss"
        ></Discuss>
      </div>
    </div>


    <Share
      ref="ShareBtn"
      :title="shareOption.title"
      :link="shareOption.link"
      :shareName="shareOption.shareName"
      :content="shareOption.content"
      :imageUrl="shareOption.imageUrl"
      :thumbUrl="shareOption.thumbUrl"
      :targetId="slug"
      :targetType="'submission'"
      @success="shareSuccess"
      @fail="shareFail"
    ></Share>

    <commentTextarea ref="ctextarea" @sendMessage="sendMessage"></commentTextarea>
  </div>
</template>

<script>
  import {postRequest} from '../../utils/request'
  import UserInfo from './../../components/question-detail/UserInfo.vue'
  import Images from '../../components/image/Images.vue'
  import Statistics from './../../components/discover/Statistics.vue'
  import Discuss from '../../components/discover/Discuss.vue'
  import {autoTextArea, openVendorUrl, openAppUrl} from '../../utils/plus'
  import Share from '../../components/Share.vue'
  import {getTextDiscoverDetail} from '../../utils/shareTemplate'
  import {goThirdPartyArticle} from '../../utils/webview'
  import {textToLinkHtml, transferTagToLink} from '../../utils/dom'
  import localEvent from '../../stores/localStorage'

  const currentUser = localEvent.getLocalItem('UserInfo')
  import commentTextarea from '../../components/comment/Textarea.vue'
  import {pageRefresh} from '../../utils/allPlatform'
  import groupsList from '../../components/groups/GroupsList.vue'

  export default {
    data () {
      return {
        userId: currentUser.user_id,
        name: currentUser.name,
        uuid: currentUser.uuid,
        slug: '',
        noback: false,
        detail: {
          group: {
            is_joined: '',
            id: '',
            public: ''
          },
          owner: {
            id: '',
            uuid: '',
            avatar: '',
            username: ''
          },
          id: 0,
          supporter_list: [],
          data: {
            img: []
          },
          created_at: ''
        },
        shareOption: {
          title: '',
          link: '',
          content: '',
          imageUrl: '',
          thumbUrl: '',
          shareName: ''
        },
        isFollow: true,
        loading: 1
      }
    },
    computed: {
      descLength () {
        if (this.description === this.descPlaceholder) {
          return 0
        }
        return this.description.length
      }
    },
    components: {
      UserInfo,
      Images,
      Statistics,
      Discuss,
      Share,
      commentTextarea,
      groupsList
    },
    methods: {
      showAllContentWrapper () {
        var contentWrapper = document.querySelector('.discoverContentWrapper')
        if (contentWrapper) {
          contentWrapper.classList.remove('shortContentWrapper')
        }
      },
      goJoin (id) {
        this.$router.pushPlus('/group/detail/' + id)
      },
      // 删除
      deleterow (id) {
        var btnArray = ['取消', '确定']
        window.mui.confirm('确定删除吗？', ' ', btnArray, (e) => {
          if (e.index === 1) {
            // 进行删除
            postRequest(`article/destroy-submission`, {
              id: id
            }).then(response => {
              var code = response.data.code
              // 如果请求不成功提示信息 并且返回上一页；
              if (code !== 1000) {
                window.mui.alert(response.data.message)
                window.mui.back()
                return
              }
              if (response.data.data) {
                window.mui.back()
                window.mui.toast('删除成功')
              }
            })
          }
        })
      },
      textToLink (text) {
        return transferTagToLink(textToLinkHtml(' ' + text))
      },
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      sendMessage (message) {
        this.$refs.discuss.sendMessage(message)
      },
      comment (commentTargetName) {
        this.$refs.ctextarea.comment(commentTargetName)
      },
      commentFinish () {
        this.commentNumAdd()
        this.$refs.ctextarea.finish()
      },
      goArticle: function (detail) {
        if (detail.type !== 'link') {
          return
        }

        goThirdPartyArticle(
          detail.data.url,
          detail.id,
          detail.title,
          '/c/' + detail.category_id + '/' + detail.slug,
          detail.data.img
        )
      },
      refreshPageData () {
        this.loading = 1
        this.detail.data.img = []
        this.getDetail()
        this.$refs.ctextarea.refreshPageData()
      },
      shareSuccess () {
      },
      shareFail () {
      },
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      getDetail: function () {
        this.slug = this.$route.params.slug
        this.noback = !!this.$route.query.noback

        if (!this.slug) {
          this.$router.back()
          return
        }

        postRequest(`article/detail-by-slug`, {slug: this.slug}).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }

          this.detail = response.data.data

          this.shareOption = getTextDiscoverDetail('/c/' + this.detail.category_id + '/' + this.detail.slug, this.detail.title, this.detail.owner.avatar, this.detail.owner.name)

          this.loading = 0
        })
      },
      setFollowStatus (status) {
        this.detail.is_followed_author = status
      },
//      点赞
      supportNumAdd () {
        this.detail.upvotes++
        var support = {
          name: this.name,
          uuid: this.uuid
        }
        this.detail.supporter_list = this.detail.supporter_list.concat(support)
      },
//      取消点赞
      supportNumDesc () {
        this.detail.upvotes--
        for (var i in this.detail.supporter_list) {
          if (this.detail.supporter_list[i].uuid === this.uuid) {
            this.detail.supporter_list.splice(i, 1)
          }
        }
      },
      commentNumAdd () {
        this.detail.comments_number++
      },
      commentNumDesc () {
        this.detail.comments_number--
      },
      setSupportStatus (type) {
        this.detail.is_upvoted = type === 'upvote' ? 1 : 0
      },
      collectNumAdd () {
        this.detail.bookmarks++
      },
      collectNumDesc () {
        this.detail.bookmarks--
      },
      setCollectStatus (type) {
        this.detail.is_bookmark = type === 'bookmarked' ? 1 : 0
      },
      shotContentHeight () {
        if (this.detail.group.is_joined !== -1) {
          this.showAllContentWrapper()
          return
        }

        var contentWrapper = document.querySelector('.discoverContentWrapper')
        console.warn('contentWrapperHeight:' + contentWrapper.offsetHeight)
        if (contentWrapper && contentWrapper.offsetHeight > 300) {
          contentWrapper.classList.add('shortContentWrapper')
        }
      }
    },
    updated () {
      this.$nextTick(function () {
        setTimeout(() => {
          this.shotContentHeight()
        }, 200)

        openVendorUrl(this.$el.querySelector('#contentWrapper'))
        openAppUrl(this.$el.querySelector('#contentWrapper'))
      })
    },
    watch: {
      '$route': 'refreshPageData'
    },
    created () {
      this.getDetail()
    },
    mounted () {
      pageRefresh(this, () => {
        this.refreshPageData()
      })
      window.mui.previewImage()
      autoTextArea()
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .detail-discover {
    padding-bottom: 0;
    margin-top: 0 !important;
  }

  .detail-discover:before {
    display: none;
  }

  .detail-discover:after {
    display: none;
  }

  .contentWrapper {
    padding: 0 0.4rem;
    white-space: pre-line !important;
    font-size: 0.4rem;
    color: #444;
  }

  .contentWrapper .tags {
    color: rgb(33, 77, 120);
    margin-right: 0.16rem;
  }

  .newestList {
    padding: 0.266rem 0.4rem 0;
    background: #fff;
  }

  .linkWrapper {
    padding: 0.266rem 0.4rem;
  }

  .timeContainer {
    width: 100%;
    font-size: 0.32rem;
    color: #B4B4B6;
    padding: 0 0.4rem;
    background: #fff;
  }

  .timeContainer span:nth-of-type(3) {
    float: right;
  }

  .address {
    width: 100%;
    padding: 0 0.4rem;
    background: #fff;
    font-size: 0.32rem;
    color: #808080;
    margin-top: -0.106rem;
  }

  .statistics {
    background: #fff;
  }

  .mui-content {
    background: #fff;
  }

  .statisticsWrapper {
    padding: 0 0.4rem 0.4rem;
  }

  /*点赞样式*/
  .component-dianzanList {
    width: 100%;
    padding: 0.346rem 0.4rem;
  }

  .component-dianzanList span {
    font-size: 0.346rem;
    color: #03aef9;
  }

  .contentWrapper span {
    font-size: 0.4rem;
  }

  .Column {
    width: 100%;
    height: max-content;
  }

  .Column .discover_img {
    width: 100%;
    border-radius: 0.106rem;
    margin-bottom: 0.133rem;
  }

  .Column img:nth-last-child(1) {
    margin-bottom: 0;
  }

  /*删除按钮*/
  .discover_datail_dalete {
    width: 1.52rem;
    height: 0.506rem;
    border: 0.026rem solid #444444;
    text-align: center;
    line-height: 0.453rem;
    font-size: 0.346rem;
    color: #444444;
    border-radius: 1.333rem;
    position: absolute;
    right: 0.426rem;
    top: 0.426rem;
  }

  .groups {
    width: 92%;
    margin-left: 4%;
    text-align: center;
    height: 0.906rem;
    line-height: 0.906rem;
    border-radius: 0.106rem;
    border: 0.026rem solid #DCDCDC;
    margin-bottom: 0.346rem;
    font-size: 0.373rem;
    color: #03AEF9;
  }

  .groupsList {
    width: 92%;
    margin-left: 4%;
    padding-bottom: 0.266rem;
  }

  .groupsBot {
    width: 92%;
    margin-left: 4%;
    padding-bottom: 0.266rem;
    position: fixed;
    bottom: 0;
  }

  .riverBot {
    width: 100%;
    height: 0.266rem;
    position: fixed;
    bottom: 1.786rem;
    background: #f3f4f6;
  }

  .groupsCenter {
    width: 5.333rem;
    height: 4.266rem;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
  }

  .groupsCenter svg {
   font-size: 1.866rem;
  }

  .groupsCenter p:nth-of-type(1) {
    font-size: 0.32rem;
    color: #C8C8C8;
    text-align: center;
    margin-top: 0.186rem;
    margin-bottom: 0.56rem;
  }
  .groupsCenter p:nth-of-type(2) {
    width:3.066rem;
    height:1.093rem;
    line-height:1.093rem;
    background:#03AEF9;
    border-radius: 1.333rem;
    font-size: 0.426rem;
    color: #FFFFFF;
    text-align: center;
    margin: auto;
  }

  .shortContentWrapper{
    max-height:8rem;
    overflow: hidden;
    position: relative;
    margin-bottom: 0.266rem;
  }
</style>

