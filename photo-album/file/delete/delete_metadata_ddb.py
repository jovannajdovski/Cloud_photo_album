import json
import os

import boto3
import time


def lambda_handler(event, context):
    print(event)
    message = json.loads(event['Records'][0]['Sns']['Message'])
    print("From SNS: " + str(message))

    dynamodb_client = boto3.resource('dynamodb')

    file_path = message['file_path']
    bucket_name = os.environ["BucketName"]
    print(file_path)
    prefix = bucket_name + '/' + file_path

    try:
        table = dynamodb_client.Table(os.environ["TableName"])

        response = table.scan(FilterExpression=boto3.dynamodb.conditions.Key('id').begins_with(prefix))
        print(prefix)
        print(response)
        items = response['Items']
        for item in items:
            table.delete_item(Key={'id': item['id']})
        print(items)
        return {
            'statusCode': 200,
            'body': 'File metadata deleted successfully',
            'content': items
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error deleting file metadata: {str(e)}'
        }
