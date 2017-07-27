/**
 * edwin
 * 选择文件上传--h5版本
 * @param acceptType img|file
 * @param callback 选择文件后的回调函数 callback(obj, base64)
 */
function selectFileH5(acceptType = '', callback){

    let fileInput = document.body.querySelector('input.upload-file[type=file]');
    if (fileInput == null) {
      fileInput = document.createElement('input');
      fileInput.setAttribute('type', 'file');

      if (acceptType === 'img') {
         fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/jpg, image/bmp, image/x-icon');
      }

      fileInput.classList.add('upload-file');
      fileInput.addEventListener('change', () => {
        if (fileInput.files != null && fileInput.files[0] != null) {

          var file = fileInput.files[0];

          var size = file.size/1000;  //kb
          if (size > 5120) {

            var warningText = '单张不允许超过5M！';

            if (acceptType === 'img') {
              warningText = '单张不允许超过5M！';
            }

            mui.alert(warningText);
            return false;
          }

          let reader = new FileReader();
          reader.onload = (e) => {
            fileInput.value = "";
            callback(file, e.target.result);
          }
          reader.readAsDataURL(file);
        }
      });
      document.body.appendChild(fileInput);
    }
    fileInput.click();
}

function compressImg(id)
{
    var image = document.getElementById(id);
    var canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext("2d").drawImage(image, 0, 0);
    var result = canvas.toDataURL('image/jpeg', 0.1);
    return result;
}

export {
  selectFileH5,
  compressImg
};
