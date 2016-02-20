# Github Hugo Lambda deployment
Lambda AWS &lt;> Hugo Project

This project is created to streamline and automate pushing Hugo websites to AWS s3

# Rationale

Assuming, you setup the workflow as described here: http://bezdelev.com/post/hugo-aws-lambda-static-website/
To update your project, you have to update input.<project> bucket.

The approach is great, but I found that pulling the project off github and running Hugo on Lambda would be more efficient.

# Prerequisites
 - p7zip
 - npm
 - gnu make

This project includes:
 - RunHugo.js - modified version of the RunHugo.js included in the post.
 - Makefile - make commands for initializing nodejs dependencies, updating lambda code, building the project
 - sample.config.{mk,json} - sample config files
 - hugo - hugo binary (FIXME: pull the latest version off Hugo project)
 
 # Install
 
 1. ```git clone https://github.com/alex-glv/lahg```
 2. Edit sample config files and rename to config.{json,mk}
 3. ```make initnodedeps && make build && make deploy``` This will update provision nodejs dependencies, build the zip file and deploy to AWS Lambda
