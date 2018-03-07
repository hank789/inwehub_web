<template>
  <div>
    <div>
        <ul>
          <li v-for="(item, index) in list" @tap.stop.prevent="toDetail(item.id,item.question_type)">
            <div class="ask-tags">
              <p v-for="(tag, index) in item.tags" @tap.stop.prevent="toTagDetail(tag.name)"> {{tag.name}}</p>
            </div>
            <div class="ask-container">
              {{item.description}}
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
      list: [],
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
      }
    },
    methods: {
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
      overflow: hidden;
      background: #f3f4f6;
      li{
        width:100%;
        overflow: hidden;
        background: #ffffff;
        margin-bottom: 10px;
        padding: 16px 4% 13px 4%;
        .ask-tags{
          width:100%;
          overflow: hidden;
          p{
            float: left;
            font-size:12px;
            background: #ececee;
            color: #9e9e9e;
            margin-right: 8px;
            border-radius:50px;
            padding: 0rem 0.213rem;
            margin-bottom: 6px;
          }
        }
        .ask-container{
          word-break: break-all;
          font-size: 16px;
          color: #444444;
          line-height: 22px;
        }
        .tag-detail{
          .ask-comment{
            width:103px;
            height:19px;
            border-radius:4px;
            background: #a8dff7;
            font-size:12px;
            color: #235280;
            float: left;
            text-align: center;
            line-height:19px;
            margin-top: 2px;
            margin-right: 10px;
            position: relative;
            a{
              position: absolute;
              display: block;
              width:4px;
              height:4px;
              background: #ffffff;
              border-radius: 50%;
              top: 8px;
              left: 3px;
            }
          }
          width:100%;
          height:20px;
          margin-top: 5px;
          p{
            float: left;
            font-size: 12px;
            color: #808080;
            margin-right: 9px;
            i{
              display: block;
              float: right;
              width:1px;
              height:10px;
              background: #dbdbdb;
              margin: 7px 0px 0 9px;
            }
          }

        }
      }
    }



</style>

