function dowloadFile (uri, path, callback) {
  window.mui.plusReady(() => {
    console.log('download:' + uri)

    function download () {
      // 重新下载
      var downLoader = window.plus.downloader.createDownload(uri, {
        filename: path
      }, function (download, status) {
        var fileName = download.filename
        var newurl = window.plus.io.convertLocalFileSystemURL(fileName)
        window.plus.io.resolveLocalFileSystemURL(newurl, function (entry) {
          var newurl = entry.toRemoteURL()
          console.log('已下载到:' + newurl)
          callback(newurl)
        })
      })
      downLoader.start()
    }

    // 目标文件已存在的进行删除
    window.plus.io.resolveLocalFileSystemURL(path, function (entry) {
      entry.remove(function (entry) {
        console.log('文件删除成功:' + path)
        download()
      }, function (e) {
        console.log('文件删除失败:' + path)
        download()
      })
    }, function (e) {
      console.log('图片不存在,联网下载:')
      download()
    })
  })
}

function getLocalUrl (path, callback) {
  window.mui.plusReady(() => {
    var newurl = window.plus.io.convertLocalFileSystemURL(path)
    if (window.mui.os.ios) {
      newurl = 'file://' + newurl
    }
    window.plus.io.resolveLocalFileSystemURL(newurl, function (entry) {
      var newurl = entry.toRemoteURL()
      callback(newurl)
    })
  })
}

function saveImageByBase64 (base64, dest, callback) {
  window.mui.plusReady(() => {
    var b = new window.plus.nativeObj.Bitmap()
    b.loadBase64Data(base64, function () {
      console.log('创建成功')
    }, function () {
      console.log('创建失败')
    })
    b.save(dest, {
      overwrite: true,
      quality: 100
    }, () => {
      console.log('保存成功')
      if (callback) {
        getLocalUrl(dest, (url) => {
          callback(url)
        })
      }
    }, () => {
      console.log('保存失败')
    })
  })
}

export {
  dowloadFile,
  getLocalUrl,
  saveImageByBase64
}
