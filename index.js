console.log('\033[2J');
console.log(' ============== START  ============== ')

﻿var bt = require('bing-translate').init({
    client_id: 'BING_CLIENTID',
    client_secret: 'BING_CLIENTSECRET'
});
var token = 'YOUR_TELEGRAM_TOKEN';

var _timer = 3000;

var _firstrun = true;
var _result = {};
var request = require("request")

Array.prototype.myFind = function(obj) {
    return this.filter(function(item) {
        for (var prop in obj)
            if (!(prop in item) || obj[prop] !== item[prop])
                 return false;
        return true;
    });
};

function getUpdates() {
  // console.log('run getUpdates')
  request({
    url: 'https://api.telegram.org/bot' + token +'/getUpdates',
    json: true
  }, function (error, response, body) {

    if (!error && response.statusCode === 200) {

      if (body.result && _firstrun) {
        console.log('get master results')
        _result.items = (body.result);
        _firstrun = false;
        for(var key in _result.items){
            if(_result.items.hasOwnProperty(key)){
                _result.lastitem = _result.items[key];
            }
        }
        console.log('set last update_id')
        console.log('>> ' + _result.lastitem.update_id)
      }

      for (index = 0; index < body.result.length; ++index) {
        var currentUpdate = body.result[index];
        if (_result.lastitem.update_id < currentUpdate.update_id){
          console.log(':: new update')
          _result.lastitem = currentUpdate;
          bt.translate(currentUpdate.message.text, 'en', 'de', function(err, res){
            var params = {
              chat_id: currentUpdate.message.chat.id,
              text: res.translated_text,
            }
            request({
              url: 'https://api.telegram.org/bot' + token +'/sendMessage',
              method: "POST",
              json: params
            });
          });
        }

      }

    }

  })

}

getUpdates();
setInterval(function(){ getUpdates() }, _timer);
