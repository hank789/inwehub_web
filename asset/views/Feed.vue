<template>
  <div>
    <HomeSearch :unread_count="unread_count" :contact_id="contact_id"></HomeSearch>

    <div class="mui-content">
      <div class="container-tabs">
        <div class="tab" :class="{active: search_type === 2}" @tap.stop.prevent="switchSearchType(2)"><span>全部</span></div>
        <div class="tab" :class="{active: search_type === 6}" @tap.stop.prevent="switchSearchType(6)"><span>推荐</span></div>
      </div>

      <RefreshList
        ref="RefreshList"
        v-model="list"
        :api="'feed/list'"
        :prevOtherData="prevOtherData"
        :nextOtherData="nextOtherData"
        :pageMode = "true"
        :isShowUpToRefreshDescription="false"
        :list="list"
        :emptyDescription="emptyDescription"
        class="listWrapper"
      >

        <template v-for="(item, index) in list">

          <div class="component-feed-item-guide" v-if="index === 2 && search_type === 6">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-gongkai"></use>
            </svg>
            <div class="desc">关注你感兴趣的人和圈子，了解他们的最新动态</div>
            <div class="buttonWrapper" @tap.stop.prevent="$router.pushPlus('/userGuide/stepone')">
              <button>去看看</button>
            </div>
          </div>

          <div class="line-river-big" v-if="index === 2 && search_type === 6"></div>

          <!-- 发布了分享 -->
          <div @tap.stop.prevent="toDetail(item)" class="container-feed-discover-add" v-if="item.feed_type === 15">
            <div class="container-avatarAndTwoLineText">
              <div class="avatar" @tap.stop.prevent="toResume(item.user.uuid)">
                <div class="avatarInner"><img :src="item.user.avatar">
                  <svg class="icon" aria-hidden="true" v-show="item.user.is_expert">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </div>
              </div>
              <div class="mui-media-body">
                <div class="lineWrapper-1">{{ item.title }}
                  <div class="component-label component-label-top" v-show="item.top > 0">顶</div>
                </div>
                <div class="lineWrapper-2">{{ item.created_at }}
            <svg class="icon addressIcon" aria-hidden="true" v-show="item.feed.current_address_name">
                  <use xlink:href="#icon-dingwei1"></use>
                </svg><span class="address">{{ item.feed.current_address_name }}</span>
                </div>
              </div>
            </div>
            <div class="contentWrapper"><span v-for="tag in item.feed.tags" @tap.stop.prevent="toTagDetail(tag.name)" class="tag">#{{tag.name}}#</span><span v-html="textToLink(item.feed.title)"></span></div>


            <div v-if="item.feed.img" class="container-images container-images-discover">
              <div v-for="img in item.feed.img" class="container-image"><img :src="img"></div>
            </div>
            <div v-if="item.feed.files" class="container-pdf-list">
              <div v-for="file in item.feed.files" class="pdf"><span class="text-line-2">{{file.name}}</span></div>
            </div>
            <div class="container-remarks"><span class="from"><i>来自圈子</i>{{ item.feed.group.name }}</span>{{ item.feed.comment_number }}评论<span class="line-wall"></span>{{ item.feed.support_number }}点赞</div>

          </div>

          <!-- 发布了链接分享 -->
          <div @tap.stop.prevent="toDetail(item)" class="container-feed-article-add" v-if="item.feed_type === 16">
            <div class="container-avatarAndTwoLineText">
              <div class="avatar" @tap.stop.prevent="toResume(item.user.uuid)">
                <div class="avatarInner"><img :src="item.user.avatar">
                  <svg class="icon" aria-hidden="true" v-show="item.user.is_expert">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </div>
              </div>
              <div class="mui-media-body">
                <div class="lineWrapper-1">{{ item.title }}
                  <div class="component-label component-label-top" v-show="item.top > 0">顶</div>
                </div>
                <div class="lineWrapper-2">{{ item.created_at }}
                  <svg class="icon addressIcon" aria-hidden="true" v-show="item.feed.current_address_name">
                    <use xlink:href="#icon-dingwei1"></use>
                  </svg><span class="address">{{ item.feed.current_address_name }}</span>
                </div>
              </div>
            </div>
            <!-- 新增链接样式 -->
            <div class="newLink">
              <div class="contentWrapper">{{item.feed.title}}</div>
              <div class="newLinkBox">
                <div class="container-image lazyImg" v-if="item.feed.img">
                  <img class="lazyImg" v-lazy="item.feed.img">
                </div>
                
                <div class="linkContent" v-if="item.feed.article_title">{{item.feed.article_title}}</div>
                <div class="link">{{item.feed.domain}} </div>
              </div>
            </div>
            <!-- <div class="contentWrapper text-line-3">{{ item.feed.article_title }}<span class="url">-{{ item.feed.domain }}</span></div> -->
            <!-- <div class="container-image" v-if="item.feed.img"><img :src="item.feed.img"></div> -->
            <div class="container-remarks"><span class="from"><i>来自圈子</i>{{ item.feed.group.name }}</span>{{ item.feed.comment_number }}评论<span class="line-wall"></span>{{ item.feed.support_number }}点赞</div>

          </div>

          <!-- 发布了原创文章，有title和描述 -->
          <div @tap.stop.prevent="toDetail(item)" class="container-feed-article-add" v-if="item.feed_type === 5">
            <div class="container-avatarAndTwoLineText">
              <div class="avatar" @tap.stop.prevent="toResume(item.user.uuid)">
                <div class="avatarInner"><img :src="item.user.avatar">
                  <svg class="icon" aria-hidden="true" v-show="item.user.is_expert">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </div>
              </div>
              <div class="mui-media-body">
                <div class="lineWrapper-1">{{ item.title }}
                  <div class="component-label component-label-top" v-show="item.top > 0">顶</div>
                </div>
                <div class="lineWrapper-2">{{ item.created_at }}
                  <svg class="icon addressIcon" aria-hidden="true" v-show="item.feed.current_address_name">
                    <use xlink:href="#icon-dingwei1"></use>
                  </svg><span class="address">{{ item.feed.current_address_name }}</span>
                </div>
              </div>
            </div>
            <div class="contentWrapper text-line-3">{{ item.feed.title }}</div>
            <div class="container-image" v-if="item.feed.img"><img :src="item.feed.img"></div>
            <div class="container-remarks"><span class="from"><i>来自圈子</i>{{ item.feed.group.name }}</span>{{ item.feed.comment_number }}评论<span class="line-wall"></span>{{ item.feed.support_number }}点赞</div>
          </div>

         <!-- 回答 -->
          <div @tap.stop.prevent="toDetail(item)" class="container-feed-question" v-if="item.feed_type <= 3 || item.feed_type === 6 || item.feed_type === 11 || item.feed_type === 12 || item.feed_type === 14">
            <div class="container-avatarAndTwoLineText">
              <div class="avatar" @tap.stop.prevent="toResume(item.user.uuid)">
                <div class="avatarInner"><img :src="item.user.avatar">
                  <svg class="icon" aria-hidden="true" v-show="item.user.is_expert">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </div>
              </div>
              <div class="mui-media-body">
                <div class="lineWrapper-1">{{ item.title }}
            <div class="component-label component-label-top" v-show="item.top > 0">顶</div>
                </div>
                <div class="lineWrapper-2">{{ item.created_at }}</div>
              </div>
            </div>
            <div class="contentWrapper"><span v-if="!item.feed.answer_id && item.feed.price > 0" class="component-label component-label-warn">{{ item.feed.status_description }}</span><span v-if="!item.feed.answer_id" v-for="tag in item.feed.tags" @tap.stop.prevent="toTagDetail(tag.name)" class="tag">#{{tag.name}}#</span>{{ item.feed.answer_id?item.feed.answer_content:item.feed.question_title }}</div>
            <div class="container-remarks">{{ item.feed.answer_id ? item.feed.comment_number+'评论' : item.feed.answer_number+'回答' }}<span class="line-wall"></span>{{ item.feed.answer_id ? item.feed.support_number+'点赞' : item.feed.follow_number+'关注' }}<span v-if="item.feed.average_rate" class="line-wall"></span>{{item.feed.average_rate?item.feed.average_rate+'好评':''}}</div>
            <div v-if="item.feed.answer_id" class="contentWrapper contentWrapper-question"><span v-if="item.feed.price > 0" class="component-label component-label-warn">{{ item.feed.status_description }}</span><span v-for="tag in item.feed.tags" @tap.stop.prevent="toTagDetail(tag.name)" class="tag">#{{tag.name}}#</span>{{ item.feed.question_title }}</div>
          </div>


          <div class="line-river-big"></div>
        </template>

      </RefreshList>

    </div>
  </div>
