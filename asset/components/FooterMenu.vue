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
      <div class="line-vertical" v-if="options.length !== index + 1"></div>
    </template>
  </div>
</template>

<script type="text/javascript">
  /**
   * options: [
   *  {
   *    icon: "#icon-shoucang-xiao",
   *    text: "评论2",
   *    isLight: true // 是否突出显示
   *  }
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
    position: fixed;
    width: 100%;
    bottom: 0;
    height: 50px;
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
    top: -0.5px;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    background-color: #dcdcdc;
  }
  .menu-footer .line-vertical {
    position: relative;
    width: 1px;
    height: 24px;
    top: 50%;
    margin-top: -12px;
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
    margin-top: 7px;
  }
  .menu-footer .menu .iconWrapper svg {
    font-size: 19px;
    line-height: 19px;
  }
  .menu-footer .menu .desc {
    position: absolute;
    width: 100%;
    top: 31px;
    font-size: 11px;
    line-height: 11px;
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
