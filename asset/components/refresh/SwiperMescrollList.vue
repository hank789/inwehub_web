<template>
  <swiper ref="mySwiper" :options="swiperOption" class="mescrollList-swiper-container" v-if="localListDataConfig.length">
    <swiper-slide v-for="(config, index) in localListDataConfig" :key="index">
      <RefreshList
        :ref="'RefreshList_' + index"
        class="refreshListWrapper"
        :api="config.api"
        :prevOtherData="config.data"
        :nextOtherData="config.data"
        @listChange="listChange($event, index)"
        @prevSuccessCallback="prevSuccessCallback"
        :pageMode="true"
        :isLoading="isLoading"
        :autoShowEmpty="true"
        @listMounted="listMounted($event, index)"
        @listUpdated="listUpdated($event, index)"
        @listScroll="listScroll($event, index)"
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
        localListDataConfig: [],
        curNavIndex: this.initPageIndex,
        positionValues: [],
        swiperOption: {
          initialSlide: this.initPageIndex,
          slidesPerView: 'auto',
          spaceBetween: 0,
          observer: true,
          freeMode: false,
          on: {
            slideChange: () => {
              if (this.swiper) {
                var i = this.swiper.activeIndex
                console.log('swiper切换到:' + i)
                this.changePage(i)
              }
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
      initPageIndex: {
        type: Number,
        default: 0
      },
      isLoading: {
        type: Boolean,
        default: true
      },
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
      getActiveRefreshList () {
        var curList = null
        if (this.$refs['RefreshList_' + this.curNavIndex] && this.$refs['RefreshList_' + this.curNavIndex][0]) {
          curList = this.$refs['RefreshList_' + this.curNavIndex][0]
        }
        return curList
      },
      listUpdated (event, index) {
        var curList = null
        if (this.$refs['RefreshList_' + index] && this.$refs['RefreshList_' + index][0]) {
          curList = this.$refs['RefreshList_' + index][0]
        }

        if (curList) {
          var positionValues = []
          var dateWrappers = curList.$el.querySelectorAll('.dateWrapper')
          for (var i = 0; i < dateWrappers.length; i++) {
            var offsetTop = dateWrappers[i].offsetTop
            var text = dateWrappers[i].querySelector('.LeftDate').innerText
            positionValues.push({offsetTop: offsetTop, text: text})
          }

          Vue.set(this.positionValues, index, positionValues)
        }
      },
      listScroll (data, index) {
        this.$emit('listScroll', index, data.y, data.isUp)
      },
      listMounted (event, index) {
        this.$emit('listMounted', index)
      },
      listChange (list, index) {
        Vue.set(this.lists, index, list)
        this.$emit('input', this.lists)
      },
      prevSuccessCallback (data) {
        this.$emit('prevSuccessCallback', data)
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
          var curList = null
          if (this.$refs['RefreshList_' + this.curNavIndex] && this.$refs['RefreshList_' + this.curNavIndex][0]) {
            curList = this.$refs['RefreshList_' + this.curNavIndex][0]
          }
          if (curList && curList.mescroll) {
            var y = curList.mescroll.getScrollTop()
            this.$emit('listScroll', this.curNavIndex, y, false)
          }
        }, 500)
      },
      slideTo (i) {
        var listDataConfig = this.localListDataConfig[i]
        listDataConfig.autoShow = true
        Vue.set(this.localListDataConfig, i, listDataConfig)

        this.swiper.slideTo(i, 1000)

        setTimeout(() => {
          var curList = null
          if (this.$refs['RefreshList_' + i] && this.$refs['RefreshList_' + i][0]) {
            curList = this.$refs['RefreshList_' + i][0]
          }
          if (curList && curList.mescroll) {
            var y = curList.mescroll.getScrollTop()
            this.$emit('listScroll', this.curNavIndex, y, false)
          }
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
