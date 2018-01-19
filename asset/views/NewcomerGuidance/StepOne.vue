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
        <!--<li class="bg-blue">企业IT战略规划与ITSP</li>-->
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
    left: 0px;
    height: 1px;
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
    height:132px;
    background: #f3f4f6;
    padding: 0 17px;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .invitation-title svg{
    color: #b4b4b6;
    font-size: 25px;
    position: absolute;
    left:17px;
    top:20px;
  }
  .invitation-title .next-step{
    width:75px;
    height:34px;
    line-height: 32px;
    border: 1px solid #03aef9;
    border-radius: 50px;
    font-size:14px;
    color:#03aef9;
    position: absolute;
    right:17px;
    top:16px;
  }
  .invitation-title .invitation-text{
    position: absolute;
    top:59px;
    text-align: left;
    display: flex;
    flex-direction: column;
  }
  .invitation-text p:nth-of-type(1){
    font-size:14px;
    color: #808080;
  }
  .invitation-text p:nth-of-type(2){
    font-size:20px;
    color: #323232;
  }
  /*tag*/
.tag-title{
  font-size:13px;
  color: #808080;
  margin:20px 0 0 4%;

}
  ul{
    width:92%;
    margin-left: 1.5%;
  }
  ul li{
    float: left;
    border:1px solid #dcdcdc;
    font-size: 14px;
    color: #444444;
    border-radius: 4px;
    padding: 5px 10px;
    margin: 9px 0 0 10px;
  }
  ul li.bg-blue{
    background: #03aef9;
    border:1px solid #03aef9;
    color: #FFFFFF;
  }

</style>
