import os

import boto3
import json
import time


def lambda_handler(event, context):
    stepfunctions = boto3.client('stepfunctions', region_name='eu-central-1')

    print(event)
    input_data = event

    # Start the execution of the state machine
    response = stepfunctions.start_execution(
        stateMachineArn=os.environ["StateMachine"],
        name=f"UploadExecution_{int(time.time())}",
        input=json.dumps(input_data)
    )
    print(response)
    execution_arn = response['executionArn']
    print(f"Step Functions execution started: {execution_arn}")

    response['startDate'] = response['startDate'].isoformat()
    return response
