var express = require('express');
var app = express();
var cors = require('cors')
const { exec } = require("child_process");
app.use(cors());
fs = require('fs');


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
   
    exec('pwd', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        res.send(JSON.stringify(stdout));
    });
})

app.get('/getSize/:fileDirectory/:fileName', function (req, res) {
    var directory = req.params.fileDirectory;
    var fileName = req.params.fileName;
    console.log('PARAMS REQ', req.params)
   
    exec(`cd ${directory} ; stat -c %s ${fileName}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        res.send(JSON.stringify(stdout));
    });
})

app.get('/get/:fileName', function (req, res) {
    var fileName = req.params.fileName
    

    //var directory = req.params.directory
    console.log('req', req.params)
    res.download(fileName)
    /*fs.readFile(fileName, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log('file', data);
        
    });
    

    /*const http = require('http'); // or 'https' for https:// URLs

    const file = fs.createWriteStream("file.jpg");
    const request = http.get(`${fileName}`, function (response) {
        response.pipe(file);

        // after download completed close filestream
        file.on("finish", () => {
            file.close();
            console.log("Download Completed");
        });*/

   
    /*exec(`readlink -f ${fileName}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        res.send(JSON.stringify(stdout));
    });*/
})

app.get('/test', function (req, res) {
    
    
        exec('tree -J', (error, stdout, stderr) => {
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

 app.get('/test/:directory', function (req, res) {
     var directory = req.params.directory
     console.log('directory', directory)
  
    
    exec(`cd ${directory} ; tree -J`, (error, stdout, stderr) => {
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