<template>
  <div class="statistics">
    <div class="item active">
      <div class="iconWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-pinglun1"></use>
        </svg>
      </div>

      <span>2</span>
    </div>

    <div class="item">
      <div class="iconWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gongkai"></use>
        </svg>
      </div>
      <span>2</span>
    </div>

    <div class="item">
      <div class="iconWrapper">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dianzan1"></use>
        </svg>
      </div>
      <span>2</span>
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
      commentNum: {
        type: Number,
        default: 0
      },
      seeNum: {
        type: Number,
        default: 0
      },
      supportNum: {
        type: Number,
        default: 0
      },
      answerId: {
        type: Number,
        default: 0
      }
    },
    created(){

    },
    methods: {}
  };
</script>

<style scoped="scoped">

  .item{
    line-height: 20px;
    color: #b4b4b6;
  }
  .item span {
    font-size: 14px;
    position: relative;
    top:-3px;
  }

  .item .iconWrapper {
    display: inline-block;
    border: 1px solid #dcdcdc;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    text-align: center;
    line-height: 42px;
    font-size: 24px;

  }
  .item.active .iconWrapper{
    border: 1px solid #03aef9;
  }

  .item:nth-child(1) .iconWrapper {
    font-size: 20px;
  }

  .item:nth-child(2) .iconWrapper {
    font-size: 24px;
  }

  .item:nth-child(3) .iconWrapper{
    font-size: 18px;
  }

  .statistics {
    padding: 20px 0 10px 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }


  .active{
    color:#03aef9;
  }
</style>
