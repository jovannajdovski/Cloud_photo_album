import json
import os

import boto3

def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket_name = os.environ["BucketName"]
    
    print({'event':event, 'context':context})
    
    prefix = event['prefix']

    try:
        response = s3.list_objects_v2(
            Bucket=bucket_name,
            Prefix=prefix,
            Delimiter='/'
        )

        folders = []

        for obj in response.get('CommonPrefixes', []):
            if obj.get('Prefix'):
                folders.append(obj['Prefix'])

        folder_names = []
        
        for folder_path in folders:
            folder_path = folder_path.rstrip('/')
            parts = folder_path.split('/')
            folder_name = parts[-1]
            folder_names.append(folder_name)
            
        return {
            'statusCode': 200,
            'body': folder_names
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Greška prilikom dobavljanja podfoldera: {str(e)}'
        }

