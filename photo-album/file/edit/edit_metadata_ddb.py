import json
import os
import re
import boto3
from datetime import datetime


def lambda_handler(event, context):
    messages = event['Records']
    sqs = boto3.client('sqs')
    dynamodb_client = boto3.resource('dynamodb')
    table = dynamodb_client.Table(os.environ["TableName"])

    for message in messages:

        print("LOGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")
        print(message)

        body = json.loads(json.loads(message['body'])['Message'])

        print(body)
        print("LOGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")
        # Delete the processed message from the queue
        receipt_handle = message['receiptHandle']
        # queue_url = message['eventSourceARN']
        event_source_arn = message['eventSourceARN']

        bucket_name = os.environ["BucketName"]

        file_path = body['file_path']
        item_id = bucket_name + "/" + file_path

        new_name = body['name']
        new_tag = body['tag']
        new_description = body['description']

        lastDotIndex = file_path.rfind('.')
        file_type = file_path[lastDotIndex:]
        lastSlashIndex = file_path.rfind('/')

        new_id = bucket_name + '/' + file_path[:lastSlashIndex] + '/' + new_name + file_type
        print("dosao do try ", new_id, item_id)
        try:
            response = table.get_item(Key={'id': item_id})
            print(response)
            item = response.get('Item')
            if item:
                item['id'] = new_id
                item['name'] = new_name
                item['tag'] = new_tag
                item['description'] = new_description
                item['editTime'] = int(datetime.now().timestamp())

                print(item_id)
                table.delete_item(Key={'id': item_id})
                print(item)

                response = table.put_item(
                    Item=item
                )
                print('zavrsio edit')
                sqs.delete_message(
                    QueueUrl="https://sqs.eu-central-1.amazonaws.com/205030087586/edit-ddb-queue",
                    ReceiptHandle=receipt_handle
                )
            else:
                return {
                    'statusCode': 404,
                    'body': f'File not found: {str(e)}'
                }
        except Exception as e:
            return {
                'statusCode': 500,
                'body': f'Error modifying file: {str(e)}'
            }
    return {
        'statusCode': 200,
        'body': f'File "{file_path}" is modified successfully.'
    }