import json
import boto3

def lambda_handler(event, context):
    dynamodb_client = boto3.resource('dynamodb')
    table = dynamodb_client.Table('sharing')
    
    user = event['user']
    
    try:
        response = table.get_item(Key={'id': user})
    
        if 'Item' in response:
            item = response['Item']
            shared_content = item.get('shared_content', [])
            if shared_content == []:
                return {
                    'statusCode': 404,
                    'body': 'No shared content with user'
                }
            return {
                'statusCode': 200,
                'body': shared_content
            }
        else:
            return {
                'statusCode': 404,
                'body': 'No shared content with user'
            }
        
    except Exception as e:
        print('Failed to find users for sharing content')
        return {'status': 'error', 'message': str(e)}


