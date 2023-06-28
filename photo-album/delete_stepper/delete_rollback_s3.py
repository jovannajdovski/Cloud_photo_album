import json
import boto3
import base64


def lambda_handler(event, context):
    print(event)
    message1 = json.loads(event)
    message = message1[0]
    s3_client = boto3.client('s3')

    data = base64.b64decode(message['Data'])
    key = message['Key']
    bucket_name = message['Bucket']
    index = key.index("/")
    user = key[:index]
    s3_client.put_object(Bucket=bucket_name, Key=key, Body=data)
    return {
        'statusCode': 200,
        'user': user,
        'content': 'Deletion was not successful. Rollback to s3 successfully'
    }