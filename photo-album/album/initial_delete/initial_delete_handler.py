import json
import os

import boto3

sns = boto3.client('sns')

def lambda_handler(event, context):

    # query_params = event['queryStringParameters']
    print(event)
    user = event['queryStringParameters']['user']
    album_to_delete = event['queryStringParameters']['album_to_delete']
    
    s3 = boto3.resource('s3')
    
    bucket_name = os.environ["BucketName"]

    folder_prefix = user+'/'+album_to_delete+'/'

    print(bucket_name)
    print(user)
    print(album_to_delete)

    try:
        bucket = s3.Bucket(bucket_name)
        
        objects_to_delete = []
        
        for obj in bucket.objects.filter(Prefix=folder_prefix):
            objects_to_delete.append({'Key': obj.key})
            

        if len(objects_to_delete) == 0:
            return {
                'statusCode': 404,
                'body': f'Album "{folder_prefix}" could not be found.'
            }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error finding album: {str(e)}'
        }
    
    try:
        topic_arn = os.environ['TopicName']
        print(topic_arn)
        response = sns.publish(
            TopicArn=topic_arn,
            Message = json.dumps({"default": json.dumps({
                'user': user,
                'album_to_delete':album_to_delete
            })}),
            MessageStructure = 'json'
        )
        
        print('Message published to SNS topic')
        return {
            'statusCode': 204,
            'body': json.dumps(response)
        }
    except Exception as e:
        print('Failed to publish message to SNS topic')
        return {'status': 'error', 'message': str(e)}

