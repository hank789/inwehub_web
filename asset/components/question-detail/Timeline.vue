<template>
  <div class="mui-table-view detail-ask-timeline">
    <div class="mui-table-view-cell">

      <div class="timeline">
        <template v-for="(item, index) in timelines">
          <div class="nearsite-message">
            <div class="timage">
              	<svg class="icon blue pos" aria-hidden="true" v-if="!index">
                  <use xlink:href="#icon-shoucanghover"></use>
                </svg>
              	<svg class="icon" aria-hidden="true"  v-else>
                  <use xlink:href="#icon-plus--"></use>
                </svg>
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
      return {}
    },
    components: {},
    props: {
      timelines: {
        type: Array,
        default: []
      }
    },
    created () {

    }
  }
</script>

<style scoped="scoped">
  .detail-ask-timeline {
    padding-bottom: 1rem;
  }

  .timeline .timage .mui-icon {
    width: 2.3rem;
    height: 2.3rem;
    color: #4990E2;
    font-size: 1.2rem;
    position: relative;
    z-index: 777;
  }

  .timeline time {
    position: absolute;
    right: 1.5rem;
  }

  .timeline {
    font-size: 1.2rem;
  }

  /*timeline*/
  .nearsite-message {
    display: inline-block;
    clear: both;
    width: 100%;
    position: relative;
    padding: 0.5rem 1rem 0.5rem 1.5rem;
  }

  .nearsite-message .timage {
    float: left;
    margin-top: 2.1rem;
    width: 2.4rem;
    height: 2.4rem;
    border: 0.1rem solid #DCDCDC;
    background: #FFFFFF;
    border-radius: 50%;
    position: relative;
    font-size:1rem;
    color:#03aef9;
    left: -1.0.2rem;
    text-align: center;
  }

  .timage .icon{
    position: relative;
  }


  .blue {
    color: #03aef9;
  }


  .nearsite-message .desc {
    float: left;
    background: #fff;
    margin: 0 1rem 0rem 1rem;
    padding: 1rem 0 0 1rem;
    border-radius: 0.7rem;
    width: 85%;
    position: relative;
    min-height: 2rem;
    font-size: 1.3rem;
  }

  .nearsite-message .desc img {
    width: 100%;
  }

  .nearsite-message .descBefore:before {
    content: "";
    position: absolute;
    height: 100%;
    background-color: #a2a2a2;
    left: -2.2rem;
    top: 3rem;
    z-index: 0;
  }

  .desc span {
    color: #777;
  }

  .nearsite-message .triangle {
    height: 0rem;
    width: 0rem;
    border-width: 0.8rem;
    border-style: solid;
    position: absolute;
    top: 0.6rem;
    border-color: transparent #fff transparent transparent;
    left: -1.6rem;
  }

  .vertbar {
    width: 0.1rem;
    height: 7.4rem;
    background-color: #a2a2a2;
    margin: -4.1rem 2.5rem -3.8rem;

  }

  .detail-ask-timeline .mui-table-view-cell {
    padding: 0;
  }

  .mui-table-view:before {
    display: none;
    margin-top: 0;
  }

  .time {
    position: absolute;
    right: 1rem;
    top: 1.5rem;
    color: #b4b4b6;
  }

  .mui-table-view:after {
    display: none;
  }


</style>
