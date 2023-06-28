import json
import os

import boto3

sns = boto3.client('sns')


def lambda_handler(event, context):
    print(event)
    message = json.loads(event['Records'][0]['Sns']['Message'])

    print("From SNS: " + str(message))

    file_path = message['file_path']
    name = message['name']

    s3 = boto3.resource('s3')

    bucket_name = os.environ["BucketName"]

    try:
        bucket = s3.Bucket(bucket_name)
        objects = bucket.objects.filter(Prefix=file_path)
        for obj in objects:
            lastDotIndex = file_path.rfind('.')
            file_type = file_path[lastDotIndex:]

            lastSlashIndex = file_path.rfind('/')
            old_name = file_path[lastSlashIndex + 1:lastDotIndex]
            if (old_name != name):
                new_key = file_path[:lastSlashIndex] + '/' + name + file_type
                bucket.copy({'Bucket': bucket_name, 'Key': obj.key}, new_key)
                obj.delete()
                print(f"File {obj.key} modified successfully.")

        return {
            'statusCode': 200,
            'body': f'File "{file_path}" is modified successfully.'
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error modifying file: {str(e)}'
        }
