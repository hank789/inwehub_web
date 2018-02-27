##列表组件使用

    第一步: 引入 import
          RefreshList from '../../components/refresh/List.vue';

    第二步: 绑定数据
          <RefreshList
                  v-model="list"
                  :api="'question/commonList'"      //api地址
                  :prevOtherData="{}"               //向上请求时要携带的参数
                  :nextOtherData="{}"               //向下请求时要携带的参数
                  ...
                >
                //.....
          </RefreshList>

    第三部:循环list即可

    可选
       . 获取完整的响应数据
          object this.$refs.RefreshList.getResponse(void)

##列表组件参数

###必填参数

    . v-model
    :api  //要请求的域名
    :list  //列表数据


###可选参数

    . isShowUpToRefreshDescription
       type:Boolean, 默认:true,显示
       是否显示上拉刷新的提示区域

    . downLoadMoreMode
       type:Boolean, 默认:false
       下拉是否加载更多

     . prevOtherData
       type: Object  默认{}
       下拉请求时需要额外添加的参数

     . nextOtherData
       type: Object  默认{}
       上拉请求时需要额外添加的参数

     . prevSuccessCallback
        type: Function
        下拉请求成功后的回调函数

      . autoShowEmpty
        type: Boolean, 默认true
        当请求的数据为空时是否自动显示数据为空的提示

      . nextSuccessCallback
        type: Function
        上拉请求成功后的回调函数

      . contentdown
        默认'下拉可以刷新'

      . contentover
         默认'释放立即刷新'

      . downcontentrefresh
         默认'正在刷新...'

      . upcontentrefresh
         默认'正在加载...

      . upcontentnomore
         默认 '没有更多数据了'

      . pageMode
          type: Boolean, 默认false
          false时传top_id, bottom_it给接口
          true时传page给接口
      . this.$refs.RefreshList.getResponse()
          :prevSuccessCallback="prevSuccessCallback
          获取全部数据



