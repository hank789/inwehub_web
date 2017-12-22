<template>
  <div>
    <div class="message">
      <div class="message_title">
        <p>留言</p>
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="comment(0, '', list)">
          <use xlink:href="#icon-xiugai"></use>
        </svg>
        <i class="bot"></i>
      </div>

      <div class="listWrapper empty" v-show="list.length === 0">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-zanwushuju"></use>
        </svg>
        <p>暂无留言</p>
      </div>

      <div class="listWrapper" v-show="list.length !== 0 && showList">
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
          <ul class="message_detail">
            <li v-for="(item, index) in list" @tap.stop.prevent="comment(item.id, item.owner.name, list)" :key="index">
              <div class="message_t">
                <p @tap.stop.prevent="toResume(item.owner.uuid)">
                  <img :src="item.owner.avatar"/>
                  <svg class="icon" aria-hidden="true" v-show="item.owner.is_expert">
                    <use xlink:href="#icon-zhuanjiabiaojishixin"></use>
                  </svg>
                </p>
                <p class="mui-ellipsis">{{ item.owner.name }}</p>
                <p>{{ item.created_at.replace(/-/g, '/') }}</p>
              </div>
              <div class="message_b textToLink" v-html="textToLink(item.content)"></div>

              <DiscussReplay
                v-if="item.children.length"
                :children="item.children"
                :parentOwnerName="item.owner.name"
                :isShow="!!item.moreReply"
                @comment="comment"
              ></DiscussReplay>

              <div class="text-13-03aef9 moreReply" @tap.stop.prevent="moreReply(item)" v-if="item.children.length>2 && !item.moreReply">查看全部{{item.children.length}}条回复</div>

              <i class="bot" v-show="list.length-1 !== index"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import { getLocalUserInfo } from '../../utils/user'
  import { getIndexByIdArray } from '../../utils/array'
  import Vue from 'vue'
  import DiscussReplay from '../../components/discover/DiscussReply.vue'
  import { textToLinkHtml } from '../../utils/dom'
  import { openVendorUrl } from '../../utils/plus'

  const Discuss = {
    data: () => ({
      loading: true,
      busy: false,
      showList: true,
      commentTarget: null,
      page: 1,
      list: []
    }),
    props: {
      listApi: {
        type: String,
        default: ''
      },
      listParams: {
        type: Object,
        default: () => {
          return null
        }
      },
      storeApi: {
        type: String,
        default: ''
      },
      storeParams: {
        type: Object,
        default: () => {
          return null
        }
      }
    },
    mounted () {
    },
    components: {
      DiscussReplay
    },
    computed: {},
    methods: {
      textToLink (text) {
        return textToLinkHtml(text)
      },
      moreReply (item) {
        item.moreReply = 1
        var indexOfItem = getIndexByIdArray(this.list, item.id)
        Vue.set(this.list, indexOfItem, item)
      },
      toResume (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      resetList () {
        this.page = 1
        this.list = []
        this.getList()
      },
      comment (parentId, commentTargetUsername, list) {
        this.commentTarget = {
          parentId: parentId || 0,
          commentTargetUsername: commentTargetUsername || '',
          list: list
        }
        var commentTargetName = commentTargetUsername || ''

        console.log('回复 parentId:' + parentId + ', commentTargetUsername' + commentTargetUsername)
        this.$emit('comment', commentTargetName)
      },
      sendMessage (message) {
        var parentId = this.commentTarget.parentId
        var params = Object.assign({
          body: message.content,
          content: message.content,
          parent_id: parentId,
          mentions: message.noticeUsers
        }, this.storeParams)

        postRequest(this.storeApi, params).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          var data = response.data.data

          window.mui.toast(response.data.message)

          this.prependItem(
            data.id,
            message.content,
            data.created_at,
            parentId
          )

          this.$emit('commentFinish')
        })
      },
      prependItem (id, msg, createdAt, parentId) {
        var userInfo = getLocalUserInfo()
        var item = {
          id,
          children: [],
          content: msg,
          owner: {
            is_expert: userInfo.is_expert,
            avatar: userInfo.avatar_url,
            user_id: userInfo.user_id,
            uuid: userInfo.uuid,
            name: userInfo.name
          },
          created_at: createdAt
        }

        if (parentId) {
          var parentIndex = getIndexByIdArray(this.commentTarget.list, parentId)
          if (parentIndex) {
            if (this.commentTarget.list[parentIndex].children) {
              this.commentTarget.list[parentIndex].children.unshift(item)
            } else {
              this.commentTarget.list[parentIndex].children = [item]
            }
          }
        } else {
          this.commentTarget.list.unshift(item)
        }
      },
      loadMore () {
        this.busy = true
        console.log('loadMore')
        this.getList()
      },
      getList () {
        if (!this.listParams) {
          return false
        }
        var params = Object.assign({page: this.page}, this.listParams)
        postRequest(this.listApi, params).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          if (response.data.data.data.length > 0) {
            this.list = this.list.concat(response.data.data.data)
          }

          if (response.data.data.data.length < 10) {
            this.busy = true
          } else {
            this.busy = false
          }

          this.page++

          this.loading = 0
        })
      }
    },
    watch: {
      'listParams' (newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.resetList()
        }
      }
    },
    created () {

    },
    updated () {
      this.$nextTick(() => {
        var eles = this.$el.querySelectorAll('.textToLink')
        for (var i in eles) {
          openVendorUrl(eles[i])
        }
      })
    }
  }
  export default Discuss
