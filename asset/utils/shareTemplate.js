var whiteLogo = 'https://cdn.inwehub.com/system/whiteLogo@2x.png';

/**
 * 专业问答详情页-微信分享模版
 * url: /askCommunity/major/221
 */
function getAskCommunityMajorDetail(questionId, questionDescription, answerUsername)
{
    var link =  process.env.API_ROOT + 'wechat/oauth?redirect=/askCommunity/major/' + questionId;

    return {
      title:'专业问答|' + questionDescription  + '-' + answerUsername + '的回答',
      link:link,
      content:'专家' + answerUsername + '的回答，点击前往围观互动',
      imageUrl:whiteLogo,
      thumbUrl:whiteLogo
    }
}


export {
  getAskCommunityMajorDetail
};
