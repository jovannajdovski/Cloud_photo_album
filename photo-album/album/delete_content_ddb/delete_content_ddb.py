import json
import os

import boto3

def lambda_handler(event, context):
    print(event)
    message = json.loads(event['Records'][0]['Sns']['Message'])
    print("From SNS: "+str(message))

    dynamodb_client = boto3.resource('dynamodb')
    
    user=message['user']
    print(user)
    album_to_delete = message['album_to_delete']
    bucket_name = os.environ["BucketName"]
    print(bucket_name)
    prefix = bucket_name+'/'+ user+'/'+album_to_delete+'/'

    try:
        table = dynamodb_client.Table(os.environ["TableName"])
        response = table.scan(
            FilterExpression=boto3.dynamodb.conditions.Key('id').begins_with(prefix)
        )

        items = response['Items']
        while 'LastEvaluatedKey' in response:
            response = table.scan(
                FilterExpression=boto3.dynamodb.conditions.Key('id').begins_with(prefix),
                ExclusiveStartKey=response['LastEvaluatedKey']
            )
            items.extend(response['Items'])

        print(items)
        with table.batch_writer() as batch:
            for item in items:
                batch.delete_item(Key={'id': item['id']})

        return {
            'statusCode': 200,
            'body': 'Album content metadata deleted successfully'
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error deleting album content metadata: {str(e)}'
        }

