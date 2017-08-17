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
     element.innerHTML='<div id="bluecircle" class="c100 p0 big" ><span id="bluecircleBarValue">0%</span><div class="slice"><div class="bar" id="bluecircleBar" style="transform:rotate(0deg);"></div><div class="fill"></div></div></div><div class="mask"></div>';
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

      if (indicator) {

        var bluecircleBar = document.getElementById('bluecircleBar');

        var nvalue = parseInt(value*3.6);
        bluecircleBar.style.transform = "rotate(" + nvalue + "deg)";

        value = parseInt(value);
        indicator.className = indicator.className.replace(/\sp[0-9]+/, "");
        indicator.className += " p" + value;

        var bluecircleBarValue = document.getElementById('bluecircleBarValue');
        bluecircleBarValue.innerText = value + '%';
      }
    }
}



export {
  bindUploadWaiting,
};



