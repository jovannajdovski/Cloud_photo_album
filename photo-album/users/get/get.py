import json
import os

import boto3

def lambda_handler(event, context):
    user_pool_id = os.environ['UserPoolId']

    client = boto3.client('cognito-idp')
    print(user_pool_id)
    try:
        response = client.list_users(
            UserPoolId=user_pool_id
        )

        users = response['Users']
        
        username_list = [user['Username'] for user in users]
        print(username_list)
        return {
            'statusCode': 200,
            'body': json.dumps(username_list)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': 'Error while getting users from user pool: ' + str(e)
        }

