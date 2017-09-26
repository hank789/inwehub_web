<template>
  <div class="mui-table-view detail-ask-timeline">
    <div class="mui-table-view-cell">

      <div class="timeline">
        <template v-for="(item, index) in timelines">
          <div class="nearsite-message">
            <div class="timage">
              <span class="mui-icon myicon myicon-askDetailHeart" v-if="!index"></span>
              <span class="mui-icon myicon myicon-askDetailJia" v-else></span>
            </div>

            <div class="desc" :class="timelines.length-1 != index?'descBefore':''">
              <div class="title">{{ item.title }} </div>
              <span>{{ item.description }}</span>
            </div>

            <div class="time">{{ item.created_at.split(' ')[0].replace(/-/g, '/') }}</div>

          </div>
          <div class="vertbar" v-show="index != timelines.length-1"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    data () {
      return {

      }
    },
    components: {

    },
    props: {
      timelines: {
        type: Array,
        default: []
      },
    },
    created(){

    }
  };
</script>

<style scoped="scoped">
  .detail-ask-timeline {
    padding-bottom: 10px;
  }

  .timeline .timage .mui-icon {
    width: 23px;
    height: 23px;
    color: #4990E2;
    font-size: 12px;
    position: relative;
    z-index: 777;
  }

  .timeline time {
    position: absolute;
    right: 15px;
  }

  .timeline {
    font-size: 12px;
  }

  /*timeline*/
  .nearsite-message {
    display: inline-block;
    clear: both;
    width: 100%;
    position: relative;
    padding: 5px 10px 5px 15px;
  }

  .nearsite-message .timage {
    float: left;
    margin-top: 21px;
  }

  .nearsite-message .timage img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  .nearsite-message .desc {
    float: left;
    background: #fff;
    margin: 0 10px 0px 10px;
    padding: 10px 0 0 10px;
    border-radius: 7px;
    width: 85%;
    position: relative;
    min-height: 20px;
    font-size: 13px;
  }

  .nearsite-message .desc img {
    width: 100%;
  }

  .nearsite-message .descBefore:before {
    content: "";
    position: absolute;
    height: 100%;
    background-color: #a2a2a2;
    left: -22px;
    top: 30px;
    z-index: 0;
  }

  .desc span {
    color: #777;
  }

  .nearsite-message .triangle {
    height: 0px;
    width: 0px;
    border-width: 8px;
    border-style: solid;
    position: absolute;
    top: 6px;
    border-color: transparent #fff transparent transparent;
    left: -16px;
  }

  .vertbar {
    width: 1px;
    height: 74px;
    background-color: #a2a2a2;
    margin: -41px 25px -38px;

  }


  .detail-ask-timeline .mui-table-view-cell {
    padding:0;
  }

  .mui-table-view:before{
    display: none;
    margin-top:0;
  }

  .time{
      position: absolute;
      right: 10px;
      top:15px;
      color:#b4b4b6;
  }
  .mui-table-view:after{
    display: none;
  }
  
  
</style>
