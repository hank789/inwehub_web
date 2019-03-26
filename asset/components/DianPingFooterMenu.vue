<template>
  <div class="container-menuFooter" v-if="options.length">
    <template v-for="(item, index) in options">
      <div class="menu" :class="[{lightWidth: item.isLight, is_FollWers: item.is_FollWers , disable: item.disable, 'new': item.isNew}, 'menu_' + index, item.class]" @tap.click.prevent="clickItem(item)">
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
    <div class="follwers" v-show="isFollwers" @tap.click.prevent="isCollect"></div>
    <div class="collectProduct" v-if="collect" @tap.click.prevent="isCollect">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-shoucanghover"></use>
      </svg>
    </div>
  </div>
</template>

<script type="text/javascript">
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
      },
      isFollwers: {
        type: Boolean,
        default: false
      },
      collect: {
        type: Number,
        default: false
      }
    },
    methods: {
      clickItem (item) {
        this.$emit('clickedItem', item)
      },
      isCollect () {
        this.$emit('clickCollect')
      }
    },
    mounted () {
    }
  }
</script>

<style scoped>
  .container-menuFooter .menu.lightWidth .desc {
    width: 2.48rem !important;
    height: 0.826rem;
    border-radius: 0.213rem;
    background: #03AEF9;
    line-height: 0.826rem !important;
    color: #FFFFFF;
    font-size: 0.373rem;
    top: 0.293rem;
    left: 0.426rem;
  }

  .container-menuFooter .menu.lightWidth {
    position: relative;
  }
  .container-menuFooter .menu.is_FollWers .icon {
    display: none;
  }
  .container-menuFooter .menu .iconWrapper svg {
    color: #808080;
  }
  .container-menuFooter .menu .desc {
    color: #B4B4B6;
  }
  .container-menuFooter .menu.disable .iconWrapper svg {
    color: #c8c8c8;
  }

  .container-menuFooter .menu_1 .iconWrapper svg {
    font-size: 0.586rem;
  }
  .follwers {
    width: 0.773rem;
    height: 0.773rem;
    position: absolute;
    top: 0.08rem;
    left: 4.613rem;
  }
  .follwers svg {
  }
  .collectProduct {
    position: absolute;
    top: 0.16rem;
    left: 4.72rem;
  }
  .collectProduct .icon {
    color: #FA4975;
    font-size: 0.586rem;
  }
</style>
