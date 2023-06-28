import base64
import json
import os

import boto3


def lambda_handler(event, context):
    print(event)
    key = event['queryStringParameters']['key']
    bucket_name = os.environ["BucketName"]
    print(key)
    s3_client = boto3.client('s3')
    response = s3_client.get_object(Bucket=bucket_name, Key=key)

    # data = response['Body'].read().decode('utf-8')

    '''return {
        'statusCode': 200,
        'body': json.dumps(data)
    }'''
    print(response)
    data = response['Body'].read()

    encoded_data = base64.b64encode(data).decode('ascii')

    return {
        'statusCode': 200,
        'body': json.dumps({'body': encoded_data})
    }