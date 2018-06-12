const express = require("express");
const ejs = require("ejs");
const consolidate = require("consolidate");
const bodyParse = require("body-parser");
const db = require("./models/db");
const ObjectId = require("mongodb").ObjectID
const server = express();

//模板
server.set("views","./views");//模版文件夹
server.set("view engine","html");//渲染成什么格式
server.engine("html",consolidate.ejs);//使用什么模版引擎

//静态资源文件
server.use(express.static("./public"));
server.use(bodyParse.urlencoded({extended:false}))
server.get("/",(req,res)=>{
	res.render("index.ejs",{})
})
server.post("/tijiao",(req,res)=>{
	db.insertOne("liu","yan",{
		"name":req.body.name,
		"text":req.body.yiyan,
		"shijian":new Date()
	},(err,result)=>{
		if(err){
			res.send({"status":0,data:"失败"}).end()
		}else{
			res.send({"status":1,request:result,data:"成功"}).end();
		}
	})
})
server.post("/du",(req,res)=>{
	console.log(req.body.page)
	db.find("liu","yan",{},{"displayNum":6,"pagesNum":(parseInt(req.body.page)-1)*6,"sort":{"shijian":-1}},(err,result)=>{
		if(err){
			res.send({"status":0,request:null,data:"失败"})
		}else{
			res.send({"status":1,request:result,data:"成功"})
		}
		
	})
});
server.post('/count',(req,res)=>{//获取总数量
	db.getCount("liu","yan",(err,result)=>{
		res.json({"status":1,request:result,data:"成功"});
	})
});
server.post("/delete",(req,res)=>{
	db.deleteData("liu","yan",{"_id":ObjectId(req.body.dataId)},(err,result)=>{
		if(err){
			res.json({"status":0,request:null,data:"失败"})
		}else{
			res.json({"status":1,request:result,data:"成功"})
		}
		
	})
})
// server.get("/",(req,res)=>{
// 	db.insertOne("liu","yan",{"name":"小鑫鑫","text":"hello world","id":2},(err,result)=>{
// 		if(err){
// 			res.send("失败失败").end()
// 		}else{
// 			res.send('成功').end()
// 		}
// 	})
// });
server.get("/delete",(req,res)=>{
	db.deleteData("liu","yan",{"id":1},(err,result)=>{
		if(err){
			res.send('cuola').end()
		}else{
			res.send("ok").end()
		}
	})
});
server.get("/change",(req,res)=>{
	db.changeData("liu","yan",{"name":"lizn"},{$set:{"name":"liznn.cn"}},(err,result)=>{
		if(err){
			res.send(err).end()
		}else{
			res.send(result).end()
		}
	})
});
server.get("/look",(req,res)=>{
	db.find("liu","yan",{"name":"小鑫鑫"},{"displayNum":2,"pagesNum":0},(err,result)=>{
		if(err){
			res.send(err).end()
		}else{
			res.send(result).end()
		}
	})
});

server.listen(8088)