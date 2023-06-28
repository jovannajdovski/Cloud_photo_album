import json
import os

import boto3
import base64
import time


def lambda_handler(event, context):
    print(event)
    message = json.loads(event['Records'][0]['Sns']['Message'])
    print("From SNS: " + str(message))
    try:
        s3_client = boto3.client('s3')

        content_type = message['type']
        data = base64.b64decode(message['data'])
        name = message['name']
        bucket_name = os.environ["BucketName"]

        s3_client.put_object(Bucket=bucket_name, Key=name + "." + content_type, Body=data)

        return {
            'statusCode': 200,
            'body': json.dumps('Object is uploaded successfully'),
            'file_path': name + '.' + content_type,
            'bucket_name': bucket_name

        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error uploading file: {str(e)}'
        }