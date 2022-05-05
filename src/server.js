var express = require('express');
var app = express();
var cors = require('cors')
const { exec } = require("child_process");
var fileUpload = require('express-fileupload');
app.use(cors());
app.use(fileUpload());
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

app.get('/getContent/:fileDirectory', function (req, res) {
    var directory = req.params.fileDirectory;
    //var fileName = req.params.fileName;
    var fileData = fs.readFileSync(directory).toString('hex');
    var result = []
    for (var i = 0; i < fileData.length; i+=2){
        result.push('0x'+fileData[i]+''+fileData[i+1])
    }
    res.send(result)
   
   
})

app.get('/get/:fileName', function (req, res) {
    var fileName = req.params.fileName
    console.log('reader')
    console.log('req', req.params)
    res.download(fileName)
})

app.get('/get/:directory/:fileName', function (req, res) {
    var fileName = req.params.fileName
    var directory = req.params.directory
    console.log('reader')
    console.log('req', req.params)
    res.download(directory + fileName)
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

app.get('/isFile/:directory', function (req, res) {
    var directory = req.params.directory
    var stats = fs.statSync(directory)
    res.send(stats.isFile());
})


app.get('/addFolder/:directory/:folderName', function (req, res) {
    var directory = req.params.directory
    var folderName = req.params.folderName
    console.log('directory', directory)
 
   
   exec(`cd ${directory} ; mkdir ${folderName}`, (error, stdout, stderr) => {
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

app.get('/addFolder/:directory/:file', function (req, res) {
    var directory = req.params.directory
    var file = req.params.file
    console.log('directory', directory)
   exec(`cd ${directory} ; mkdir ${folderName}`, (error, stdout, stderr) => {
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

app.get('/addLink/:directory/:target', function (req, res) {
    var directory = req.params.directory
    var target = req.params.target
    console.log('directory', directory)
   exec(`ln -s ${target}  ${directory}`, (error, stdout, stderr) => {
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

app.post('/upload:directory', function(req, res) {
    var fileUploaded =  req.files.fileKey;
    var directory = req.params.directory;
    console.log(directory)
    console.log(req.files.fileKey);
    //fileUploaded.mv(directory + fileUploaded.name)
    fileUploaded.mv(directory + '/' +  fileUploaded.name)


    res.send(fileUploaded) // the uploaded file object


  });

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})