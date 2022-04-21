var express = require('express');
var app = express();
var cors = require('cors')
const { exec } = require("child_process");
app.use(cors());

exec('tree', (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

app.get('/get', function (req, res) {
   res.send(JSON.stringify('Hello World'));
})

app.get('/test', function (req, res) {
    
        exec('tree', (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            res.send(stdout);
        })
    
 })

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})