<template>
  <div>
    <header class="mui-bar mui-bar-nav">
      <Back></Back>
      <h1 class="mui-title" v-text="title"></h1>
    </header>

    <div class="mui-content" v-if="!loading">
      <vue-pull-refresh :on-refresh="refreshPageData">
        <div>
          <div class="topImg container-image" v-if="detail.type === 'article' && detail.data.img">
            <img v-lazy="detail.data.img" class="lazyImg">
          </div>
        </div>

        <div class="mui-table-view detail-discover">
          <UserInfo
            :uuid="detail.owner.uuid"
            :avatar="detail.owner.avatar"
            :realname="detail.owner.name"
            :isFollow="isFollow"
            :isFollowed="detail.is_followed_author?true:false"
            :isShowPositionAndCompany="false"
            :isExpert="detail.owner.is_expert?1:0"
            :time="detail.created_at"
            @setFollowStatus="setFollowStatus"
          ></UserInfo>

          <div class="detailTitle" v-if="detail.type === 'article' && detail.title">{{detail.title}}</div>

          <div class="line-river lineMargin"></div>

          <div class="discoverContentWrapper">
            <div class="contentWrapper quillDetailWrapper container-editor container-editor-app" id="contentWrapper">
              <span v-if="detail.type !== 'article'" v-html="textToLink(detail.title)"></span>

              <div class="richText container-editor container-editor-app" v-show="detail.type === 'article'">
                <div class="quill-editor">
                  <div class="ql-container ql-snow">
                    <div class="ql-editor discoverContent">
                    </div>
                  </div>
                </div>
              </div>

              <quill-editor
                class="hiddenWrapper"
                ref="myTextEditorRead"
                :options="editorOptionRead"
                @ready="onEditorReadyRead($event)"
                @change="change"
              >
              </quill-editor>
            </div>

            <div class="linkWrapper Column" v-if="detail.type === 'text' && detail.data.img && detail.data.img.length">
              <template v-for="(image, index) in detail.data.img">
                <img class="discover_img lazyImg" :id="'image_' + index" v-lazy="image" :data-preview-src="image"
                     :data-preview-group="1"/>
              </template>
            </div>
          </div>
          <!-- 新增链接样式 -->
          <div class="link" v-if="detail.type === 'link' && detail.data.url">
            <div class="linkBox" @tap.stop.prevent="goArticle(detail)">
                <span class="linkIimg" v-if="!detail.data.img">
                  <svg class="icon" aria-hidden="true" >
                    <use xlink:href="#icon-biaozhunlogoshangxiayise"></use>
                  </svg>
                </span>
              <img class="lazyImg" v-lazy="detail.data.img" v-else>
              <div class="linkContent">
                <div v-if="detail.data.title" class="text-line-2">{{detail.data.title}}</div>
                <span v-else class="seat"></span>
                <div class="text-line-1">{{detail.data.domain}}</div>
              </div>
            </div>
          </div>

          <div class="timeContainer">
            <div class="makingCopy">著作权归作者所有</div>
          </div>
        </div>

      </vue-pull-refresh>
    </div>

  </div>
</template>
<script>
  import { getCommentDetail } from '../../../utils/dianping.js'
  import VuePullRefresh from 'vue-awesome-pull-refresh'

  export default {
    data () {
      return {
        id: '',
        title: '点评',
        detail: [],
        loading: 1
      }
    },
    components: {
      'vue-pull-refresh': VuePullRefresh
    },
    methods: {
      getDetail () {
        this.id = this.$route.params.id
        getCommentDetail(this, this.id, (detail) => {
          this.detail = detail
        })
      },
      refreshPageData () {
        this.getDetail()
      }
    },
    mounted () {},
    created () {
      this.getDetail()
    },
    watch: {
      '$route': 'refreshPageData'
    }
  }
</script>
<style>

</style>
