<template>
  <swiper ref="mySwiper" :options="swiperOption" class="mescrollList-swiper-container">
    <swiper-slide v-for="(config, index) in localListDataConfig" :key="index">
      <RefreshList
        :ref="'RefreshList_' + index"
        class="refreshListWrapper"
        :api="config.api"
        :prevOtherData="config.data"
        :nextOtherData="config.data"
        @listChange="listChange($event, index)"
        :pageMode="true"
        :autoShowEmpty="true"
        @listMounted="listMounted($event, index)"
        v-if="config.autoShow"
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
        localListDataConfig: this.listDataConfig,
        curNavIndex: 0,
        swiperOption: {
          slidesPerView: 'auto',
          spaceBetween: 0,
          observer: true,
          freeMode: false,
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
      listMounted (event, index) {
        this.$emit('listMounted', index)
      },
      listChange (list, index) {
        Vue.set(this.lists, index, list)
        this.$emit('input', this.lists)
      },
      changePage (i) {
        if (this.curNavIndex === i) {
          return
        }
        this.curNavIndex = i

        var listDataConfig = this.localListDataConfig[i]
        listDataConfig.autoShow = true
        Vue.set(this.localListDataConfig, i, listDataConfig)

        // 定位菜单
        this.$emit('curNavIndexChange', this.curNavIndex)
      },
      slideTo (i) {
        var listDataConfig = this.localListDataConfig[i]
        listDataConfig.autoShow = true
        Vue.set(this.localListDataConfig, i, listDataConfig)

        this.swiper.slideTo(i, 1000)
      }
    },
    watch: {
      listDataConfig: function (newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          this.localListDataConfig = newValue
        }
      }
    }
  }

  export default SwiperMescrollList
</script>


<style scoped="scoped">
  .mescrollList-swiper-container{
    position: absolute;
    top: 2.133rem;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
