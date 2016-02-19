FUNC_NAME="" # Lambda AWS function name
ROLE="" # Lambda AWS role
TIMEOUT= # timetout in sec
MEMORY= # max allowed memory

# don't change:
RUNTIME="nodejs" 
HANDLER="RunHugo.handler" 
CODE_ZIP="fileb://runhugo.zip"
