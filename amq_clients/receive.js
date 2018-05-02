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

console.log("Connecting to AMQ...");
stompit.connect(connectOptions, function (error, client) {

  if (error) {
    console.log('AMQ connect error ' + error.message);
    return;
  }

  console.log("Connected to AMQ.");

  var subscribeHeaders = {
    'destination': '/queue/test',
    'ack': 'client-individual'
  };

  console.log("subscribing to queue: " + subscribeHeaders.destination);

  client.subscribe(subscribeHeaders, function (error, message) {

    if (error) {
      console.log('subscribe error ' + error.message);
      return;
    }

    console.log("subscribed.");
    message.readString('utf-8', function (error, body) {
      if (error) {
        console.log('read message error ' + error.message);
        return;
      }

      console.log('received message: ' + body);

      client.ack(message);

      //client.disconnect();
    });
  });

  // client.subscribe({
  //   destination: "/queue/test",
  //   ack: "auto"
  // },
  //   function (error, message) {
  //     if (error) {
  //       console.log("An error occured whilst subscribed to queue:", error);
  //     } else {
  //       message.setEncoding('utf8');
  //       console.log("Message received:", message.read());
  //       message.ack();
  //     }
  //   }
  // );

});

