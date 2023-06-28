import json
import os

import boto3

sns = boto3.client('sns')


def lambda_handler(event, context):
    file_path = event['queryStringParameters']['file_path']

    s3 = boto3.resource('s3')

    bucket_name = os.environ["BucketName"]
    try:
        bucket = s3.Bucket(bucket_name)

        for obj in bucket.objects.filter(Prefix=file_path):
            if obj.key == file_path:
                print('File path found:', obj.key)
                break
            else:
                return {
                    'statusCode': 404,
                    'body': f'File "{file_path}" could not be found.'
                }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error finding file: {str(e)}'
        }

    try:
        topic_arn = os.environ["TopicName"]

        response = sns.publish(
            TopicArn=topic_arn,
            Message=json.dumps({"default": json.dumps({
                'file_path': file_path
            })}),
            MessageStructure='json'
        )

        print('Message published to SNS topic')
        return {
            'statusCode': 204,
            'body': json.dumps(response)
        }
    except Exception as e:
        print('Failed to publish message to SNS topic')
        return {'status': 'error', 'message': str(e)}
