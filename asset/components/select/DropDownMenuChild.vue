<template>
  <div class="listChildren">
    <div class="list">
      <div class="text ListTitle" @tap.capture="selectItem($event, tree)">
        <span>全部</span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xiangshangjiantou"></use>
        </svg>
      </div>
    </div>
    <template v-for="(child, childIndex) in tree.children">
        <div class="list">
          <div class="text ListTitle" @tap.capture="selectItem($event, child)">
            <span>{{ child.name }}（{{child.children_count}}）</span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiangshangjiantou"></use>
            </svg>
          </div>

          <DropDownMenuChild
            v-if="child.children && child.children.length"
            :tree="child"
            @selectItem="selectItem"
          ></DropDownMenuChild>
        </div>
     </template>
  </div>
</template>

<script>
  const DropDownMenuChildObj = {
    name: 'DropDownMenuChild',
    data: () => ({
    }),
    props: {
      tree: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    mounted () {
    },
    components: {

    },
    methods: {
      selectItem (event, item) {
        this.$emit('selectItem', event, item)
      }
    }
  }
  export default DropDownMenuChildObj
</script>

