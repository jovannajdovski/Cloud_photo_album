import json
import os

import boto3


def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table_name = os.environ['TableName']
    prefix = os.environ["BucketName"] + '/' + event['queryStringParameters']['prefix']
    try:
        table = dynamodb.Table(table_name)

        items = table.scan()['Items']
        occurrencesPrefix = prefix.count('/')
        files = []
        for item in items:
            file_path = item['id']
            if file_path.startswith(prefix) and file_path.count('/') == occurrencesPrefix:
                date = item['editTime']
                parts = file_path.split('/')
                file_name = parts[-1]
                files.append({"name": file_name, "updated": date})

        sorted_files = sorted(files, key=lambda x: str(x["updated"]))
        for file in sorted_files:
            file["updated"] = str(file["updated"])
        print(sorted_files)
        return {
            'statusCode': 200,
            'body': json.dumps(sorted_files)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error retrieving files: {str(e)}'
        }
