.PHONY: clean build rmlambda deploy default createrole createsns

include config.mk

initnodedeps:
	npm install --prefix . fs https adm-zip async aws-sdk mime

clean :
	rm -rf *.zip

build :
	7za a runhugo.zip * -x!Makefile -x!*.mk -x!sample.*

rmlambda:
	aws lambda delete-function --function-name ${FUNC_NAME}

deploy :
	aws lambda create-function --function-name ${FUNC_NAME} \
		--runtime ${RUNTIME} \
		--role ${ROLE} \
		--memory-size ${MEMORY} \
		--handler ${HANDLER} \
		--zip-file ${CODE_ZIP} \
		--timeout ${TIMEOUT}

createsns:
	aws sns create-topic --name GithubWebhookEvent

createrole:
	aws iam create-role --role-name ${ROLE} --assume-role-policy-document file://policy.json
	aws iam put-role-policy --role-name ${ROLE} --policy-name AWSLambdaBasicExecutionRole --policy-document file://rolepolicy.json
	aws iam put-role-policy --role-name ${ROLE} --policy-name AccessToHugoS3Buckets --policy-document file://rolepolicyS3.json

default : build
