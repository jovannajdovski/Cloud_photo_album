import json
import base64
import boto3

aws_access_key = 'AKIAS7PF63ORNZERZRMN'
aws_secret_access_key = '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'

session = boto3.Session(
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_access_key
)


def upload_content(event, context):
    s3_client = session.client('s3')
    dynamodb_client = session.client('dynamodb')

    content_type=event['type']
    data = base64.b64decode(event['content'])
    name = event['name']
    bucket_name=event['bucket']

    response = s3_client.list_objects(Bucket=bucket_name)
    for obj in response.get('Contents', []):
        if obj['Key'] == name:
            return {
            'statusCode': 400,
            'body': json.dumps('The destination already contains file with same name')
            }

    s3_client.put_object(Bucket=bucket_name, Key=name+content_type, Body=data)

    item = {
        'id': {'S': bucket_name+"/"+name+content_type},
        'name': {'S': name},
        'type': {'S': content_type},
        'size': {'N': event['size']},
        'created':{'N':event['created']},
        'modified':{'N':event['modified']},
        'additional':{'M', event['additional']}
    }

    response = dynamodb_client.put_item(
        TableName='content',
        Item=item
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps('Object is uploaded successfully')
    }


#     uploaded_file = event['file']
    
#     file_extension = os.path.splitext(uploaded_file['filename'])[1]
    
#     if file_extension not in ['.jpg', '.txt', '.docx']:
#         raise ValueError('Invalid file type')
    
#     s3 = boto3.client('s3')
#     s3.upload_file(uploaded_file['path'], 'my-bucket', f"{uploaded_file['filename']}.{file_extension}")
    