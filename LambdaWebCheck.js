// Check if a url is responding and logs an event to AWS CloudWatch
// (C) ActValue 2016 - pmosconi

"use strict";

// external dependencies
const AWS = require('aws-sdk');
const request = require('request');

// PUT YOUR URL HERE
const url = 'https://mywebsite.com/';
const timeout = 10000; // ms to wait for response


// get reference to cloudwatch 
const cloudwatch = new AWS.CloudWatch();


exports.handler = (event, context, callback) => {

    // ignore invalid SSL certificate
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";



    // call url and if response code is not 200 something is not working
    request.get(url, {timeout: timeout},
    (err, response, body) => {
        
        let value = 0;

        if (err) {
            console.log('Error: ' + err);
            value = 1;
        } 
        else if (response.statusCode !== 200) {
            console.log('Status Code: ' + response.statusCode);
            value = 1;
        } 
        else console.log('Status Code: 200');

        let params = {
            MetricData: [ /* required */
                {
                    MetricName: 'WebSiteNotResponding', /* required */
                    Dimensions: [
                        {
                            Name: 'url', /* required */
                            Value: url /* required */
                        }
                    ],
                    Timestamp: new Date,
                    Unit: 'Count',
                    Value: value
                }
            ],
            Namespace: 'ActValue' /* required */
        };

        cloudwatch.putMetricData(params, (err, data) => {
            if (err) callback(err, 'KO');
            else callback(null, data);
        });

    });


};
     