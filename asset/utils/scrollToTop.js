window.scrollEventContext = null

var eventCallback = function () {
  var context = window.scrollEventContext

  var slideActive = context.querySelector('.mescrollList-swiper-container .swiper-slide-active')
  if (slideActive) {
    context = slideActive
  }

  var mescrollEle = context.querySelector('.mescroll')
  // document.querySelector('.mescroll').__vue__
  if (mescrollEle) {
    console.log('底部菜单选项双击后找到 #mescroll')
    mescrollEle.__vue__.mescroll.triggerDownScroll()
    mescrollEle.__vue__.mescroll.scrollTo(0)
    var tagsHomeHide = document.querySelector('.container-tags-home-hide')
    if (tagsHomeHide) {
      tagsHomeHide.classList.remove('showTagsHome')
    }
  }
}

var headerEventCallback = function () {
  var context = window.scrollHeaderEventContext

  var slideActive = context.querySelector('.mescrollList-swiper-container .swiper-slide-active')
  if (slideActive) {
    context = slideActive
  }

  var mescrollEle = context.querySelector('.mescroll')
  if (mescrollEle) {
    console.log('headder双击后找到 #mescroll')
    mescrollEle.__vue__.mescroll.scrollTo(0)
  } else {
    console.log('headder双击后未找到 #mescroll')
    context.querySelector('.mui-content').scrollTop = 0
  }
}

function scrollToTop (context) {
  if (!context) {
    context = document.getElementById('router-view')
  }

  if (context.querySelector('#refreshContainer') && window.mui(context.querySelector('#refreshContainer')).pullRefresh()) {
    console.log('found #refreshContainer')
    setTimeout(() => {
      window.mui(context.querySelector('#refreshContainer')).pullRefresh().endPulldownToRefresh()
    }, 500)
  } else if (context.querySelector('#pullrefresh') && window.mui(context.querySelector('#pullrefresh')).pullRefresh()) {
    console.log('found #pullrefresh')
    setTimeout(() => {
      window.mui(context.querySelector('#pullrefresh')).pullRefresh().endPulldownToRefresh()
    }, 500)
  }

  if (document.querySelector('.container-footer > .menu.active')) {
    console.log('发现底部菜单选项，绑定双击事件')
    window.scrollEventContext = context
    document.querySelector('.container-footer > .menu.active').addEventListener('doubletap', eventCallback)
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
