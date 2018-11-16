<template>
  <div class="container-footer">
    <div class="footerLeft" @tap.stop.prevent="WriteComment()">
      <div class="footerMenuOne">说点什么</div>
    </div>
    <div class="footerRight">

      <div class="collectionComment" v-for="(menuItem, index) in iconOptions" :key="index" @tap.stop.prevent="detailMenuIcon(menuItem)">
        <div :class="menuItem.showClass ? 'active' : ''">
          <svg class="icon" :class="menuItem.showClass ? 'active' : ''" aria-hidden="true">
            <use :xlink:href="menuItem.icon"></use>
          </svg>
        </div>
        <span v-if="menuItem.number">{{ menuItem.number }}</span>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    props: {
      detail: {
        type: Object,
        default: {}
      },
      iconOptions: {
        type: Array,
        default: []
      }
    },
    methods: {
      detailMenuIcon (item) {
        this.$emit('detailMenuIcon', item)
      },
      WriteComment () {
        this.$emit('WriteComment')
      }
    }
  }
</script>

<style scoped lang="less">

  .container-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1.173rem;
    overflow: hidden;
    background: #FFFFFF;
    &:before {
      position: absolute;
      top: 0;
      width: 100%;
      height: .02667rem;
      content: '';
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      background-color: #dcdcdc;
    }
    .footerLeft {
      display: flex;
      font-size: 0.373rem;
      float: left;
      padding: 0.133rem 0 0.133rem 0.426rem;
      .footerMenuTwo {
        display: flex;
        .containerBtn {
          display: flex;
          width: 2.96rem;
          height: 0.96rem;
          color: #ffffff;
          margin-right: 0.133rem;
          line-height: 0.96rem;
          text-align: center;
          border-radius: 0.213rem;
          justify-content: center;
        }
        .noBullish {
          background: #FA4975;
        }
        .bullish {
          background: #03AEF9;
        }
      }
      .footerMenuOne {
        width: 4.933rem;
        height: 0.906rem;
        color: #C8C8C8;
        line-height: 0.906rem;
        border-radius: 0.106rem;
        background: #F3F4F6;
        padding-left: 0.266rem;
        &.activeRed {
          color: #FA4975;
        }
        &.activeBlue {
          color: #03AEF9;
        }
      }
    }
    .footerRight {
      color: #B4B4B6;
      font-size: 0.266rem;
      text-align: center;
      display: flex;
      .collectionComment {
        width: 1.333rem;
        height: 1.306rem;
        flex-grow:1;
        color: #808080;
        padding-top: 0.373rem;
        position: relative;
        span {
          position: absolute;
          top: 0.293rem;
          left: 0.826rem;
          color: #FA4975;
          font-size: 0.266rem;
          margin-top: -0.106rem;
        }
      }
      .icon {
        font-size: 0.426rem;
        &.active {
          color: #C8C8C8;
        }
      }
    }
  }
</style>
