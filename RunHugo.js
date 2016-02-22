var async = require('async');
var util = require('util');
var child_process  = require('child_process');
var s3 = require('s3');
var AWS = require('aws-sdk');
var config = require("./config.json");
var fs = require("fs");
var https = require('https');
var AdmZip = require('adm-zip');

var syncClient = s3.createClient({
    maxAsyncS3: 20
});

pubDir = config.tmpDir + "/public";

function siteGenerate(dstBucket, context) {
    async.waterfall([
	function listContents(next) {
	    var child = child_process.spawn("ls", ["-ltra", config.srcDir]);
            
	    child.stdout.on('data', function (data) {
	    	console.log('ls-stdout: ' + data);
	    });
	    child.stderr.on('data', function (data) {
	    	console.log('ls-stderr: ' + data);
	    });
	    child.on('error', function(err) {
		next(err);
	    });
	    child.on('close', function(code) {
		next(null);
	    });
	},
	function runHugo(next) {
	    console.log("Running hugo");
	    var child = child_process.spawn("./hugo", ["-v", "--source=" + config.srcDir, "--destination=" + pubDir]);
            
	    child.stdout.on('data', function (data) {
	    	console.log('hugo-stdout: ' + data);
	    });
	    child.stderr.on('data', function (data) {
	    	console.log('hugo-stderr: ' + data);
	    });
	    child.on('error', function(err) {
		console.log("hugo failed with error: " + err);
		next(err);
	    });
	    child.on('close', function(code) {
		console.log("hugo exited with code: " + code);
		next(null);
	    });
	},
	function upload(next) {
	    var params = {
		localDir: pubDir,
		deleteRemoved: true,
		s3Params: {
		    ACL: 'public-read',
		    Bucket: dstBucket,
		},
	    };
	    var uploader = syncClient.uploadDir(params);
	    uploader.on('error', function(err) {
		console.error("unable to sync up:", err.stack);
		next(err);
	    });
	    uploader.on('end', function() {
		console.log("done uploading");
		next(null);
	    });
	},
    ], function(err) {
        if (err) console.error("Failure because of: " + err)
        else console.log("All methods in waterfall succeeded.");
	context.done();
    });
}

exports.handler = function(event, context) {
    var tmpFilePath = "/tmp/master" + Math.random() * 100 + ".zip";

    https.get(config.archive, function(response) {
	response.on('data', function (data) {
	    fs.appendFileSync(tmpFilePath, data);
	});
	response.on('end', function() {
	    console.log("Zip: " + tmpFilePath)
	    var zip = new AdmZip(tmpFilePath);
	    fs.unlink(config.tmpDir);
	    zip.extractAllTo(config.tmpDir);
	    fs.unlink(tmpFilePath);
	    siteGenerate(config.dstBucket, context);
	});
    });
};

// exports.handler();
