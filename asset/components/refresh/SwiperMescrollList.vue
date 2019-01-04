<template>
  <swiper ref="mySwiper" :options="swiperOption" class="mescrollList-swiper-container">
    <swiper-slide v-for="(config, index) in localListDataConfig" :key="index">
      <RefreshList
        :ref="'RefreshList'"
        class="refreshListWrapper"
        :api="config.api"
        :prevOtherData="config.data"
        :nextOtherData="config.data"
        @listChange="listChange($event, index)"
        :pageMode="true"
        :autoShowEmpty="true"
        @listMounted="listMounted($event, index)"
        @listUpdated="listUpdated($event, index)"
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
        positionValues: [],
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
      listUpdated (event, index) {
        if (this.$refs.RefreshList[index]) {
          var positionValues = []
          var dateWrappers = this.$refs.RefreshList[index].$el.querySelectorAll('.dateWrapper')
          for (var i = 0; i < dateWrappers.length; i++) {
            var offsetTop = dateWrappers[i].offsetTop
            var text = dateWrappers[i].innerText
            positionValues.push({offsetTop: offsetTop, text: text})
          }

          Vue.set(this.positionValues, index, positionValues)
        }
      },
      listMounted (event, index) {
        this.$refs.RefreshList[index].mescroll.optUp.onScroll = (mescroll, y, isUp) => {
          console.log('up --> onScroll 列表当前滚动的距离 y = ' + y + ', 是否向上滑动 isUp = ' + isUp)
          this.$emit('listScroll', index, y, isUp)
        }

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

        setTimeout(() => {
          var y = this.$refs.RefreshList[this.curNavIndex].mescroll.getScrollTop()
          this.$emit('listScroll', this.curNavIndex, y, false)
        }, 500)
      },
      slideTo (i) {
        var listDataConfig = this.localListDataConfig[i]
        listDataConfig.autoShow = true
        Vue.set(this.localListDataConfig, i, listDataConfig)

        this.swiper.slideTo(i, 1000)

        setTimeout(() => {
          var y = this.$refs.RefreshList[i].mescroll.getScrollTop()
          this.$emit('listScroll', this.curNavIndex, y, false)
        }, 500)
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
