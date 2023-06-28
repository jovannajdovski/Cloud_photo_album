import json
import os

import boto3

client = boto3.client('ses', region_name='eu-central-1')


def lambda_handler(event, context):
    print(event)
    input_data = event

    sender = input_data['family_member_username']
    sender_email = input_data['family_member_email']
    invited_user_email = input_data['email']
    invited_username = input_data['username']
    invite_id = input_data['inviteId']

    verifyLink = os.environ["Link"] + '/invite/verify?inviteId=' + invite_id + '&inviter=' + sender + '&username=' + invited_username

    message_body = '<html><body><p>Hello ' + sender + ',</p><p>Confirm that you invite family member ' + invited_user_email + ' to our application. All your data and content will be shared with him! Please click the link below to verify your family member: </p> <p> <a href="' + verifyLink + '">Click here</a> for verification</p></body></html>'

    try:

        response = client.send_email(
            Destination={
                'ToAddresses': [sender_email]
            },
            Message={'Body': {'Html': {'Data': message_body}},
                     'Subject': {
                         'Charset': 'UTF-8',
                         'Data': 'Verify your family member',
                     },
                     },
            Source='nikolasavic0901@gmail.com'
        )

        print(response)

        return event
    except Exception as e:
        print(f"Error while sending requests for verification: {str(e)}")
        return {
            'statusCode': 400,
            'body': json.dumps(f"Error while sending requests for verification: {str(e)}")
        }
