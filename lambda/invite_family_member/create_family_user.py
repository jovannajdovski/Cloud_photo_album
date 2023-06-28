import json
import boto3

def lambda_handler(event, context):
    cognito_client = boto3.client('cognito-idp')
    
    user_pool_id = 'eu-central-1_IHn69bILn'
    
    input_data = event['input_data']
    
    email = input_data['email']
    username = input_data['username']
    password = input_data['password']
    given_name = input_data['given_name']
    family_name = input_data['family_name']
    birth_date = input_data['birth_date']
    family_member_username = input_data['family_member_username']
    inviteId = input_data['inviteId']
    family_member_email = input_data['family_member_email']
    
    
    user_attributes = [
        {
            'Name': 'email',
            'Value': email
        },
        {
            'Name': 'given_name',
            'Value': given_name
        },
        {
            'Name': 'family_name',
            'Value': family_name
        },
        {
            'Name': 'birthdate',
            'Value': birth_date
        },
        {
            'Name': 'email_verified',
            'Value': 'true'
        }
    ]
    
    response = cognito_client.admin_create_user(
        UserPoolId=user_pool_id,
        Username=username,
        TemporaryPassword=password,
        UserAttributes=user_attributes,
        MessageAction='SUPPRESS', 
        DesiredDeliveryMediums=['EMAIL'], 
        ForceAliasCreation=True
    )
    
    cognito_client.admin_set_user_password(
        UserPoolId=user_pool_id,
        Username=username,
        Password=password,
        Permanent=True
    )
    
    cognito_client.admin_disable_user(
        UserPoolId=user_pool_id,
        Username=username
    )
    
    return {
      "email": email,
      "username": username,
      "password": password,
      "given_name": given_name,
      "family_name": family_name,
      "birth_date": birth_date,
      "family_member_username": family_member_username,
      "family_member_email": family_member_email,
      "inviteId": inviteId,
    }
    
    # return {
    #     'statusCode': 200,
    #     'body': json.dumps('Hello from Lambda!')
    # }

