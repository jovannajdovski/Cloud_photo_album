import json
import boto3
import os

def lambda_handler(event, context):
    print(event)
    message = json.loads(event['Records'][0]['Sns']['Message'])
    print("From SNS: "+str(message))

    dynamodb_client = boto3.resource('dynamodb')
    #table name
    table = dynamodb_client.Table(os.environ['TableName'])
    
    content_type=message['type']
    name = message['name']
    bucket_name = os.environ['BucketName']
    print(name)

    item = {
        'id': bucket_name+"/"+name+"."+content_type,
        'name': str(name),
        'type': str(content_type),
        'size': int(message['size']),
        'createTime': str(message['createTime']),
        'editTime':str(message['editTime']),
        'description': str(message['description']),
        'tag': str(message['tag']),
    }

    response = table.put_item(
        Item=item
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps('Object is uploaded successfully')
    }
