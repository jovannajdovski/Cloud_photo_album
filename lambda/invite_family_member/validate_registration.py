import json
import boto3
import uuid
import re
from datetime import datetime

def lambda_handler(event, context):
    
    cognito_client = boto3.client('cognito-idp')
    
    user_pool_id = 'eu-central-1_IHn69bILn'
    
    email = event['email']
    username = event['username']
    password = event['password']
    given_name = event['given_name']
    family_name = event['family_name']
    birth_date = event['birth_date']
    family_member_username = event['family_member_username']
    
    if not (email and username and password and given_name and family_name and birth_date and family_member_username):
        return {
            'statusCode': 400,
            'body': 'Missing required attributes'
        }
    
    # Validate birth_date
    try:
        birth_date_dt = datetime.strptime(birth_date, '%Y-%m-%d')
        if birth_date_dt >= datetime.today():
            return {
                'statusCode': 400,
                'body': 'Invalid birth date'
            }
    except ValueError:
        return {
            'statusCode': 400,
            'body': 'Invalid date format for birth date'
        }
    
    # Validate email using regular expression
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not re.match(email_regex, email):
        return {
            'statusCode': 400,
            'body': 'Invalid email format'
        }
    
    # Check if username is already taken
    try:
        response = cognito_client.admin_get_user(
            UserPoolId=user_pool_id,
            Username=username
        )
        return {
            'statusCode': 400,
            'body': 'Username is already taken'
        }
    except cognito_client.exceptions.UserNotFoundException:
        pass
    
    # Check if family_member_username exists in user pool
    try:
        response = cognito_client.admin_get_user(
            UserPoolId=user_pool_id,
            Username=family_member_username
        )
    except cognito_client.exceptions.UserNotFoundException:
        return {
            'statusCode': 400,
            'body': 'Invalid family member username'
        }
    family_member_email = None    
    for attribute in response['UserAttributes']:
        if attribute['Name'] == 'email':
            family_member_email = attribute['Value']
            break
        
    ###########################################################################
        
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
        
        if 'Item' not in response or response['Item'].get('sender', {}).get('S') != family_member_username:
            return {
                'statusCode': 400,
                'body': 'Invalid family member invitation'
            }
        
    except dynamodb_client.exceptions.DynamoDBException as e:
        return {
            'statusCode': 500,
            'body': 'Error accessing DynamoDB: ' + str(e)
        }
    
    inviteId=response['Item'].get('inviteId', {}).get('S')
    
    ############################################################################
    
    stepfunctions = boto3.client('stepfunctions')
    
    input_data = {
      "email": email,
      "username": username,
      "password": password,
      "given_name": given_name,
      "family_name": family_name,
      "birth_date": birth_date,
      "family_member_username": family_member_username,
      "family_member_email": family_member_email,
      "inviteId": inviteId,
      "input_key": "$.input_data"
    }
    
    funcId = str(uuid.uuid1())
    
    try:
        response = stepfunctions.start_execution(
            stateMachineArn='arn:aws:states:eu-central-1:205030087586:stateMachine:test',
            name=funcId,
            input=json.dumps(input_data)
        )
        
        # execution_arn = response['executionArn']
        
        return {
            'statusCode': 200,
            'body': json.dumps("Successfully registered, wait for family member verification")
        }
    except Exception as e:
        print(f"Error while sending requests for verification: {str(e)}")
        return {
            'statusCode': 400,
            'body': json.dumps(f"Error while sending requests for verification: {str(e)}")
        }

