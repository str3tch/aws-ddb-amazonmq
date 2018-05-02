'use strict';

console.log('Loading stream function');

const { promisify } = require('util');

var AWS = require('aws-sdk');
//var dynamo = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

var db = new AWS.DynamoDB();

const getItemAsync = promisify(db.getItem);

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

    const record = event.Records[0];

    console.log(record.eventID);
    console.log(record.eventName);
    console.log('Sending event for: %j', record.dynamodb);

    var sendHeaders = {
      'destination': process.env.AmazonMQQueue,
      'content-type': 'text/plain'
    };

    var frame = client.send(sendHeaders);

    var params = {
      TableName: 'ImportantData',
      Key: record.dynamodb.Keys,
    };

    // Call DynamoDB to read the item from the table

    db.getItem(params, (err, data) => {
      if (err) {
        console.log("getitem error: " + err);
      }

      console.log("sending: " + JSON.stringify(data.Item));
      frame.write(JSON.stringify(data.Item));
      frame.end();
      client.disconnect();
      console.log("Disconnected from broker")
      callback(null, `Successfully processed ${event.Records.length} records.`);
    });

  });
};
