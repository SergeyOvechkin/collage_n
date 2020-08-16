const http = require('http');
const fs = require("fs");
const path = require("path");


const server = http.createServer((req, res) => { 

	 var parsUrl  = path.parse(req.url);	

  //отдаем представление index на локальном сервере
   if(req.url === '/' && req.method.toLowerCase() === 'get'){	  
	  
            readFile(req, res, "./index.html");
  }  ////отдаем статические файлы и файлы из базы данных на любом сервере
  else if(parsUrl.dir.split("/")[1] == "img" ||  parsUrl.dir.split("/")[1] == "js" ||  parsUrl.dir.split("/")[1] == "css"){
	  
	  // console.log(`Запрошенный адрес: ${parsUrl.dir} / ${parsUrl.base}`);
	  
	  var dir = parsUrl.dir;
	  
	  
	  var nameFile = "."+dir+"/"+parsUrl.base;
	  
	  readFile(req, res, nameFile);
	
	
  }  else {	 
                console.log(req.url+"not found");
                res.statusCode = 404;
                res.end("Resourse not found!");
  }


});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000/ ...');
});

//функция читает файл и отправляет его клиенту
function readFile(req, res, nameFile){
	
		 fs.readFile(nameFile, function(error, data){
                 
            if(error){
                     
                res.statusCode = 404;
                res.end("Resourse not found!");
            }   
            else{
                res.end(data);
            }			
        });		
}