import json
import boto3

def lambda_handler(event, context):
    user_pool_id = 'eu-central-1_IHn69bILn'

    client = boto3.client('cognito-idp')

    try:
        response = client.list_users(
            UserPoolId=user_pool_id
        )

        users = response['Users']
        
        username_list = [user['Username'] for user in users]

        return {
            'statusCode': 200,
            'body': username_list
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': 'Error while getting users from user pool: ' + str(e)
        }

