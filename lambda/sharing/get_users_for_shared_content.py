import json
import boto3

def lambda_handler(event, context):
    dynamodb_client = boto3.resource('dynamodb')
    table = dynamodb_client.Table('sharing')
    
    search_content = event['content']
    
    try:
        response = table.scan()
    
        items = response['Items']
        users = []
        
        for item in items:
            shared_content = item.get('shared_content', [])
            
            if search_content in shared_content:
                user = item['id']
                users.append(user)
        
        return {
            'statusCode': 200,
            'body': users
        }
        
    except Exception as e:
        print('Failed to find users for sharing content')
        return {'status': 'error', 'message': str(e)}


