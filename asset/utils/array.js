
function getIndexByIdArray (arr, id) {
  for (var i in arr) {
    if (arr[i].id === id) {
      return i
    }
  }
  return -1
}

export {
  getIndexByIdArray
}
