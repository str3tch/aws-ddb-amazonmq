'use strict';

console.log('Loading stream function');

exports.handler = (event, context, callback) => {
    console.log('Stream lambda received event:', JSON.stringify(event, null, 2));
    const stompit = require('stompit');

    var connectOptions = {
        'host': process.env.AmazonMQHost,
        'port': 61614,
        'ssl': true,
        'connectHeaders': {
            'host': '/',
            'login': process.env.AmazonMQUser,
            'passcode': process.env.AmazonMQPassword
        }
    };

    console.log("Connecting to AmazonMQ broker...");

    stompit.connect(connectOptions, function (error, client) {

        if (error) {
            console.log('connect error ' + error.message);
            return;
        }

        console.log("Connected to AmazonMQ broker successfully");

        var sendHeaders = {
            'destination': '/queue/test',
            'content-type': 'text/plain'
        };

        var frame = client.send(sendHeaders);

        event.Records.forEach((record) => {
            console.log(record.eventID);
            console.log(record.eventName);
            console.log('Sending event for: %j', record.dynamodb);

            console.log("sending: " + JSON.stringify(event));
            frame.write(JSON.stringify(event));
            frame.end();
        });

        client.disconnect();
        console.log("Disconnected from broker")
        callback(null, `Successfully processed ${event.Records.length} records.`);
    });



};
