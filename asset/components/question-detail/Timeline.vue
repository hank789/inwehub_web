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
    padding-bottom: 0.266rem;
  }

  .timeline .timage .mui-icon {
    width: 0.613rem;
    height: 0.613rem;
    color: #4990E2;
    font-size: 0.32rem;
    position: relative;
    z-index: 777;
  }

  .timeline time {
    position: absolute;
    right: 0.4rem;
  }

  .timeline {
    font-size: 0.32rem;
  }

  /*timeline*/
  .nearsite-message {
    display: inline-block;
    clear: both;
    width: 100%;
    position: relative;
    padding: 0.133rem 0.266rem 0.133rem 0.4rem;
  }

  .nearsite-message .timage {
    float: left;
    margin-top: 0.56rem;
    width: 0.64rem;
    height: 0.64rem;
    border: 0.026rem solid #DCDCDC;
    background: #FFFFFF;
    border-radius: 50%;
    position: relative;
    font-size:0.266rem;
    color:#03aef9;
    left: -0.032rem;
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
    margin: 0 0.266rem 0rem 0.266rem;
    padding: 0.266rem 0 0 0.266rem;
    border-radius: 0.186rem;
    width: 85%;
    position: relative;
    min-height: 0.533rem;
    font-size: 0.346rem;
  }

  .nearsite-message .desc img {
    width: 100%;
  }

  .nearsite-message .descBefore:before {
    content: "";
    position: absolute;
    height: 100%;
    background-color: #a2a2a2;
    left: -0.586rem;
    top: 0.8rem;
    z-index: 0;
  }

  .desc span {
    color: #777;
  }

  .nearsite-message .triangle {
    height: 0rem;
    width: 0rem;
    border-width: 0.213rem;
    border-style: solid;
    position: absolute;
    top: 0.16rem;
    border-color: transparent #fff transparent transparent;
    left: -0.426rem;
  }

  .vertbar {
    width: 0.026rem;
    height: 1.973rem;
    background-color: #a2a2a2;
    margin: -1.093rem 0.666rem -1.013rem;

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
    right: 0.266rem;
    top: 0.4rem;
    color: #b4b4b6;
  }

  .mui-table-view:after {
    display: none;
  }


</style>
