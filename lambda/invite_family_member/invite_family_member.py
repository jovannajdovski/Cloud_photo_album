import json
import boto3
import uuid

client = boto3.client('ses', region_name='eu-central-1')

def lambda_handler(event, context):
    print(event)
    sender = event['sender']
    invited_user = event['invited_user']
    
    message_body = '<html><body><p>Hello,</p><p> '+sender+' invite you as family member to our application. We are thrilled to invite you to our application! Please click the link below to register: </p> <p> <a href="http://localhost:4200/family-member-invitation">Click here</a> for registration</p></body></html>'
    
    try:
        response = client.send_email(
            Destination={
                'ToAddresses': [invited_user]
            },
            Message={'Body': {'Html': {'Data': message_body}},
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': 'Family member invitation',
                },
            },
            Source='jnizvodno@gmail.com'
            )
        
        print(response)
        
        
        dynamodb_client = boto3.resource('dynamodb')
        table = dynamodb_client.Table('family-member-invitation')
        
        inviteId = str(uuid.uuid1())
        
        item = {
            'id': invited_user,
            'sender': sender,
            'verified': False,
            'inviteId': inviteId
        }
    
        responsedb = table.put_item(
            Item=item
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps("Email Sent Successfully. MessageId is: " + response['MessageId'])
        }
    except Exception as e:
        print(f"Error while sending requests for verification: {str(e)}")
        return {
            'statusCode': 400,
            'body': json.dumps(f"Error while sending requests for verification: {str(e)}")
        }
