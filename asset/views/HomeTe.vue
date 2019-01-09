<template>
  <div class="mui-content">
    <SwiperMescrollList
      ref="mescrollDetail"
      :listDataConfig="listDataConfig"
      v-model="lists"
      @curNavIndexChange="curNavIndexChange"
    >

      <template v-for="(listData, listDataIndex) in listDataConfig">
          <div :slot="'swiperList-' + listDataIndex">
            <div v-for="(item, itemIndex) in lists[listDataIndex]" :key="itemIndex">
            {{ item.id }}
            </div>
          </div>
      </template>

    </SwiperMescrollList>
  </div>
</template>

<script>
  import SwiperMescrollList from '../components/refresh/SwiperMescrollList.vue'

  export default {
    data () {
      return {
        loading: 1,
        lists: [],
        listDataConfig: [
          {
            api: 'recommendRead',
            data: {}
          },
          {
            api: 'recommendRead',
            data: {}
          }
        ]
      }
    },
    components: {
      SwiperMescrollList
    },
    methods: {
      curNavIndexChange: (index) => {
        console.log('当前页数:' + index)
      }
    }
  }
</script>
