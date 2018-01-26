
function getIndexByIdArray (arr, value, key = 'id') {
  for (var i in arr) {
    if (arr[i][key] === value) {
      return i
    }
  }
  return -1
}

export {
  getIndexByIdArray
}
