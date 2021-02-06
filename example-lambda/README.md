## Example Lambda

### Deployment

Run the following commands to deploy the lambda function to your AWS account:

````
$ ACCOUNT_ID=$(aws sts get-caller-identity | jq -r '.Account')

$ BUCKET=your-deployment-s3-bucket

$ zip function.zip index.js

$ aws s3api put-object --bucket $BUCKET --key example-function.zip --body function.zip --metadata "x-amz-meta-repo=aws-sign-test,x-amz-meta-check-run-id=1844766117,	x-amz-meta-owner=abarcybr"
````

Create your signing configuration. Take not of the `Profile Arn` of the created signing profile in the AWS Console:
````
$ aws signer put-signing-profile \
  --platform-id "AWSLambda-SHA384-ECDSA" \
  --profile-name ExampleSigningProfile
````

Sign the lambda package using the `sign-artifact` python script:
````
$ sign-artifact.py --bucket-name avishay-test-bucket --key example-function.zip --signing-profile abarSigningProfile
````

After you finished signing it's the time to create the lambda role and function that verifies the signature

````
$ aws iam create-role --role-name lambda-ex --assume-role-policy-document file://trust-policy.json

$ aws lambda create-function --function-name example-lambda \
--zip-file fileb://function.zip --handler index.handler --runtime nodejs12.x \
--role arn:aws:iam::$ACCOUNT_ID\:role/lambda-ex \
--code-signing-config-arn $SIGNING_PROFILE_ARN
````