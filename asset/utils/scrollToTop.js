function scrollToTop (context) {
  if (!context) {
    context = document.getElementById('router-view')
  }

  if (!context.querySelector('header')) {
    return
  }
  context.querySelector('header').addEventListener('doubletap', () => {
    if (context.querySelector('#refreshContainer')) {
      window.mui('#refreshContainer').pullRefresh().scrollTo(0, 0, 100)
    } else {
      context.querySelector('.mui-content').scrollTop = 0
    }
  })
}

export {
  scrollToTop
}
