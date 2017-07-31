function bindUploadWaiting(mui)
{
    mui.showUploadWaiting = function() {
      var indicator = document.getElementById('uploadLoading');
      if (indicator) {
         return;
      }

     var element = document.createElement('div');
      element.id='uploadLoading';
      element.className='uploadLoading';
     element.innerHTML='<div id="bluecircle" class="c100 p30 big" ><span id="bluecircleBarValue">40%</span><div class="slice"><div class="bar" id="bluecircleBar" style="transform:rotate(40deg);"></div><div class="fill"></div></div></div><div class="mask"></div>';
     document.body.appendChild(element);
    }

    mui.closeUploadWaiting = function(){
      var indicator = document.getElementById('uploadLoading');
      if (indicator) {
        document.body.removeChild(indicator);
      }
    }

    mui.uploadWaitingValue = function(value){

      var indicator = document.getElementById('bluecircle');
      console.log('#bluecircle');
      console.log(indicator);
      if (indicator) {

        var bluecircleBar = document.getElementById('bluecircleBar');
        console.log('#bluecircleBar');
        console.log(bluecircleBar);
        bluecircleBar.style.transform = "rotate(" + value + "deg)";

        var bluecircleBarValue = document.getElementById('bluecircleBarValue');
        bluecircleBarValue.innerText = value + '%';
      }
    }
}



export {
  bindUploadWaiting,
};



