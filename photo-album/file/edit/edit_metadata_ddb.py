import json
import os

import boto3
from datetime import datetime


def lambda_handler(event, context):
    print(event)
    message = json.loads(event['Records'][0]['Sns']['Message'])
    print("From SNS: " + str(message))

    dynamodb_client = boto3.resource('dynamodb')
    table = dynamodb_client.Table(os.environ["TableName"])
    print(table)
    bucket_name = os.environ["BucketName"]
    print(bucket_name)
    file_path = message['file_path']
    item_id = bucket_name + "/" + file_path

    new_name = message['name']
    new_tag = message['tag']
    new_description = message['description']

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
            '''print('new item ',item)
            table.update_item(
                Key={'id': item_id},
                UpdateExpression='SET id = :new_id, #nm = :new_name, tag = :new_tag, description = :new_description, editTime = :new_edit_time',
                ExpressionAttributeValues={
                    ':new_id': item['id'],
                    ':new_name': item['name'],
                    ':new_tag': item['tag'],
                    ':new_description': item['description'],
                    ':new_edit_time': item['editTime']
                },
                ExpressionAttributeNames={
                    '#nm': 'name'
                }
            )'''
            print(item_id)
            table.delete_item(Key={'id': item_id})
            print(item)

            response = table.put_item(
                Item=item
            )
            print('zavrsio edit')
            return {
                'statusCode': 200,
                'body': f'File "{file_path}" is modified successfully.'
            }
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