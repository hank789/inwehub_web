window.scrollEventContext = null

var eventCallback = function () {
  var context = window.scrollEventContext
  if (context.querySelector('#refreshContainer')) {
    console.log('底部菜单选项双击后找到 #refreshContainer')
    window.mui(context.querySelector('#refreshContainer')).pullRefresh().endPulldownToRefresh()
    window.mui(context.querySelector('#refreshContainer')).pullRefresh().pulldownLoading()
  } else {
    console.log('底部菜单选项双击后未找到 #refreshContainer')
    context.querySelector('.mui-content').scrollTop = 0
  }
}

var headerEventCallback = function () {
  var context = window.scrollHeaderEventContext
  if (context.querySelector('#refreshContainer')) {
    console.log('headder双击后找到 #refreshContainer')
    window.mui(context.querySelector('#refreshContainer')).pullRefresh().refresh(true)
    window.mui(context.querySelector('#refreshContainer')).pullRefresh().scrollTo(0, 0, 100)
  } else {
    console.log('headder双击后未找到 #refreshContainer')
    context.querySelector('.mui-content').scrollTop = 0
  }
}

function scrollToTop (context) {
  if (!context) {
    context = document.getElementById('router-view')
  }

  if (document.querySelector('.mui-tab-item.mui-active')) {
    console.log('发现底部菜单选项，绑定双击事件')
    window.scrollEventContext = context
    document.querySelector('.mui-tab-item.mui-active').addEventListener('doubletap', eventCallback)
  }

  if (context.querySelector('header')) {
    console.log('发现header, 绑定双击事件')
    window.scrollHeaderEventContext = context
    context.querySelector('header').addEventListener('doubletap', headerEventCallback)
  }
}

export {
  scrollToTop
}
