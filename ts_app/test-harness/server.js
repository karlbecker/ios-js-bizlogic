
var express = require('express'),
    exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path');

var app = express();

function sendErr(res, err) {
    res.send(500, '<pre style="color: red">error creating test runner: ' + err + "</pre>")
}

app.use('/', express.static('../out/'));
app.use('/', express.static('./web/'));


app.get('/test-runner', function(req, res) {
    exec('npm run-script compile-test-ts', function(err, stdout, stderr) {
        if(err) {
            sendErr(res, err.stack);
        } else if(stderr) {
            sendErr(res, stderr);
        } else {
            fs.readFile('../out/bridge.html', function(err, bridgeHtml) {
                if(err) { return sendErr(res, err.stack) }
                var testCss = ['mocha.css']
                var testJs = ['assert.js', 'js-yaml.js', 'mocha.js', 'should.js'];
                var addCss = testCss.map(function(fileName) { return '<link rel="stylesheet" href="css/' + fileName + '">'}).join('\n');
                var addJs = testJs.map(function(fileName) { return '<script type="text/javascript" src="js/' + fileName + '"></script>'}).join('\n');
                addJs = addJs + '<script>mocha.setup("bdd");</script>\n';
                

                var html = bridgeHtml.toString('utf-8').replace('<!-- TEST_DEPENDENCIES -->', addCss + "\n" + addJs);
                res.send(html);
            });
        }
    })
});

app.get('/compiled/latest.zip', function(req, res) {
    exec('npm run-script compile-ts && cd ../out && zip -r latest.zip *', function(err, stdout, stderr) {
        if(err) {
            sendErr(res, err.stack);
        } else if(stderr) {
            console.log('err', stderr);
            sendErr(res, stderr);
        } else {
            console.log('compiled')
            res.sendfile(path.resolve('../out/latest.zip'));
        }
    })
});

module.exports = app.listen(3000, function() {
    console.log('test harness listening - visit localhost:3000/test-runner to run tests');
});
