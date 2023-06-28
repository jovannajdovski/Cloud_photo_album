import json
import os

import boto3

def lambda_handler(event, context):
    dynamodb_client = boto3.resource('dynamodb')
    table = dynamodb_client.Table(os.environ["TableName"])
    print(event)
    item_id = event['queryStringParameters']['user']
    shared_content_to_remove = event['queryStringParameters']['shared_content_to_remove']
    print(shared_content_to_remove)
    print(item_id)

    try:
        response = table.get_item(Key={'id': item_id})
        
        if 'Item' in response:
            existing_item = response['Item']
            shared_content = existing_item.get('shared_content', [])
            
            if shared_content_to_remove not in shared_content:
                return {
                    'statusCode': 404,
                    'body': json.dumps('This user does not have this shared content')
                }
            else:
                shared_content.remove(shared_content_to_remove)
            
            table.update_item(
                Key={'id': item_id},
                UpdateExpression='SET #content = :content',
                ExpressionAttributeNames={'#content': 'shared_content'},
                ExpressionAttributeValues={':content': shared_content}
            )
        else:
            return {
                    'statusCode': 404,
                    'body': json.dumps('This user does not have this shared content')
            }
        return {
            'statusCode': 204,
            'body': json.dumps('Shared content successfully removed')
        }
        
    except Exception as e:
        print('Failed to remove sharing content')
        return {'status': 'error', 'message': str(e)}

