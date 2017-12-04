<template>
  <div>
    <div class="component-comment-reply" v-for="(child, childIndex) in children" v-show="childIndex < 2 || isShow" :key="child.id" @tap.stop.prevent="comment(child.id, child.owner.name, children)">
      <DiscussReplay
        v-if="child.children.length"
        :children="child.children"
        :parentOwnerName="child.owner.name"
        :isShow="isShow"
        @comment="comment"
      ></DiscussReplay>

      <div class="who"><span class="from">{{ child.owner.name }}</span>
        <div class="triangle-right triangle-right-6"></div><span class="to">{{ parentOwnerName }}</span>
        <div class="time">{{ child.created_at }}</div>
      </div>
      <div class="text textToLink" v-html="textToLink(child.content)"></div>
    </div>
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
      textToLink (text) {
        return textToLinkHtml(text)
      },
      comment (parentId, commentTargetUsername, list) {
        this.$emit('comment', parentId, commentTargetUsername, list)
      }
    }
  }
  export default Discuss
</script>

