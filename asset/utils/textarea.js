function autoHeight (event, isAgain = false) {
  var oField = event.target
  console.log('textarea scrollHeight:' + oField.scrollHeight + ', clientHeight:' + oField.clientHeight)
  if (oField.scrollHeight > oField.clientHeight) {
    oField.style.height = oField.scrollHeight + 'px'
  } else {
    // if (oField.scrollHeight > 21) {
    //   oField.style.height = (oField.scrollHeight - 10) + 'px'
    // } else {
    //   oField.style.height = '21px'
    // }
    //
    // if (!isAgain) {
    //   setTimeout(() => {
    //     autoHeight(event, true)
    //   }, 100)
    // }
  }
}

export {
  autoHeight
}
