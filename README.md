## 初始化
npm install

## 构建
### 开发环境
npm run dev

### 测试环境
npm run test

### 生产环境
npm run build


## 目录介绍
/asset  资源目录,开发主要目录
/dist   生成的静态文件


#规范
##页面布局
  页面标题栏
    <header class="mui-bar-nav">
        //标题栏内容
    </header>

  页面主体内容
    <div class="mui-content">
        //页面主体内容
    </div>

  页面底部内容
    <nav class="footer-bar">
        //页面底部内容
    </nav>


##dialog使用:
1. import {alertSkyOne, alertSkyTwo, alertSimple} from '../../utils/dialog';
     import inwehubDialog from '../../components/Dialog.vue';

2.  components: {
         inwehubDialog,
       },

3. <inwehubDialog ref="inwehubDialog"></inwehubDialog>


4. this.$refs.inwehubDialog.getHtml('test', {ok:'this is ok'}, (html) => {
             console.log('html:'+html);
             alertSimple(html, 'ok');
         });


##dialog全局使用
  this.$parent.$refs.inwehubDialog.getHtml('test', {ok:'this is ok'}, (html) => {
            console.log('html:'+html);
            alertSimple(html, 'ok');
        });



##message组件使用
    调用
      this.$refs.MessageComponent.show('hello', () => {
          //点击后要处理的业务
            });


##列表组件使用
    第一步: 引入 import
          RefreshList from '../../components/refresh/List.vue';
    第二步: 绑定数据
          <RefreshList
                  v-model="list"
                  :api="'question/commonList'"      //api地址
                  :prevOtherData="{}"               //向上请求时要携带的参数
                  :nextOtherData="{}"               //向下请求时要携带的参数
                  :list="list"                      //列表数据
                >
                //.....
          </RefreshList>
    第三部:循环list即可

##路由命名
   1 小驼峰式
   2 列表如: /my/info/trains 以复数形式结尾
   3 详情
        如: '/my/info/train/:id'  需要id以:id结尾, 不需要id的以单数形式结尾


##pc端阶梯式布局尺寸参考值
    1-768        手机    100%
    768-992      平板    750px
    992-1200     小pc    970px
    1200-1919    大pc    1170px
    1920-        超大pc



##inwehub-web参考值
    768-x  1100px



##webview-详情页规则(请求参数中有id的，都要遵守以下规则)
1. 都要有以下方法
    refreshPageData

2. 并且添加
      watch: {
        '$route': 'refreshPageData'
      },


##webview-页面规则(请求中没有参数id的，都要遵守以下规则)
1. 必须有refreshPageData方法(如果页面切换间需要刷新当前页面的)
