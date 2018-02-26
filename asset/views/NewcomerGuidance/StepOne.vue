<template>
  <div>
    <div style="background: #f3f4f6"></div>
    <div class="mui-content">
      <div class="invitation-title">
        <svg class="icon" aria-hidden="true" @tap.stop.prevent="close()">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
        <div class="next-step" @tap.stop.prevent="submit()">下一步</div>
        <div class="invitation-text">
          <p>关注您感兴趣的标签</p>
          <p>我们会推荐您相关的内容</p>
        </div>
      </div>

      <div class="tag-title">热门标签</div>
      <ul>
        <li v-for="(item,index) in list" @click="changeClass(item)"  :class="item.checked ? 'bg-blue' : '' ">{{item.text}}</li>
      </ul>
    </div>

    <div id="statusBarStyle" mode="dark"></div>
  </div>
</template>
<script>
  import RefreshList from '../../components/refresh/List.vue'
  import { postRequest } from '../../utils/request'
  import Vue from 'vue'

  export default {
    data: () => ({
      list: [],
      page: 1,
      loading: 1
    }),
    created () {
    },
    computed: {
      selectTags () {
        var tags = []
        window.mui.each(this.list, function (index, item) {
          if (item.checked) {
            tags.push(item.value)
          }
        })
        return tags
      }
    },
    components: {
      RefreshList
    },
    methods: {
      close () {
        if (this.$route.query.from === 'feed') {
          window.mui.back()
        } else {
          this.$router.pushPlus('/my')
        }
      },
      changeClass (item) {
        Vue.set(item, 'checked', !item.checked)
      },
      submit () {
        if (this.selectTags.length === 0) {
          this.$router.replace('/userGuide/steptwo?from=' + this.$route.query.from)
          return
        }

        postRequest('follow/batchTags', {
          ids: this.selectTags
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.$router.replace('/userGuide/steptwo?from=' + this.$route.query.from)
        })
      },
      getData () {
        postRequest('tags/load', {
          tag_type: 5,
          sort: 1,
          limit: 20
        }).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.toast(response.data.message)
            return
          }
          this.list = response.data.data.tags
          this.loading = 0
        })
      }
    },
    mounted () {
      this.getData()
    }
  }

</script>
<style scoped>
  ul,
  li,
  p,
  span,
  a,
  i {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0rem;
    height: 0.1rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }
  .mui-content{
    background: #FFFFFF;
  }
  /*邀请的头部*/
  .invitation-title{
    width:100%;
    height:13.2rem;
    background: #f3f4f6;
    padding: 0 1.7rem;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .invitation-title svg{
    color: #b4b4b6;
    font-size: 2.5rem;
    position: absolute;
    left:1.7rem;
    top:2rem;
  }
  .invitation-title .next-step{
    width:7.5rem;
    height:3.4rem;
    line-height: 3.2rem;
    border: 0.1rem solid #03aef9;
    border-radius: 5rem;
    font-size:1.4rem;
    color:#03aef9;
    position: absolute;
    right:1.7rem;
    top:1.6rem;
  }
  .invitation-title .invitation-text{
    position: absolute;
    top:5.9rem;
    text-align: left;
    display: flex;
    flex-direction: column;
  }
  .invitation-text p:nth-of-type(1){
    font-size:1.4rem;
    color: #808080;
  }
  .invitation-text p:nth-of-type(2){
    font-size:2rem;
    color: #323232;
  }
  /*tag*/
.tag-title{
  font-size:1.3rem;
  color: #808080;
  margin:2rem 0 0 4%;

}
  ul{
    width:92%;
    margin-left: 1.5%;
  }
  ul li{
    float: left;
    border:0.1rem solid #dcdcdc;
    font-size: 1.4rem;
    color: #444444;
    border-radius: 0.4rem;
    padding: 0.5rem 1rem;
    margin: 0.9rem 0 0 1rem;
  }
  ul li.bg-blue{
    background: #03aef9;
    border:0.1rem solid #03aef9;
    color: #FFFFFF;
  }

</style>
