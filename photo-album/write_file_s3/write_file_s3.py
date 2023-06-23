import json
import os
import boto3
import base64

def lambda_handler(event, context):
    print(event)
    message = json.loads(event['Records'][0]['Sns']['Message'])
    print("From SNS: "+str(message))

    s3_client = boto3.client('s3')
    
    content_type=message['type']
    data = base64.b64decode(message['data'])
    name = message['name']
    bucket_name = os.environ['BucketName']

    response = s3_client.list_objects(Bucket=bucket_name)
    for obj in response.get('Contents', []):
        if obj['Key'] == name:
            return {
            'statusCode': 400,
            'body': json.dumps('The destination already contains file with same name')
            }

    s3_client.put_object(Bucket=bucket_name, Key=name+"."+content_type, Body=data)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Object is uploaded successfully')
    }
