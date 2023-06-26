import json
import os
import traceback

import boto3


def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket_name = os.environ["BucketName"]

    print({'event': event, 'context': context})

    prefix = event['queryStringParameters']['prefix']
    print(prefix)
    try:
        response = s3.list_objects_v2(
            Bucket=bucket_name,
            Prefix=prefix
        )
        file_paths = []
        prefix_length = len(prefix)
        for obj in response.get('Contents', []):
            if obj.get('Key') and obj['Key'][prefix_length:] and '/' not in obj['Key'][prefix_length:]:
                file_paths.append(obj['Key'][prefix_length:])
        files = []
        print(file_paths)
        for file_path in file_paths:
            parts = file_path.split('/')
            file_name = parts[-1]
            files.append(file_name)

        return {
            'statusCode': 200,
            'body': json.dumps(files)
        }
    except Exception as e:
        traceback.print_exc()
        return {
            'statusCode': 500,
            'body': f'Greška prilikom dobavljanja fajlova: {str(e)}'
        }
