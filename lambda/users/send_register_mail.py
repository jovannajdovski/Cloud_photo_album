import json
import boto3

# function sends an email after confirming signup to accept the email sending policy
# triggered on post confirm signup in user pool 

def lambda_handler(event, context):
    ses_client = boto3.client('ses')

    print(event)
    if event['triggerSource'] == 'PostConfirmation_ConfirmSignUp':
        email_address = event['request']['userAttributes']['email']

        try:
            response = ses_client.verify_email_identity(
                EmailAddress=email_address
            )

            if response['ResponseMetadata']['HTTPStatusCode'] == 200:
                print(f"Zahtev za verifikaciju adrese {email_address} je uspešno poslat.")
            else:
                print(f"Zahtev za verifikaciju adrese {email_address} nije uspešno poslat.")

        except Exception as e:
            print(f"Došlo je do greške prilikom slanja zahteva za verifikaciju: {str(e)}")
        return event

