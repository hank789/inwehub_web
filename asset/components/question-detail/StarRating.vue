<template>
  <div class="mui-table-view detail-comment-result">

    <div class="mui-table-view-cell">
      <star-rating :rating="rating" :padding="8" :star-size="25" :activeColor="'#fcc816'" :show-rating="showRating"
                   :read-only="readOnly"></star-rating>
      {{ description }}

    </div>
    <span class="ratingNum">{{ rating }}.0</span>
  </div>
</template>

<script type="text/javascript">
  export default {
    data () {
      return {
        showRating: false
      }
    },
    props: {
      description: {
        type: String,
        default: ''
      },
      rating: {
        type: Number,
        default: 0
      },
      readOnly: {
        type: Boolean,
        default: true
      }
    },
    created () {

    },
    methods: {
      getHtml (id, options, callback) {
      }
    }
  }
</script>

<style scoped="scoped">
  .detail-comment-result {
    padding-top: 0;
    position: relative;
  }

  .detail-comment-result .ratingNum {
    position: absolute;
    right: 1rem;
    top: 2rem;
    color: #fcc816;
    font-size: 1.8rem;
  }

  .mui-table-view:after {
    left: 1.5rem;
    right: 1.5rem;
    background-color: #dcdcdc;
  }

  .mui-table-view-cell:after {
    display: none;
  }

  .detail-comment-result:before {
    display: none;
  }

  .mui-table-view-cell {
    color: #444;
    font-size: 1.4rem;
    padding: 2rem 1.5rem 1.7rem 1.5rem;
  }


</style>
