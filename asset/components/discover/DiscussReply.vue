<template>
  <div>
  <template v-for="(child, childIndex) in children">
    <div class="list-item-discuss list-item-discuss-children" v-show="childIndex < 2 || isShow" :key="child.id" @tap.stop.prevent="clickComment(child, children)">
      <div class="lidL">
        <img :src="child.owner.avatar"/>
      </div>
      <div class="lidR">
        <div class="lidR1">{{ child.owner.name }}<span>回复</span>{{ parentOwnerName }}</div>
        <div class="lidR2 textToLink" v-html="textToLink(child.content)"></div>
        <div class="lidR3">
          <div class="lidRtime"><timeago :since="timeago(child.created_at)" :auto-update="0">
          </timeago></div>
          <div class="lidROption" @tap.stop.prevent="vote(child)" :class="{active:child.is_supported}">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zan"></use>
            </svg><span v-if="child.supports">{{ child.supports }}</span>
          </div>
        </div>
      </div>
     </div>

    <DiscussReplay
        v-if="child.children.length"
        :children="child.children"
        :parentOwnerName="child.owner.name"
        :isShow="isShow"
        @comment="clickComment"
        @vote="vote"
      ></DiscussReplay>

  </template>
  </div>
</template>

<script>
  import { textToLinkHtml } from '../../utils/dom'

  const Discuss = {
    name: 'DiscussReplay',
    data: () => ({
      loading: true,
      busy: false,
      showList: true,
      commentTarget: null,
      page: 1,
      list: []
    }),
    props: {
      children: {
        type: Array,
        default: () => {
          return []
        }
      },
      parentOwnerName: {
        type: String,
        default: ''
      },
      isShow: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
    },
    components: {

    },
    methods: {
      timeago (time) {
        let newDate = new Date()
        newDate.setTime(Date.parse(time.replace(/-/g, '/')))
        return newDate
      },
      textToLink (text) {
        return textToLinkHtml(text)
      },
      vote (item) {
        this.$emit('vote', item)
      },
      clickComment (comment, children) {
        this.$emit('comment', comment, children)
      } // ,
//      comment (parentId, commentTargetUsername, list) {
//        this.$emit('comment', parentId, commentTargetUsername, list)
//      }
    }
  }
  export default Discuss
</script>

