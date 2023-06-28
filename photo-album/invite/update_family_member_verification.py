import json
import os

import boto3


def lambda_handler(event, context):
    print(event)
    invite_id = event["queryStringParameters"]['invite_id']
    username = event["queryStringParameters"]['invited_username']
    inviter = event["queryStringParameters"]['sender']
    print(inviter)
    print(username)
    dynamodb = boto3.client('dynamodb')

    table_name = os.environ['FamilyTableName']
    print(table_name)

    try:
        response = dynamodb.scan(
            TableName=table_name,
            FilterExpression='#id = :val',
            ExpressionAttributeNames={'#id': 'inviteId'},
            ExpressionAttributeValues={':val': {'S': invite_id}}
        )

        items = response.get('Items')
        if items:
            for item in items:
                dynamodb.update_item(
                    TableName=table_name,
                    Key={'id': item['id']},
                    UpdateExpression='SET #v = :val',
                    ExpressionAttributeNames={'#v': 'verified'},
                    ExpressionAttributeValues={':val': {'BOOL': True}}
                )

        else:
            return {
                'statusCode': 404,
                'body': 'No invite found with this invite id'
            }

        ########################################################################

        cognito_client = boto3.client('cognito-idp')
        user_pool_id = os.environ["UserPoolId"]
        print(user_pool_id)
        cognito_client.admin_enable_user(
            UserPoolId=user_pool_id,
            Username=username
        )

        ########################################################################

        s3 = boto3.client('s3')
        dynamodb = boto3.resource('dynamodb')

        bucket_name = os.environ["BucketName"]
        print(bucket_name)
        prefix = inviter + "/"

        response = s3.list_objects_v2(
            Bucket=bucket_name,
            Prefix=prefix,
            Delimiter='/'
        )

        content = []

        for obj in response.get('CommonPrefixes', []):
            if obj.get('Prefix'):
                content.append(obj['Prefix'])

        for obj in response.get('Contents', []):
            if obj.get('Key'):
                content.append(obj['Key'])

        table_name = os.environ["SharingTableName"]
        print(table_name)
        table = dynamodb.Table(table_name)

        item = {
            'id': username,
            'shared_content': content
        }
        print(content)
        response = table.put_item(Item=item)

        return {
            'statusCode': 200,
            'body': json.dumps('Family member verified')
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': 'Error updating verification: {}'.format(str(e))
        }
