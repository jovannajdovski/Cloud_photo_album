import json
import os

import boto3

sns = boto3.client('sns')


def lambda_handler(event, context):
    print(event)
    message = json.loads(event['Records'][0]['Sns']['Message'])
    print("From SNS: " + str(message))

    file_path = message['file_path']

    s3 = boto3.resource('s3')

    bucket_name = os.environ["BucketName"]

    try:
        bucket = s3.Bucket(bucket_name)
        bucket.objects.filter(Prefix=file_path).delete()

        return {
            'statusCode': 200,
            'body': f'File "{file_path}" is deleted successfully.'
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error deleting file: {str(e)}'
        }
