import json
import boto3

def lambda_handler(event, context):
    print(event)
    data = event
    
    s3_client = boto3.client('s3')
    user= data['user']
    new_album= data['new_album']
    
    bucket_name = 'slicke'
    folder_prefix = user
    # folder_prefix = user+'/'
    album_prefix = folder_prefix+new_album+"/"
    
    try:
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=folder_prefix, Delimiter='/')
        subfolders = [f['Prefix'] for f in response.get('CommonPrefixes', [])]
        print(subfolders)
        for folder in subfolders:
            
            if folder == album_prefix:
                return {
                'statusCode': 400,
                'body': json.dumps('The user already contains album with same name')
                }
    
        s3_client.put_object(Bucket=bucket_name, Key=album_prefix)
        
        return {
            'statusCode': 200,
            'body': json.dumps('Album is created successfully')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error creating album: {str(e)}')
        }

