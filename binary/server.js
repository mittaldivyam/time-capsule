var express=require("express");
var fileUploader=require("express-fileupload");
var mysql2=require("mysql2");
var cloudinary =require("cloudinary").v2;

var app=express();

app.listen(2012,function(){
    console.log("server enabeld");

})

app.get("/",function(req,resp){
    
   let path=__dirname+"/public/page1.html";
   resp.sendFile(path);
    
})

app.get("/pg2",function(req,resp){
    let path1=__dirname+"/public/page2.html";
    resp.sendFile(path1);
     
 })

 app.get("/pg323",function(req,resp){
    let path3=__dirname+"/public/page4.html";
    resp.sendFile(path3);
     
 })

 app.get("/pg32",function(req,resp){
    let path2=__dirname+"/public/page3.html";
    resp.sendFile(path2);
     
 })
 
 app.use(express.urlencoded(true)); //convert POST data to JSON object




 app.use(express.static("public"));
 //Connecting to DB==========================================
let dbConfig="mysql://avnadmin:AVNS_bvLEEI9zzQ5MdMHAT3N@mysql-160370f1-divyamji605-4e73.k.aivencloud.com:16721/defaultdb";
let mySqlServer=mysql2.createConnection(dbConfig);

mySqlServer.connect(function(err){
    if(err!=null)
    {
        console.log(err.message);
    }
    else
        console.log("Connected to DB");
    
})
//----------------------------------------------

app.use(express.urlencoded(true)); //convert POST data to JSON object
        app.use(fileUploader());//to recv. and upload pic on server from client

        cloudinary.config({ 
            cloud_name: 'dnloczz1c', 
            api_key: '571719384152483', 
            api_secret: 'LIPMoc6mgrCLt1RW8mNj7vKH0Ng' // Click 'View API Keys' above to copy your API secret
        });
 


app.post("/pge2", function(req,resp)
{

    let inputEmail4=req.body.email;
    let inputname=req.body.name;
    let inputnumber=req.body.contact;

    mySqlServer.query("insert into users values(?,?,?)",[inputEmail4,inputname,inputnumber],function(err)
    {
            if(err==null)
            {
                resp.redirect("/pg32");
            }
            else
            resp.send(err.message);
    })
})


app.post("/pge23", function(req,resp)
{

    let inputEmail4=req.body.email;
    let inputnumber=req.body.contact;

    mySqlServer.query("select * from users where email=?  and contact=?",[inputEmail4,inputnumber],function(err,jsonaarray)
    {
            if(err==null)
            {
                console.log("Heloo world");
                resp.redirect("/pg32");
            }
            else
            {
             console.log("Invalid");
             resp.send(err.message);
            }
    })
})


app.post("/submit-capsule",async function(req,resp)
{
    let pin =req.body.pin;
    console.log(pin);
    let text=req.body.text;
    let ct=req.body.unlockTime;

    console.log(text);
    
    
    
    let fileName;
    if(req.files!=null)
    {
        fileName=req.files.image.name;
        let locationToSave=__dirname+"/public/images/"+fileName;//full ile path
        req.files.image.mv(locationToSave);//saving file in uploads folder

         //saving ur file/pic on cloudinary server
         await cloudinary.uploader.upload(locationToSave).then(function(picUrlResult){
            fileName=picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log(fileName);
      });
    }
    else
    fileName="nopic.jpg";

    


    mySqlServer.query("insert into  info values(?,?,?,?)",[pin,text,fileName,ct],function(err)
    {
            if(err==null)
            {
                resp.send("Record Saved");
            }
            else
            resp.send(err.message);
    })
})


app.get("/view",function(req,resp)
{
    let pin =req.query.pin;
    console.log(pin);
    mySqlServer.query("select * from info where pin=?",[pin],function(err,jsonaarray)
    {
     if(err==null)
     {
        resp.send(jsonaarray);
     }

     else
     resp.send(err.message);
    })
});


