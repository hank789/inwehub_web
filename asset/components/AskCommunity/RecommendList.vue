<template>
  <div class="recommentListWrapper">
    <div class="component-title-home"><div class="left">相关问答</div></div>
    <div class="line-river"></div>
    <AskCommunityListItem :list="list"></AskCommunityListItem>
  </div>
</template>

<script>
  import { postRequest } from '../../utils/request'
  import AskCommunityListItem from './AskCommunityListItem.vue'

  const RecommentsList = {
    name: 'RecommentsList',
    data: () => ({
      list: []
    }),
    computed: {
    },
    components: {
      AskCommunityListItem
    },
    props: {
      did: {
        type: Number
      }
    },
    methods: {},
    mounted () {
      postRequest(`question/relatedQuestion`, {id: this.did, limit: 2}).then(response => {
        var code = response.data.code
        if (code !== 1000) {
          window.mui.toast(response.data.message)
          return
        }

        this.list = response.data.data
      })
    }
  }
  export default RecommentsList
</script>
<style scoped="scoped">
.recommentListWrapper{
  background:#fff;
  margin-bottom:0.266rem;
}
</style>
<style>
  .recommentListWrapper ul li{
    position: relative;
    margin-bottom:0;
  }
  .recommentListWrapper ul li:after{
    content: '';
    position: absolute;
    top: 0;
    left: .4rem;
    right: .4rem;
    height: .02667rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #dcdcdc;
  }
</style>
