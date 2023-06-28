import json
import os

import boto3

def lambda_handler(event, context):
    print(event)
    message = event[0]

    dynamodb_client = boto3.resource('dynamodb')
    table = dynamodb_client.Table(os.environ["TableName"])
    item = {
        'id': str(message['id']),
        'name': str(message['name']),
        'type': str(message['type']),
        'size': int(message['size']),
        'createTime': str(message['createTime']),
        'editTime':str(message['editTime']),
        'description': str(message['description']),
        'tag': str(message['tag']),
    }

    response = table.put_item(
        Item=item
    )
    file_path = message['id']
    index=file_path.index("/")
    user=file_path[:index]
    return {
        'statusCode': 200,
        'user': user,
        'content': 'Deletion was not successful. Rollback to dynamodb successfully.'
    }