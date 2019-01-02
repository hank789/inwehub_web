<template>
  <swiper ref="inTags" :options="swiperOption" class="mescrollList-swiper-container">
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
        <div v-for="(list, listIndex) in lists">
          <div v-for="(item, itemIndex) in list">
            {{ item.id }}
          </div>
        </div>
      </RefreshList>
    </swiper-slide>
  </swiper>
</template>

<script>
  import RefreshList from './MescrollList.vue'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'

  const SwiperMescrollList = {
    data () {
      return {
        curNavIndex: 0,
        swiperOption: {
          slidesPerView: 'auto',
          spaceBetween: 0,
          observer: true,
          freeMode: true,
          onTransitionEnd: (swiper) => {
            var i = swiper.activeIndex // 轮播切换完毕的事件
            this.changePage(i)
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
    methods: {
      listChange (list, index) {
        this.lists[index] = list
        this.$emit('input', this.lists)
      },
      changePage (i) {
        if (this.curNavIndex === i) {
          return
        }
        this.curNavIndex = i

        // 定位菜单
        var eles = document.querySelectorAll('.mescroll-list-swiper-nav')
        for (var j in eles) {
          eles[j].classList.remove('active')
        }
        document.querySelector('.mescroll-list-swiper-nav-' + i).classList.add('active')
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
