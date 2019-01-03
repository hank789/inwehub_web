<template>
  <swiper ref="mySwiper" :options="swiperOption" class="mescrollList-swiper-container">
    <swiper-slide v-for="(config, index) in listDataConfig" :key="index">
      <RefreshList
        :ref="'RefreshList_' + index"
        class="refreshListWrapper"
        :api="'recommendRead'"
        :prevOtherData="config.data"
        :nextOtherData="config.data"
        @listChange="listChange($event, index)"
        :pageMode="true"
        :autoShowEmpty="false"
      >

        <slot :name="'swiperList-' + index"></slot>
        <!--<div v-for="(item, itemIndex) in lists[index]" :key="itemIndex">-->
            <!--{{ item.id }}-->
        <!--</div>-->

      </RefreshList>
    </swiper-slide>
  </swiper>
</template>

<script>
  import RefreshList from './MescrollList.vue'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import Vue from 'vue'

  const SwiperMescrollList = {
    data () {
      return {
        curNavIndex: 0,
        swiperOption: {
          slidesPerView: 'auto',
          spaceBetween: 0,
          observer: true,
          freeMode: true,
          on: {
            transitionEnd: () => {
              var i = this.swiper.activeIndex
              this.changePage(i)
            }
          }
        },
        lists: []
      }
    },
    components: {
      RefreshList,
      swiper,
      swiperSlide
    },
    props: {
      listDataConfig: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    computed: {
      swiper () {
        return this.$refs.mySwiper.swiper
      }
    },
    methods: {
      listChange (list, index) {
        Vue.set(this.lists, index, list)
        this.lists[index] = list
        this.$emit('input', this.lists)
      },
      changePage (i) {
        if (this.curNavIndex === i) {
          return
        }
        this.curNavIndex = i

        // 定位菜单
        this.$emit('curNavIndexChange', this.curNavIndex)
      }
    }
  }

  export default SwiperMescrollList
</script>


<style scoped="scoped">
  .mescrollList-swiper-container{
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
