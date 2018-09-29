## 初始化
npm install

## 构建
### 开发环境
npm run dev  40秒启动, 20秒更新
npm run new-dev 25秒启动, 5秒更新

### 测试环境
npm run test

### 测试环境-wechat
npm run test-browser

### 生产环境
npm run build

### 生产环境-wechat
npm run build-browser

### 代码规范监测
npm run lint

### api文档
git clone git@github.com:hank789/apiDoc.git

## 目录介绍
/asset  资源目录,开发主要目录
/dist   生成的静态文件


## 框架
vue: https://cn.vuejs.org/index.html
mui: http://www.dcloud.io/mui.html
5+sdk: http://ask.dcloud.net.cn/docs/

#规范
##git提交规范
1.每次提交需写清楚本次提交的变更
2.提交频率每天至少一次，多提交代码防止和别人的代码有冲突

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




##路由命名
   1 小驼峰式
   2 列表如: /my/info/trains 以复数形式结尾
   3 详情
        如: '/my/info/train/:id'  需要id以:id结尾, 不需要id的以单数形式结尾


##pc端阶梯式布局尺寸参考值
    1-768        手机    100%
    768-992      平板    750px
    992-1200     小pc    970px
    1200-1919    大pc    1200px
    1920-        超大pc  1200px



##inwehub-web参考值
    768-x  1100px



##webview-详情页规则(请求参数中有id的，都要遵守以下规则)
1. 都要有以下方法
    refreshPageData

2. 并且添加
      watch: {
        '$route' (to, from) {
          if (to.name === from.name) {
            this.refreshPageData()
          }
        }
      },


##webview-页面规则(请求中没有参数id的，都要遵守以下规则)
1. 必须有refreshPageData方法(如果页面切换间需要刷新当前页面的)


##webstorm启用规范检查
    设置->Languages & Frameworks > Javascript > Code Quality Tools> ESLint> 启用


##日志规范
1. 不要记请求到的数据(记了没有什么意义)
2. 不要直接记 数值型，布尔型, 对象(如果需要的话，前面加上描述信息)
3. 不要用console.error记录调试信息


##纯文本内容
line-height: 16px;
font-size: 16px;
