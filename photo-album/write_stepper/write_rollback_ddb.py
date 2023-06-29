import json
import os

import boto3


def lambda_handler(event, context):
    print(event)
    file_path = event['file_path']

    dynamodb_client = boto3.resource('dynamodb')
    table = dynamodb_client.Table(os.environ["TableName"])

    table.delete_item(
        Key={
            "id": file_path
        }
    )

    index = file_path.index("/")
    file_path = file_path[index + 1:]
    index = file_path.index("/")
    user = file_path[:index]
    print(user)

    return {
        'statusCode': 200,
        'user': user,
        'content': 'Uploading was not successful. Rollback to dynamodb successfully.'
    }