/**
 * 查询父元素中class中有classname的元素
 * @param obj
 * @param classname
 */
function queryParent(el, classname)
{
    if (!el) {
      return;
    }

    if (el.nodeName === 'body') {
        return;
    }

    if (el.nodeName !== 'svg' && el.nodeName !== 'use' && el.nodeName !== 'path' && el.className !== undefined) {
        if (el.className.match(classname)) {
          return el;
        } else {
          return queryParent(el.parentElement, classname);
        }
    } else {
      return queryParent(el.parentElement, classname);
    }
}



export {
  queryParent
};

