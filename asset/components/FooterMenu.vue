<template>
  <div class="menu-footer">
    <template v-for="(item, index) in options">
      <div class="menu" :class="{light: item.isLight, disable: item.disable}" @tap.click.prevent="clickItem(item)">
        <div class="iconWrapper">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="item.icon"></use>
          </svg>
        </div>
        <div class="desc">{{item.text}}{{item.number?item.number:''}}</div>
      </div>
      <div class="line-vertical" v-if="item.rightLine"></div>
    </template>
  </div>
</template>

<script type="text/javascript">
  /**
   * options: [
   *  {
        icon: '#icon-pinglun',
        text: '评论',
        number: this.detail.comments_number,
        disable: false,
        rightLine: true,
        isLight: false
      },
   * ]
   */
  export default {
    data () {
      return {}
    },
    components: {},
    props: {
      options: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    methods: {
      clickItem (item) {
        this.$emit('clickedItem', item)
      }
    }
  }
</script>

<style>
  .menu-footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 1.333rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: distribute;
    justify-content: space-around;
    background: #fff;
  }
  .menu-footer:before {
    position: absolute;
    width: 100%;
    top: -0.013rem;
    height: 0.026rem;
    content: '';
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    background-color: #dcdcdc;
  }
  .menu-footer .line-vertical {
    position: relative;
    width: 0.026rem;
    height: 0.64rem;
    top: 50%;
    margin-top: -0.32rem;
    -webkit-transform: scaleX(0.5);
    transform: scaleX(0.5);
    background-color: #dcdcdc;
  }
  .menu-footer .line-vertical:after {
    display: none;
  }
  .menu-footer .menu {
    position: relative;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    text-align: center;
    height: 100%;
  }
  .menu-footer .menu.disable {
    color: #C8C8C8;
  }
  .menu-footer .menu .iconWrapper {
    margin-top: 0.186rem;
  }
  .menu-footer .menu .iconWrapper svg {
    font-size: 0.506rem;
    line-height: 0.506rem;
  }
  .menu-footer .menu .desc {
    position: absolute;
    width: 100%;
    top: 0.826rem;
    font-size: 0.293rem;
    line-height: 0.293rem;
    color: #808080;
  }
  .menu-footer .menu.noRightBorder:after {
    display: none;
  }
  .menu-footer .menu.light {
    background: url("../statics/images/shareBtnSmall@3x.png") no-repeat;
    background-size: cover;
  }
</style>
