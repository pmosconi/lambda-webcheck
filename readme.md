# WEBCHECK
**An AWS Node.js Lambda Function to check if a website is up and running and raise an alarm if not**

*LambdaWebCheck.js* is a simple Node.js function that makes an http get request and logs the response to a custom *AWS CloudWatch* metric.  The metric can then be used to setup and raise an alarm if the url is not responding. The function is automatically triggered at a predefined interval or schedule by AWS CloudWatch Events infrastructure.

The setup procedure involves:
..* configuring the code and preparing a zip package for upload to AWS Lambda;
..* creating an AWS IAM execution role with permissions on CloudWatch;
..* creating, configuring and testing the AWS Lambda function;
..* creating a CloudWatch alarm based on the function metrics.

In detail:

1. Modify the code of *LambdaWebCheck.js* function setting the appropriate url
2. Run *npm install --only=production* to install the *request* package and create a *LambdaWebCheck.zip* file containing LambdaWebCheck.js and the node_modules folder
3. Login to your AWS account, goto IAM Console (Identity and Access Management), select Roles and
..* click button *Create New Role*; input *cloudwatch-putmetric* (or the role name you prefer) in the Role Name field and click button *Next Step*
..* within the AWS Service Roles select *AWS Lambda* and go the Attach Policy page
..* select *CloudWatchFullAccess* policy and click button *Next Step*
..* review your selection and click button *Create Role*
4. Goto Lambda Console and click on the *Create a Lambda function* button, then
..* select Node.js 4.3 in the *Select runtime* drop-down
..* select node-exec blueprint (this is not important, you can choose any) by clicking on its name
..* in the *Configure triggers* page click on the empty square and select *CloudWatch Events - Schedule* from the list
..* enter Rule name (eg.: exec-5-mins), Rule description (eg.: executes once every 5 minutes), select the appropriate option from the Schedule expression drop-down (eg.: rate(5 minutes))
..* don't select Enable trigger and click Next
..* in the *Configure function* page enter a Name (eg.: web-check-mysite), a Description, make sure Runtime is Node.js 4.3, change *Code entry type* to Upload a .ZIP file and select the LambdaWebCheck.zip created earlier
..* change *Handler* to LambdaWebCheck.handler
..* select Choose an existing role from the Role drop-down and select cloudwatch-putmetric (or the role you defined in step 3) from the Existing role drop-down
..* in the Advanced settings set Timeout at 30 seconds  and click Next
..* review your settings and click *Create function*
..* click on Test, ignore the content of the input test event (we are not using it) and click *Save and test*
..* if all is well you will see a success log, otherwise you need to troubleshoot the configuration error and test again until it is fixed
..* now select the *Triggers* tab and enable the CloudWatch event schedule we defined above
5. Goto CloudWatch Console, select Alarms and click on the *Create Alarm* button
..* select ActValue from Custom Metrics drop-down
..* select the url you configured and click Next
..* enter alarm name and description (eg: mywebsite not responding)
..* set the following Whenever expression: >= 1 for 2 consecutive periods (assuming the Lambda function runs every 5 minutes, this means that the alarm is raised after 2 failed executions)
..* in the Action section, select a notification list o create a new one
..* click the button *Create Alarm* and hope you will never receive the alarm notification email ...