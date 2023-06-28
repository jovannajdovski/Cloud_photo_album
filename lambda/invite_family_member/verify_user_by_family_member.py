import json
import boto3

def lambda_handler(event, context):
    
    print(event)
    input_data = event
    
    email = input_data['email']
    username = input_data['username']
    
    dynamodb_client = boto3.client('dynamodb')
    table_name = 'family-member-invitation'
    
    
    try:
        response = dynamodb_client.get_item(
            TableName=table_name,
            Key={
                'id': {'S': email}
            },
            ConsistentRead=True
        )
        
        if 'Item' not in response:
            return {
                'statusCode': 400,
                'body': 'Invalid family member invitation'
            }
        
        verified=response['Item'].get('verified', {}).get('BOOL')
        
        if not verified:
            cognito_client = boto3.client('cognito-idp')
            user_pool_id = 'eu-central-1_IHn69bILn'
            
            cognito_client.admin_delete_user(
                UserPoolId=user_pool_id,
                Username=username
            )
            
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table(table_name)
        table.delete_item(Key={
            'id': email
        })
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': 'Error accessing DynamoDB: ' + str(e)
        }
    
    

