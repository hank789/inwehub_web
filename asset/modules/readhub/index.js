import Vue from 'vue';

require('./bootstrap');

/**
 * This is our global Store, we save so many stuff in it so that we don't have to duplicate data.
 * We might wanna refactor this to use Vuex instead, but untill this moment I don't see why!!!
 * The store gets filled by main vue-instance's ajax call at first load of the application.
 *
 * @type object
 */
window.Store = {
  category: [],
  user: [],

  submissionUpVotes: [],
  submissionDownVotes: [],

  commentUpVotes: [],
  commentDownVotes: [],

  submissionBookmarks: [],
  commentBookmarks: [],
  categoryBookmarks: [],
  userBookmarks: [],

  blockedUsers: [],

  moderatingCategories: [],
  moderatorAt: [],
  administratorAt: [],
  moderatingAt: [], // contains both moderator and administrator
  subscribedAt: [],

  notifications: [],
  messages: [],
  contacts: [],

  contentRouter: 'content',
  feedFilter: '',
  sidebarFilter: '',

  subscribedCategories: [],

  is_h5: Laravel.is_h5,
  loading: true,
}


var oldLog = console.log;
console.oldLog = oldLog;
console.log = function () {
  var pre = '[LLOG]: ****** >>>';
  var append = '<<< ****** ' + window.location.href;

  for (var i in arguments) {
    var model = arguments[i];


    if (!model) {
      console.oldLog(pre + model + append);
    } else  if (model.constructor == String) {
      console.oldLog(pre + model + append);
    } else {
      for (var i in model) {
        if (model[i] != undefined) {
          if (model[i].constructor == Object) {
            console.log(model[i]);
          } else {
            console.oldLog(pre + i + " => " + model[i] + append);
          }
        }
      }
    }
  }
};

import './../../styles/readhub.css';

require('./vue-codes');
