<template>
  <div class="container-menuFooter" v-if="options.length">
    <template v-for="(item, index) in options">
      <div class="menu" :class="[{lightWidth: item.isLight, disable: item.disable, 'new': item.isNew}, 'menu_' + index, item.class]" @tap.click.prevent="clickItem(item)">
        <div class="iconWrapper">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="item.icon"></use>
          </svg>
        </div>
        <div class="desc">{{item.text}}{{item.number?item.number:''}}</div>
        <div class="mui-badge" v-if="item.newNum">{{item.newNum}}</div>
      </div>
      <!--<div class="line-vertical" v-if="item.rightLine"></div>-->
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
        isLight: false,
        newNum: 5
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

<style scoped>
  .container-menuFooter .menu.lightWidth .desc {
    width: 93px !important;
    height: 31px;
    border-radius: 8px;
    background: #03AEF9;
    line-height: 31px !important;
    color: #FFFFFF;
    font-size: 14px;
    top: 11px;
    left: 16px;
  }
</style>
