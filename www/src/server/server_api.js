var $ = require('jquery')

var ajax_URL = require('./ajax_URL')

var server_api = {
  ajax_post: function(data){
    return $.post(ajax_URL +'/ajax_post', data)
  }
}

module.exports = server_api