</script>

<style scoped="scoped">
  div,
  span,
  p,
  ul,
  li,
  i,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0px;
    height: 1px;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }

  .message {
    width: 100%;
    background: #FFFFFF;
    overflow: hidden;
    padding: 0 15px 15px 15px;
  }

  .message_title {
    width: 100%;
    height: 44px;
    position: relative;
    line-height: 44px;

  }

  .message_title p {
    float: left;
    font-size: 16px;
    color: #444444;

  }

  .message_title svg {
    float: right;
    font-size: 19px;
    color: #03aef9;
    margin-top: 12px;
  }

  .message_detail {
    width: 100%;
    overflow: hidden;
  }

  .message_detail li {
    width: 100%;
    overflow: hidden;
    position: relative;
    padding: 12px 0 10px 0;
  }

  .message_b {
    font-size: 14px;
    color: #444444;
    margin-top: 7px;
  }

  .message_t {
    width: 100%;
    height: 32px;
  }

  .message_t p:nth-child(1) {
    width: 32px;
    height: 32px;
    float: left;
    position: relative;
  }

  .message_t p:nth-child(1) img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .message_t p:nth-child(1) svg {
    font-size: 16px;
    color: #03aef9;
    position: absolute;
    bottom: 0;
    right: -5px;
  }

  .message_t p:nth-child(2) {
    float: left;
    margin-left: 10px;
    height: 32px;
    line-height: 32px;
  }

  .message_t p:nth-child(3) {
    float: right;
    height:100%;
    line-height: 32px;
    font-size: 13px;
    color: #c8c8c8;
  }

  .message_t p:nth-child(2) span:nth-child(2) {
    color: #c8c8c8;
  }

  .listWrapper {
  }

  .commentWrapper {
    background: #ececee;
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    min-height: 45px;
    overflow: hidden;
    padding: 5px 15px;
    z-index: 77;
  }

  .commentWrapper .textareaWrapper {
    position: relative;
    background: #fff;
    border-radius: 5px;
    min-height: 35px;
  }

  .commentWrapper textarea {
    border: none;
    display: inline-block;
    width: 100%;
    height: 20px;
    margin: 6px 0 0;
    padding: 0 31px 0 5px;
    font-size: 14px;

  }

  .commentWrapper textarea::placeholder {
    color: #c8c8c8;
  }

  .commentWrapper .icon {
    position: absolute;
    right: 5px;
    color: #03aef9;
    font-size: 26px;
    bottom: 5px;
  }

  .empty {

  }

  .empty {
    width: 100%;
    background: #FFFFFF;
    margin-bottom: 10px;
    text-align: center;
    padding: 20px 0;
  }

  .empty .icon {
    font-size: 50px;
  }

  .empty p {
    width: 100%;
    font-size: 12px;
    color: #c8c8c8;
    text-align: center;
  }

  .component-comment-reply{
    margin-top:5px;
  }

  .moreReply{
    margin-top:5px;
  }
</style>
