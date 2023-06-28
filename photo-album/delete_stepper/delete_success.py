import json

def lambda_handler(event, context):
    file_path = json.loads(event['Records'][0]['Sns']['Message'])['file_path']
    index=file_path.index("/")
    user=file_path[:index]
    return {
        'statusCode': 200,
        'user': user,
        'content': 'Deletion was successful.'
    }