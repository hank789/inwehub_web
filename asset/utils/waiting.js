function bindWaitting(mui) {
  mui.waiting = function () {

    var indicator = document.getElementById('mint-indicator');
    if (indicator) {
      return;
    }

    var element = document.createElement('div');
    element.id = 'mint-indicator';
    element.innerHTML = '<div class="mint-indicator" style="display: block;"><div class="mint-indicator-wrapper" style="padding: 8px 8px 4px 8px;"><div class="mint-indicator-spin"><div class="mint-spinner-fading-circle circle-color-19" style="width: 20px; height: 20px;"><div class="mint-spinner-fading-circle-circle is-circle2"></div><div class="mint-spinner-fading-circle-circle is-circle3"></div><div class="mint-spinner-fading-circle-circle is-circle4"></div><div class="mint-spinner-fading-circle-circle is-circle5"></div><div class="mint-spinner-fading-circle-circle is-circle6"></div><div class="mint-spinner-fading-circle-circle is-circle7"></div><div class="mint-spinner-fading-circle-circle is-circle8"></div><div class="mint-spinner-fading-circle-circle is-circle9"></div><div class="mint-spinner-fading-circle-circle is-circle10"></div><div class="mint-spinner-fading-circle-circle is-circle11"></div><div class="mint-spinner-fading-circle-circle is-circle12"></div><div class="mint-spinner-fading-circle-circle is-circle13"></div></div></div></div><div class="mint-indicator-mask"></div></div>';
    document.body.appendChild(element);

    mui.closeWaiting = function () {
      var element = document.getElementById('mint-indicator');
      if (element) {
        document.body.removeChild(element);
      }
    }
  }
}

export {
  bindWaitting,
};
