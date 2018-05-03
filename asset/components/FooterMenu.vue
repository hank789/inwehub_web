<template>
  <div class="container-menuFooter">
    <template v-for="(item, index) in options">
      <div class="menu" :class="{light: item.isLight, disable: item.disable, 'new': item.isNew}" @tap.click.prevent="clickItem(item)">
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
  .container-menuFooter {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 1.33333rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: distribute;
    justify-content: space-around;
    background: #fff; }
  .container-menuFooter:before {
    position: absolute;
    width: 100%;
    top: -0.01333rem;
    height: 0.02667rem;
    content: '';
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    background-color: #dcdcdc; }
  .container-menuFooter .line-vertical {
    position: relative;
    width: 0.02667rem;
    height: 0.64rem;
    top: 50%;
    margin-top: -0.32rem;
    -webkit-transform: scaleX(0.5);
    transform: scaleX(0.5);
    background-color: #dcdcdc; }
  .container-menuFooter .line-vertical:after {
    display: none; }
  .container-menuFooter .menu {
    position: relative;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    text-align: center;
    height: 100%; }
  .container-menuFooter .menu.disable {
    color: #C8C8C8; }
  .container-menuFooter .menu.new:after {
    content: '';
    position: absolute;
    width: 0.21333rem;
    height: 0.21333rem;
    border-radius: 50%;
    background: #FA4975;
    margin-left: 0.33333rem;
    top: 0.18667rem; }
  .container-menuFooter .menu .iconWrapper {
    margin-top: 0.18667rem; }
  .container-menuFooter .menu .iconWrapper svg {
    font-size: 0.50667rem;
    line-height: 0.50667rem; }
  .container-menuFooter .menu .desc {
    position: absolute;
    width: 100%;
    top: 0.82667rem;
    font-size: 0.29333rem;
    line-height: 0.29333rem;
    color: #808080; }
  .container-menuFooter .menu.noRightBorder:after {
    display: none; }
  .container-menuFooter .menu.light {
    background: url("../statics/images/shareBtnSmall@3x.png") no-repeat;
    background-size: cover; }
</style>
