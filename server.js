const http = require('http');
const fs = require('fs');
const WebApp = require('./webapp');
const querystring = require('querystring');
const PORT=8004;
const _registeredUsers=[{userName:'sree',name:'sreenadh'}];
let app=WebApp.create();
let allComments=JSON.parse(fs.readFileSync('./data/comments.txt'));
fs.writeFileSync('./public/js/comments.js',`var comments=${JSON.stringify(allComments)};`);
let contentTypes={
  'html':"text/html",
  'jpg':"image/jpeg",
  'gif':"image/gif",
  'css':"text/css",
  'pdf':"application/pdf",
  'js':"text/javascript",
};

const getContentType=function (resourcePath) {
  let splitedPath=resourcePath.split(".");
  return splitedPath[splitedPath.length-1];
};

const setContentType=function (res,resourcePath) {
  let extension=getContentType(resourcePath);
  res.writeHead(200,{"Content-Type": contentTypes[extension]});
};

const writeToPage=function (req,res) {
  let resourcePath=`./public${req.url}`;
  try {
    let filecontent=fs.readFileSync(resourcePath);
    setContentType(res,resourcePath);
    res.write(filecontent);
    res.end();
  } catch (e) {
    res.statusCode = 404;
    res.write('File not found!');
    res.end();
    return;
  }
};

const loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = _registeredUsers.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

const storeComments=function (comment) {
  let commentData=comment;
  commentData.time=new Date().toLocaleString();
  allComments.unshift(commentData);
  fs.writeFileSync('./data/comments.txt',JSON.stringify(allComments));
  fs.writeFileSync('./public/js/comments.js',`var comments=${JSON.stringify(allComments)};`);
};

app.use(loadUser);
app.addPostprocess(writeToPage);

app.get('/',(req,res)=>{
  res.redirect('/home.html');
});

let server=http.createServer(app);
server.listen(PORT);
console.log(`Listening to port ${PORT}.......`);