import json

def lambda_handler(event, context):
    file_path = json.loads(event['Sns']['Message'])['name']
    index=file_path.index("/")
    user=file_path[:index]
    return {
        'statusCode': 200,
        'user': user,
        'content': 'Uploading was successful.'
    }
