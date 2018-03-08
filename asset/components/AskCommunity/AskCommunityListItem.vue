<template>
  <div>
    <div>
        <ul>
          <li v-for="(item, index) in list" @tap.stop.prevent="toDetail(item.id,item.question_type)">
            <div class="ask-tags">
              <p v-for="(tag, index) in item.tags" @tap.stop.prevent="toTagDetail(tag.name)"> {{tag.name}}</p>
            </div>
            <div class="ask-container" >
              <p :class="item.question_type === 1 ? 'text-line-5' : 'text-line-3'" v-if="searchText" v-html="getHighlight(item.description)"></p>
              <p :class="item.question_type === 1 ? 'text-line-5' : 'text-line-3'" v-else>{{item.description}}</p>
            </div>
            <div class="tag-detail">
              <div class="ask-comment" v-if="item.question_type === 1"><a></a>1元看答案/评论</div>
              <p v-if="item.question_type === 1">{{item.comment_number}}评论<i></i></p>

              <p v-if="item.question_type === 1">{{item.support_number}}赞<i></i></p>

              <p v-if="item.question_type === 1">回答好评率{{item.average_rate}}</p>

              <p v-if="item.question_type === 2">{{item.answer_number}}人回答<i></i></p>

              <p v-if="item.question_type === 2">{{item.follow_number}}关注</p>
            </div>
          </li>
        </ul>
    </div>
  </div>

</template>

<script>
  import userAbility from '../../utils/userAbility'

  const MajorList = {
    data: () => ({
      tags: []
    }),
    computed: {
    },
    components: {
    },
    props: {
      list: {
        type: Array,
        default: []
      },
      searchText: {
        type: String,
        searchText: ''
      }
    },
    methods: {
      // 文字高亮
      getHighlight (content) {
        var reg = new RegExp('(' + this.searchText + ')', 'gi')  // 正则验证匹配
        var newstr = content.replace(reg, '<span style="color: #03aef9">$1</span>')  // 动态添加颜色
        return newstr
      },
      // 标签
      toTagDetail (name) {
        userAbility.jumpToTagDetail(name)
      },
      toDetail (id, type) {
        if (type === 1) {
          this.$router.pushPlus('/askCommunity/major/' + id, 'list-detail-page', true, 'pop-in', 'hide', true)
        } else {
          this.$router.pushPlus('/askCommunity/interaction/answers/' + id, 'list-detail-page', true, 'pop-in', 'hide', true)
        }
      },
      selectType (typeText) {
        this.$router.push('/ask/type?type=majorlist')
      }
    },
    mounted () {
    }
  }
  export default MajorList
</script>

<style lang="less" scoped>
  /*清掉自带样式*/

  div,
  p,
  span,
  i,
  img,
  ul,
  li,
  a {
    margin: 0;
    padding: 0;
    list-style: none;
    font-style: normal;
  }

  .bot {
    position: absolute;
    right: 4%;
    bottom: 0;
    left: 4%;
    height: 0.026rem;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: rgb(220, 220, 220);
  }


  /*滚动区域*/
    ul{
      width:100%;
      height: 100%;
      background: #f3f4f6;
      li{
        width:100%;
        overflow: hidden;
        background: #ffffff;
        margin-bottom: 0.266rem;
        padding: 0.426rem 4% 0.346rem 4%;
        .ask-tags{
          width:100%;
          overflow: hidden;
          p{
            float: left;
            font-size:0.32rem;
            background: #ececee;
            color: #9e9e9e;
            margin-right: 0.213rem;
            border-radius:1.333rem;
            padding: 0rem 0.213rem;
            margin-bottom: 0.16rem;
          }
        }
        .ask-container{
          word-break: break-all;
          font-size: 0.426rem;
          color: #444444;
          line-height: 0.586rem;
        }
        .tag-detail{
          .ask-comment{
            width:2.746rem;
            height:0.506rem;
            border-radius:0.106rem;
            background: #a8dff7;
            font-size:0.32rem;
            color: #235280;
            float: left;
            text-align: center;
            line-height:0.506rem;
            margin-top: 0.053rem;
            margin-right: 0.266rem;
            position: relative;
            a{
              position: absolute;
              display: block;
              width:0.106rem;
              height:0.106rem;
              background: #ffffff;
              border-radius: 50%;
              top: 0.213rem;
              left: 0.08rem;
            }
          }
          width:100%;
          height:0.533rem;
          margin-top: 0.133rem;
          p{
            float: left;
            font-size: 0.32rem;
            color: #808080;
            margin-right: 0.24rem;
            i{
              display: block;
              float: right;
              width:0.026rem;
              height:0.266rem;
              background: #dbdbdb;
              margin: 0.186rem 0rem 0 0.24rem;
            }
          }

        }
      }
    }



</style>

