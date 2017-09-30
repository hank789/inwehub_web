import {alertZoom, alertSkyOne, alertSkyTwo, alertSimple, getDialogObj} from '../utils/dialog';


function alertFenhongxize(context)
{
  var dialogObj = getDialogObj(context);
  if (dialogObj) {
    dialogObj.getHtml('fenhongxize', {}, (html) => {
      alertSimple(html, '确定', () => {
          //...
      }, false);
    });
  }
}

export {
  alertFenhongxize
};
