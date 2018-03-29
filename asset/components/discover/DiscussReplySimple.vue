<template>
  <div>
    <div class="comment text-line-5" v-for="(child, index) in children" @tap.stop.prevent="comment(child.id, child.owner.name, children)" :key="child.id">

      <span class="from">{{ child.owner.name }}</span> <div class="triangle-right triangle-right-6"></div> <span class="to">{{ parentOwnerName }}</span> <span class="textToLink" v-html="textToLink(child.content)"></span>

      <DiscussReplaySimple
        v-if="child.children.length"
        :children="child.children"
        :parentOwnerName="child.owner.name"
        :isShow="isShow"
        @comment="comment"
      ></DiscussReplaySimple>
    </div>
  </div>
</template>

<script>
  import { textToLinkHtml } from '../../utils/dom'

  const Discuss = {
    name: 'DiscussReplaySimple',
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
        return textToLinkHtml(' ' + text)
      },
      comment (parentId, commentTargetUsername, list) {
        this.$emit('comment', parentId, commentTargetUsername, list)
      }
    }
  }
  export default Discuss
</script>

