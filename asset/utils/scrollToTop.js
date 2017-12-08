window.scrollEventContext = null

var eventCallback = function () {
  var context = window.scrollEventContext
  if (context.querySelector('#refreshContainer')) {
    console.log('底部菜单选项双击后找到 #refreshContainer')
    window.mui(context.querySelector('#refreshContainer')).pullRefresh().endPulldownToRefresh()
    window.mui(context.querySelector('#refreshContainer')).pullRefresh().pulldownLoading()
  } else if (context.querySelector('#pullrefresh')) {
    console.log('底部菜单选项双击后找到 #pullrefresh')
    window.mui(context.querySelector('#pullrefresh')).pullRefresh().endPulldownToRefresh()
    window.mui(context.querySelector('#pullrefresh')).pullRefresh().pulldownLoading()
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

  if (context.querySelector('#refreshContainer')) {
    console.log('found #refreshContainer')
    setTimeout(() => {
      window.mui(context.querySelector('#refreshContainer')).pullRefresh().endPulldownToRefresh()
    }, 500)
  } else if (context.querySelector('#pullrefresh')) {
    console.log('found #pullrefresh')
    setTimeout(() => {
      window.mui(context.querySelector('#pullrefresh')).pullRefresh().endPulldownToRefresh()
    }, 500)
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

  if (context.querySelector('#immersedWrapper')) {
    console.log('发现immersedWrapper, 绑定双击事件')
    window.scrollHeaderEventContext = context
    context.querySelector('#immersedWrapper').addEventListener('doubletap', headerEventCallback)
  }
}

export {
  scrollToTop
}
