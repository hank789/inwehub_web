<template>
  <div class="container-footer">
    <div class="footerLeft" @tap.stop.prevent="WriteComment()">
      <div class="footerMenuOne">说点什么</div>
    </div>
    <div class="footerRight">

      <div class="collectionComment" :class="[{showNumer: menuItem.showNumber || menuItem.ShowIsUpVote }]" v-for="(menuItem, index) in iconOptions" :key="index" @tap.stop.prevent="detailMenuIcon(menuItem)" :title="menuItem.text">
        <div :class="[{active: menuItem.showClass}]" :title="menuItem.text">
          <svg class="icon" :class="menuItem.showClass ? 'active' : ''" aria-hidden="true" :title="menuItem.text">
            <use :xlink:href="menuItem.icon"></use>
          </svg>
        </div>
        <span v-if="menuItem.number">{{ menuItem.number }}</span>
      </div>

      <div class="detailFollwers" v-show="isDetailUpVote" @tap.click.prevent="clickUpVote"></div>
      <div class="collectProduct" v-if="isNumUpVote" @tap.click.prevent="clickUpVote">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-yizan"></use>
        </svg>
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
      },
      isDetailUpVote: {
        type: Boolean,
        default: false
      },
      isNumUpVote: {
        type: Number,
        default: 0
      }
    },
    methods: {
      detailMenuIcon (item) {
        this.$emit('detailMenuIcon', item)
      },
      WriteComment () {
        this.$emit('WriteComment')
      },
      clickUpVote () {
        this.$emit('clickUpVote')
      }
    }
  }
</script>

<style scoped lang="less">

  .container-footer {
    position: absolute;
    bottom: 0;
    width: 10rem;
    left: 50%;
    height: 1.173rem;
    overflow: hidden;
    margin-left: -5rem !important;
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
      position: relative;
      .collectionComment {
        width: 1.333rem;
        height: 1.306rem;
        flex-grow:1;
        color: #808080;
        padding-top: 0.373rem;
        position: relative;
        &.showNumer {
          svg {
            color: #ffffff;
          }
          span {
          }
        }
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

  .collectProduct {
    position: absolute;
    top: 0.373rem;
    right: 57px;
    .icon {
      color: #03AEF9;
      font-size: 0.426rem;
    }
  }
  .detailFollwers {
    width: 0.773rem;
    height: 0.773rem;
    position: absolute;
    top: 7.5px;
    right: 50px;
  }
</style>