</template>
<script>
  import RefreshList from '../components/refresh/List.vue'
  import HomeSearch from '../components/search/Home'
  import userAbility from '../utils/userAbility'
  import { textToLinkHtml, secureHtml, transferTagToLink } from '../utils/dom'
  import { goThirdPartyArticle } from '../utils/webview'

  const Feed = {
    data: () => ({
      search_type: 2, // 1:关注,2:全部,3:问答,4:分享,5:他的动态,6:推荐,默认2
      emptyDescription: '暂无内容',
      unread_count: 0,
      contact_id: '',
      list: []
    }),
    created () {

    },
    updated () {
    },
    components: {
      RefreshList,
      HomeSearch
    },
    activated: function () {

    },
    mounted () {

    },
    computed: {
      prevOtherData () {
        return {search_type: this.search_type}
      },
      nextOtherData () {
        return {search_type: this.search_type}
      }
    },
    methods: {
      messagecountchange (obj) {
        if (obj.contact_id) {
          this.contact_id = obj.contact_id
          this.unread_count = obj.unread_count
        }
      },
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      switchSearchType (filter) {
        this.search_type = filter
      },
      textToLink (text) {
        return transferTagToLink(secureHtml(textToLinkHtml(text)))
      },
      toResume (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      goArticle: function (article) {
        goThirdPartyArticle(
          article.view_url,
          article.id,
          article.title,
          article.comment_url,
          article.img_url
        )
      },
      toDetail (item) {
        switch (item.feed_type) {
          case 1:
          case 2:
          case 3:
          case 5:
          case 6:
          case 11:
          case 12:
          case 14:
          case 15:
          case 16:
            this.$router.pushPlus(item.url, 'list-detail-page')
            break
          case -1:
            // 已废弃
            var linkArticle = {
              view_url: item.url,
              id: item.feed.submission_id,
              title: item.feed.title,
              comment_url: item.feed.comment_url,
              img_url: item.feed.img
            }
            this.goArticle(linkArticle)
            break
          default:
            this.$router.pushPlus(item.url, 'list-detail-page')
            break
        }
      }
    }
  }
  export default Feed
</script>

<style lang="less" scoped>
  .mui-content{
    background: #fff;
  }
  .listWrapper {
    top: 1.04rem;
    bottom: 50px; /* px不转换 */
  }
  .newLink {
    margin-top: 0.24rem;
    // padding: 0 0.426rem;
    .newLinkBox {
      margin-top: 0.266rem;
      padding: 0.4rem 0.4rem 0.293rem;
      background: #F7F8FA;
      border-radius: 0.106rem;
      .container-image {
        margin-top: 0;
        margin-bottom: 0.213rem;
      }
      img {
        // width: 8.373rem;
        // height: 2.986rem;
        border-radius: 0.106rem;
      }
      .linkContent {
        font-size: 0.373rem;
        color: #808080;
        // line-height: 0.533rem;
      }
      .link {
        font-size: 0.32rem;
        color: #B4B4B6;
      }
    }
  }
</style>
