import json
import boto3

def lambda_handler(event, context):
    
    print(event)
    message = json.loads(event['Records'][0]['Sns']['Message'])
    print("From SNS: "+str(message))
    
    user=message['user']
    album_to_delete = message['album_to_delete']
    
    s3 = boto3.resource('s3')
    
    bucket_name = 'slicke'

    folder_prefix = user+'/'+album_to_delete+'/'

    try:
        bucket = s3.Bucket(bucket_name)
        
        # objects_to_delete = []
        
        # for obj in bucket.objects.filter(Prefix=folder_prefix):
        #     objects_to_delete.append({'Key': obj.key})
        
        # print(objects_to_delete)

        # if len(objects_to_delete) > 0:
        #     bucket.delete_objects(Delete={'Objects': objects_to_delete})

        bucket.objects.filter(Prefix=folder_prefix).delete()

        return {
            'statusCode': 200,
            'body': f'Album "{folder_prefix}" is deleted successfully.'
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error deleting album: {str(e)}'
        }

