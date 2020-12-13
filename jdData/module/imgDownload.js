const https = require('https')                                   
const Stream = require('stream').Transform                                  
const fs = require('fs')

module.exports = function(url, fileSavePath){

  https.request(url, function(response) {        
    console.log(`load ${fileSavePath}`)                                
    let data = new Stream()                                             
  
    response.on('data', function(chunk) {                                       
      data.push(chunk)                                             
    });                                                                         
    
    response.on('end', function() {       
      fs.writeFileSync(fileSavePath, data.read())                           
    })

  }).end()

}