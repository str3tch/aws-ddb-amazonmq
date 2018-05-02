'use strict';

var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

exports.post = function (event, context, callback) {

  console.log("event: " + JSON.stringify(event))
  var data = JSON.parse(event.body);

  var item = {
    id: data.id,
    payload: data.payload,
  }

  const params = {
    TableName: "ImportantData",
    Item: item
  };

  console.log(JSON.stringify(params));

  dynamo.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the item: ' + error,
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: "Added item: " + JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
