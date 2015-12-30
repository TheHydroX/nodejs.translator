var bt = require('bing-translate').init({
    client_id: 'BING_CLIENTID',
    client_secret: 'BING_CLIENTSECRET'
});
var token = 'YOUR_TELEGRAM_TOKEN';

var request = require("request")

setInterval(function(){
  request({
      url: 'https://api.telegram.org/bot' + token +'/getUpdates',
      json: true
  }, function (error, response, body) {

      if (!error && response.statusCode === 200) {
          console.log(body) // Print the json response

          for (index = 0; index < body.result.length; ++index) {
              var item = body.result[index];

              bt.translate(item.message.text, 'en', 'de', function(err, res){
                var params = {
                  chat_id: item.message.chat.id,
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
  })
 }, 3000);
