import json
import os

import boto3

client = boto3.client('ses', region_name='eu-central-1')
cognitoClient = boto3.client('cognito-idp')


def lambda_handler(event, context):
    username = event['user']
    try:
        print(event)
        userEmail = ""
        response = cognitoClient.admin_get_user(
            UserPoolId=os.environ["UserPoolId"],
            Username=username
        )
        print(response)
        # Extract the email address from the user attributes
        for attribute in response['UserAttributes']:
            if attribute['Name'] == 'email':
                userEmail = attribute['Value']

        if userEmail == '':
            return {
                'statusCode': 404,
                'body': json.dumps("User not foundd")
            }

    except Exception as e:
        return {
            'statusCode': 404,
            'body': json.dumps("User not found")
        }

    content = event['content']
    response = client.send_email(
        Destination={
            'ToAddresses': [userEmail]
        },
        Message={
            'Body': {
                'Text': {
                    'Charset': 'UTF-8',
                    'Data': content,
                }
            },
            'Subject': {
                'Charset': 'UTF-8',
                'Data': "SIRFIV transaction info",
            },
        },
        Source='jnizvodno@gmail.com'
    )

    print(response)

    return {
        'statusCode': 200,
        'body': json.dumps("Email Sent Successfully. MessageId is: " + response['MessageId'])
    }