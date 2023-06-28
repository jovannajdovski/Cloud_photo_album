import json
import os

import boto3

def lambda_handler(event, context):
    
    dynamodb_client = boto3.resource('dynamodb')
    table = dynamodb_client.Table(os.environ["TableName"])
    print(event)

    data = json.loads(event["body"])
    print(data)
    item_id = data['user']
    new_sharing_content = data['new_sharing_content']

    try:
        response = table.get_item(Key={'id': item_id})
        
        if 'Item' in response:
            existing_item = response['Item']
            shared_content = existing_item.get('shared_content', [])
            
            if new_sharing_content not in shared_content:
                shared_content.append(new_sharing_content)
            else:
                return {
                    'statusCode': 400,
                    'body': json.dumps('Content is already being shared')
                }
            
            table.update_item(
                Key={'id': item_id},
                UpdateExpression='SET #content = :content',
                ExpressionAttributeNames={'#content': 'shared_content'},
                ExpressionAttributeValues={':content': shared_content}
            )
        else:
            table.put_item(
                Item={
                    'id': item_id,
                    'shared_content': [new_sharing_content]
                }
            )
        return {
            'statusCode': 200,
            'body': json.dumps('Shared content successfully added')
        }
        
    except Exception as e:
        print('Failed to add sharing content')
        return {'status': 'error', 'message': str(e)}

