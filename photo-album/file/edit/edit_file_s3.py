import json
import os

import boto3

sns = boto3.client('sns')


def lambda_handler(event, context):
    messages = event['Records']
    s3 = boto3.resource('s3')
    sqs = boto3.client('sqs')
    bucket_name = os.environ["BucketName"]
    bucket = s3.Bucket(bucket_name)

    for message in messages:
        # Process the received message
        body = json.loads(json.loads(message['body'])['Message'])

        print(body)
        print("LOGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")
        # Delete the processed message from the queue
        receipt_handle = message['receiptHandle']
        # queue_url = message['eventSourceARN']
        event_source_arn = message['eventSourceARN']

        file_path = body['file_path']
        name = body['name']

        try:
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
            sqs.delete_message(
                QueueUrl="https://sqs.eu-central-1.amazonaws.com/205030087586/edit-s3-queue",
                ReceiptHandle=receipt_handle
            )
        except Exception as e:
            return {
                'statusCode': 500,
                'body': f'Error modifying file: {str(e)}'
            }
    return {
        'statusCode': 200,
        'body': f'File "{file_path}" is modified successfully.'
    }
