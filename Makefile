.PHONY: clean build deleteLambda deploy default

include config.mk

initnodedeps:
	npm install --prefix . fs https adm-zip async aws-sdk s3

clean :
	rm -rf *.zip

build :
	7za a runhugo.zip * -x!Makefile -x!*.mk

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

default : build
