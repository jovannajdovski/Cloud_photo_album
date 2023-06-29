import json
import boto3
import base64


def lambda_handler(event, context):
    print(event)
    file_path = event['file_path']
    bucket_name = event['bucket_name']
    print(file_path)
    s3 = boto3.resource('s3')

    bucket = s3.Bucket(bucket_name)
    bucket.objects.filter(Prefix=file_path).delete()

    index = file_path.index("/")
    user = file_path[:index]
    return {
        'statusCode': 200,
        'user': user,
        'content': 'Uploading was not successful. Rollback to s3 successfully'
    }