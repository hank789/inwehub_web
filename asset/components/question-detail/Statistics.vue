<template>
  <div>
  <div class="statistics">
    <div class="item">
      <div class="iconWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-pinglun1"></use>
        </svg>
      </div>

      <span>{{ commentNum }}</span>
    </div>


    <div class="item active" v-if="showModifyBtn" @tap.stop.prevent="modify()">
      <div class="iconWrapper modifyWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xiugai"></use>
        </svg>
      </div>
      <span>修改</span>
    </div>


    <div class="item" :class="{active:isCollected}" @tap.stop.prevent="collect()" v-else-if="showShoucang">
      <div class="iconWrapper showcangWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-shoucangxingxing"></use>
        </svg>
      </div>
      <span>{{ collectNum }}</span>
    </div>

    <div class="item" v-else>
      <div class="iconWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gongkai"></use>
        </svg>
      </div>
      <span>{{ seeNum }}</span>
    </div>


    <div class="item" :class="{active:isSupported}" @tap.stop.prevent="support()">
      <div class="iconWrapper dianzanWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dianzan1"></use>
        </svg>
      </div>
      <span>{{ supportNum }}</span>
    </div>
  </div>
    <!--&lt;!&ndash;点赞 supporter_list  v-if="detail.supporter_list ? detail.supporter_list.length:0"&ndash;&gt;-->
    <div class="component-dianzanList" v-if="supportNum">
      <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-dianzan1"></use>
      </svg>
      <span v-for="(item, index) in answerList.supporter_list" @tap.stop.prevent="toAvatar(item.uuid)">{{item.name}}</span><span v-if="supportNum > answerList.supporter_list.length">等{{supportNum}}人</span>

    </div>

  </div>
</template>

<script type="text/javascript">

  import { postRequest } from '../../utils/request'

  export default {
    data () {
      return {
      }
    },
    components: {},
    props: {
      answerList: {
        type: Object,
        default: {}
      },
      commentNum: {
        type: Number,
        default: 0
      },
      questionId: {
        type: Number,
        default: 0
      },
      seeNum: {
        type: Number,
        default: 0
      },
      supportNum: {
        type: Number,
        default: 0
      },
      answerId: {
        type: Number,
        default: 0
      },
      isSupported: {
        type: Boolean,
        default: true
      },
      isCollected: {
        type: Boolean,
        default: true
      },
      collectNum: {
        type: Number,
        default: 0
      },
      showShoucang: {
        type: Boolean,
        default: false
      },
      showModifyBtn: {
        type: Boolean,
        default: false
      }
    },
    created () {
    },
    methods: {
      toAvatar (uuid) {
        if (!uuid) {
          return false
        }
        this.$router.pushPlus('/share/resume?id=' + uuid + '&goback=1' + '&time=' + (new Date().getTime()))
      },
      modify () {
        this.$router.pushPlus('/realAnswer/' + this.questionId + '/' + this.answerId, 'backAndClose')
      },
      collect () {
        var data = {
          id: this.answerId
        }

        postRequest(`collect/answer`, data).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          if (this.isCollected) {
            this.$emit('collectNumDesc')
          } else {
            this.$emit('collectNumAdd')
          }

          this.$emit('setCollectStatus', response.data.data.type)

          window.mui.toast(response.data.data.tip)
        })
      },
      support () {
        var data = {
          id: this.answerId
        }

        postRequest(`support/answer`, data).then(response => {
          var code = response.data.code
          if (code !== 1000) {
            window.mui.alert(response.data.message)
            return
          }

          if (this.isSupported) {
            this.$emit('supportNumDesc')
          } else {
            this.$emit('supportNumAdd')
          }

          this.$emit('setSupportStatus', response.data.data.type)

          window.mui.toast(response.data.data.tip)
        })
      }
    },
    mounted () {
//      console.error(this.answerList)
    }
  }
</script>

<style scoped="scoped">
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


  .item {
    line-height: 0.533rem;
    color: #b4b4b6;
  }

  .item span {
    font-size: 0.373rem;
    position: relative;
    top: -0.08rem;
  }

  .item .iconWrapper {
    display: inline-block;
    border: 0.026rem solid #dcdcdc;
    width: 1.12rem;
    height: 1.12rem;
    border-radius: 50%;
    text-align: center;
    line-height: 1.12rem;
    font-size: 0.64rem;

  }

  .item.active .iconWrapper {
    border: 0.026rem solid #03aef9;
  }

  .item:nth-child(1) .iconWrapper {
    font-size: 0.533rem;
  }

  .item:nth-child(2) .iconWrapper {
    font-size: 0.64rem;
  }

  .item:nth-child(2) .iconWrapper.showcangWrapper {
    font-size: 0.48rem;
  }

  .item:nth-child(2) .iconWrapper.showcangWrapper .icon {
    position: relative;
    top: -0.026rem;
  }

  .item:nth-child(3) .iconWrapper {
    font-size: 0.48rem;
  }

  .modifyWrapper {
    font-size: 0.426rem !important;
  }

  .modifyWrapper .icon {
    position: relative;
    top: 0rem;
  }

  .statistics {
    padding: 0.533rem 0 0.266rem 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  .dianzanWrapper .icon {
    position: relative;
    top: -0.026rem;
  }

  .active {
    color: #03aef9;
  }
  /*点赞样式*/
  .component-dianzanList{
    width:100%;
    padding: 0 0.4rem 0.373rem 0.4rem;
    background: #FFFFFF;
    margin-top: 0.213rem;
    position: relative;
  }
  .component-dianzanList span:nth-of-type(1){
    font-size:0.346rem;
    color:#03aef9;
  }

  .mui-table-view.detail-answer{
    margin-bottom: 0;
  }

</style>
