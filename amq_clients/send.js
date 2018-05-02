const stompit = require('stompit');

var connectOptions = {
  'host': 'b-bff59fc8-16c7-4dd8-a462-05fd007c4f5a-1.mq.ap-southeast-2.amazonaws.com',
  'port': 61614,
  'ssl': true,
  'connectHeaders': {
    'host': '/',
    'login': 'chrisd',
    'passcode': 'v23iNP5@7n!0'
  }
};

stompit.connect(connectOptions, function (error, client) {

  if (error) {
    console.log('connect error ' + error.message);
    return;
  }

  var sendHeaders = {
    'destination': '/queue/test',
    'content-type': 'text/plain'
  };

  var frame = client.send(sendHeaders);
  frame.write('hello');
  frame.end();

  var subscribeHeaders = {
    'destination': '/queue/test',
    'ack': 'client-individual'
  };

  client.subscribe(subscribeHeaders, function (error, message) {

    if (error) {
      console.log('subscribe error ' + error.message);
      return;
    }

    message.readString('utf-8', function (error, body) {

      if (error) {
        console.log('read message error ' + error.message);
        return;
      }

      console.log('received message: ' + body);

      client.ack(message);

      client.disconnect();
    });
  });
});

