import json
import os
import time
import boto3
import base64

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
        objects = list(bucket.objects.filter(Prefix=file_path))

        serialized_items = []
        print(objects)
        for obj in objects:
            print(obj)
            obj_info = s3.Object(bucket_name, obj.key).get()
            print(obj_info)
            item_data = obj_info['Body'].read()
            serialized_item = {
                'Bucket': obj.bucket_name,
                'Key': obj.key,
                'Data': base64.b64encode(item_data).decode('utf-8')
            }
            serialized_items.append(serialized_item)

        bucket.objects.filter(Prefix=file_path).delete()
        print(serialized_items)
        return {
            'statusCode': 200,
            'body': f'File "{file_path}" is deleted successfully.',
            'content': json.dumps(serialized_items)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error deleting file: {str(e)}'
        }
