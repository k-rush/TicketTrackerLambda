'use strict'
var waterfall = require('async-waterfall');
var async = require('async');
const uuidv1 = require('uuid/v1');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

exports.handler = (event, context, callback) =>
{
    console.log('Received event:', JSON.stringify(event, null, 2));
    const done = (err, res) => callback(null, {
        statusCode: err ? (err.code ? err.code : '400') : 200,
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'

        }
    });

    var body = {};
    try { 
        body = JSON.parse(event.body);
    } catch (err) { callback({message:"Could not process event body", code:'500'},null); }

    switch (event.httpMethod) {
        case 'POST':
            var timeString = new Date().getTime().toString();
            var uuid = uuidv1();
            var params = {
                TableName : 'JitbitTickets',
                Item : {"Id": body.TicketId, "From": body.From, "Subject": body.Subject, "Body":body.Body, "LoggedAt":timeString}
            }

            dynamo.putItem(params, done);
    }

}
