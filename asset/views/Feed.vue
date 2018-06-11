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

          <!-- 发布了文章 -->
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
            <div class="contentWrapper text-line-3">{{ item.feed.title }}<span class="url">-{{ item.feed.domain }}</span></div>
            <div class="container-image"><img :src="item.feed.img"></div>
            <div class="container-remarks"><span class="from"><i>来自圈子</i>{{ item.feed.group.name }}</span>{{ item.feed.comment_number }}评论<span class="line-wall"></span>{{ item.feed.support_number }}点赞</div>
          </div>

         <!-- 回答 -->
          <div @tap.stop.prevent="toDetail(item)" class="container-feed-question" v-if="item.feed_type <= 3 || item.feed_type === 6 || item.feed_type === 11 || item.feed_type === 12">
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
            <div class="contentWrapper"><span v-if="!item.feed.answer_id" class="component-label component-label-warn">{{ item.feed.status_description }}</span><span v-if="!item.feed.answer_id" v-for="tag in item.feed.tags" @tap.stop.prevent="toTagDetail(tag.name)" class="tag">#{{tag.name}}#</span>{{ item.feed.answer_id?item.feed.answer_content:item.feed.question_title }}</div>
            <div class="container-remarks">{{ item.feed.answer_id ? item.feed.comment_number+'评论' : item.feed.answer_number+'回答' }}<span class="line-wall"></span>{{ item.feed.answer_id ? item.feed.support_number+'点赞' : item.feed.follow_number+'关注' }}</div>
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
      toDetail (item) {
        switch (item.feed_type) {
          case 1:
          case 2:
          case 3:
          case 6:
          case 11:
          case 12:
          case 15:
            this.$router.pushPlus(item.url, 'list-detail-page')
            break
          case 5:
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
    top: 1.2rem;
    bottom: 1.333rem;
  }
</style>
