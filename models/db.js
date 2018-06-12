const mongoClient = require("mongodb").MongoClient;
const url = require("./seting");
//连接数据库
function _connectDB(callback){
	mongoClient.connect(url.url,(err,db)=>{
		callback(null,db)
	})
};
//增
exports.insertOne = function(ku,collectionName,json,callback){
	_connectDB((err,db)=>{
		if(err) throw err;
		var dbo = db.db(ku);
		dbo.collection(collectionName).insertOne(json,(err2,res)=>{
			if(err2){
				callback(err2,null);
				db.close();
			}else{
				callback(null,res);
				db.close();//关闭数据库
			}
		})
	})
};
//删
exports.deleteData = function(ku,collectionName,json,callback){
	_connectDB((err,db)=>{
		if(err) throw err;
		var dbo = db.db(ku);
		dbo.collection(collectionName).deleteMany(json,(err2,res)=>{
			if(err2){
				callback(err2,null);
				db.close();
			}else{
				callback(null,res);
				db.close();
			}
		})
	})
};
//改
exports.changeData = function(ku,collectionName,json1,json2,callback){
	_connectDB((err,db)=>{
		if(err) throw err;
		var dbo = db.db(ku);
		dbo.collection(collectionName).updateMany(json1,json2,(err2,res)=>{
			if(err2){
				callback(err2,null);
				db.close();
			}else{
				callback(null,res);
				db.close();
			}
		})
	})
};
//查
exports.find = function(ku,collectionName,json,args,callback){
	//args定义了页面显示的数量
	_connectDB((err,db)=>{
		if(err){
			callback(err,null);
			db.close();
			return;
		}
		var dbo = db.db(ku);
		if(arguments.length!=5){
			callback("请输入5个参数，少一个都不行！宝贝",null);
			db.close();
		}else{
			var result = []
			var displayNum = parseInt(args.displayNum);//页面显示数量
			var pagesNum = parseInt(args.pagesNum);//页面中的页数
			var allDatas = dbo.collection(collectionName).find(json).limit(displayNum).skip(pagesNum).sort(args.sort);
			allDatas.each((err,doc)=>{
				if(doc!=null){
					result.push(doc)
				}else{
					callback(null,result);
					db.close();
				}
			})
		}
		
	})
};
//总数
exports.getCount = function(ku,collectionName,callback){
	_connectDB((err,db)=>{
		if(err) throw err;
		var dbo = db.db(ku);
		dbo.collection(collectionName).count({}).then((count)=>{
			callback(null,count)
			db.close()
		});
		
	})
}


























