<template>
  <div>
    <div class="comment text-line-5" v-for="(child, index) in children" @tap.stop.prevent="comment(child.id, child.owner.name, children)" :key="child.id">

      <DiscussReplaySimple
        v-if="child.children.length"
        :children="child.children"
        :parentOwnerName="child.owner.name"
        :isShow="isShow"
        @comment="comment"
      ></DiscussReplaySimple>

        <span class="from">{{ child.owner.name }}</span> <div class="triangle-right triangle-right-6"></div> <span class="to">{{ parentOwnerName }}</span> {{child.content}}
    </div>
  </div>
</template>

<script>
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
      comment (parentId, commentTargetUsername, list) {
        this.$emit('comment', parentId, commentTargetUsername, list)
      }
    }
  }
  export default Discuss
</script>

