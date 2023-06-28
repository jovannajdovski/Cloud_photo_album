import json
import os
import traceback

import boto3

sns = boto3.client('sns')


def lambda_handler(event, context):
    data = json.loads(event["body"])
    try:
        s3 = boto3.client('s3')
        bucket_name = os.environ["BucketName"]
        response = s3.list_objects_v2(
            Bucket=bucket_name,
            Prefix=data['name']
        )

        for obj in response.get('Contents', []):

            if obj['Key'] == data['name'] + "." + data['type']:
                return {
                    'statusCode': 400,
                    'body': json.dumps('The destination already contains file with same name')
                }

        topic_arn = os.environ["TopicName"]

        response = sns.publish(
            TopicArn=topic_arn,
            Message=json.dumps({"default": json.dumps({
                'name': data['name'],
                'type': data['type'],
                'size': data['size'],
                'createTime': data['createTime'],
                'editTime': data['editTime'],
                'description': data['description'],
                'tag': data['tag'],
                'data': data['data']
            })}),
            MessageStructure='json'
        )

        print('Message published to SNS topic')
        return {
            'statusCode': 200,
            'body': json.dumps(response)
        }
    except Exception as e:
        traceback.print_exc()
        print('Failed to publish message to SNS topic')
        return {'status': 'error', 'message': str(e)}


