var fs=require('fs');
//var ByteArray=require('./ByteArrayClass');
//var BuildObject=require('./BuildObject');

function AnimalsGameServer(disconnectCB){
this.httpsObj=null;
this.type='socketio';
this.cmdsCallback=null;

var server=this;


function ParamsData(connect, args){
    this.connect = connect;
    this.args = args;
    this.uniq = 0;
    }
    ParamsData.prototype.send=function(){
    server.send(this, arguments);
    };
    ParamsData.prototype.emit=function(){
    server.sendService(2, this, arguments);
    };
    ParamsData.prototype.getUserData=function(s){
    if (this.connect && s && this.connect[s]) {
                return this.connect[s];
            }
            return null;
    };
    ParamsData.prototype.clientIP=function(){
    if (this.connect!=null && this.connect.reqDataObj){
        var ipStr = '';
        if('x-real-ip' in this.connect.reqDataObj){
            ipStr=this.connect.reqDataObj['x-real-ip'];
        }else{
            ipStr=this.connect.reqDataObj.remoteAddress;
        }
        if (ipStr!=null) {
            var spl = ipStr.split(':');
            if (spl && spl.length > 0) {
                var vv=spl[spl.length - 1];
                if(vv=='1')return '127.0.0.1';
                return vv;
        }
    }
    }
    return '';
    };
    ParamsData.prototype.disconnect=function(){
       // console.log('disconnectt',this.connect);
    if(server.type=='ws'){
        if(this.connect!=null)this.connect.close();
    }else{
        if(this.connect!=null && this.connect.conn!=null)this.connect.conn.close();
    }
    
    };
    
    
    
    function RoomsMaster(){
    this.data = {};
    }
    RoomsMaster.prototype.get=function(id){
    var r = null;
            if (this.data.hasOwnProperty(id)) {
                r = this.data[id];
            }
            if (r == null) {
                r = new server.Room(id);
                this.data[id] = r;
            }
            return r;
    };
    RoomsMaster.prototype.remove=function(id){
    if (this.data.hasOwnProperty(id)) {
                if (server.Debug) {
                    console.log('Remove room "' + id + '"');
                }
                delete this.data[id];
            }
    };


function Stream(id, updateCB, closeCB){
id = id || this.getUniq();
this.id = id;
this.clientEvents = {};
this.updateCB = updateCB;
this.time = 0;
this.waitTime = -1;
this.MinClients = -1;
this.MaxClients = -1;
this.timeC = -1;
this.timeWaitC = -1;
this.onPlay = null;
this.onClose = closeCB;
this.isPlay = false;
this.customPlay = false;
server.streams[id] = this;
this.room = server.rooms.get('Stream_' + this.id);
}

Stream.prototype.setInOutHanler=function (cb) {
if (this.room != null) {
this.room.inOutHandler = cb;
}
};
Stream.prototype.getUniq=function(){
var rnd = 0;
do {
rnd = Math.floor(Math.random() * 100000);
} while (server.streams[rnd] != null);
return rnd;
};
Stream.prototype.on=function(s, cb){
if (!this.clientEvents.hasOwnProperty(s))this.clientEvents[s] = cb;
};
Stream.prototype.off=function(s){
if (this.clientEvents.hasOwnProperty(s))delete this.clientEvents[s];
};
Stream.prototype.isClient=function(connect){
return this.room.isClient(connect);
};
Stream.prototype.dispatch=function(connect, s, args){
args = args || [];
if (connect && (this.customPlay || this.isClient(connect)) && this.clientEvents.hasOwnProperty(s)) {
this.clientEvents[s].apply(connect, args);
}
};
Stream.prototype.CountClients=function(){
if (this.room) {
return this.room.CountClients();
}
return 0;
};
Stream.prototype.setMinMaxClients=function(a, b){
this.MinClients = a;
this.MaxClients = b;
};
Stream.prototype.start=function(){
var th = this;
this._stopTimers();
this.timeWaitC = setTimeout(function () {
var count = th.CountClients();
if (count >= th.MaxClients) {
th.play();
} else if (count >= th.MinClients) {
th.play();
} else {
th.remove();
}
}, this.waitTime * 1000);
};
Stream.prototype.play=function(){
var th = this;
            this._stopTimers();
            if (!this.isPlay) {
                if (this.onPlay != null) {
                    this.onPlay();
                }
                this.isPlay = true;
                this.timeC = setInterval(function () {
                    if (th.time) {
                        --th.time;
                    }
                    if (th.updateCB != null) {
                        th.updateCB();
                    }
                    if (th.time <= 0) {
                        th.remove();
                    }
                }, 1000);
            }
};
Stream.prototype.send=function(){
if (this.room) {
var prms = [this.id];
for (var i = 0; i < arguments.length; i++)prms.push(arguments[i]);
this.room.emitStream(prms);
}
};
Stream.prototype.sendConnect=function(connect){
if (connect && this.room) {
var prms = [this.id];
for (var i = 1; i < arguments.length; i++)prms.push(arguments[i]);
var o = [3,prms];
socketWriteObject(server,connect, o);
if (server.Debug)console.log('emitStream ->', JSON.stringify(o));
}
};
Stream.prototype.sendNoInitiator=function(connect){
if (connect && this.room) {
var prms = [this.id];
for (var i = 1; i < arguments.length; i++)prms.push(arguments[i]);
this.room.emit2Stream(connect, prms);
}
};
Stream.prototype.join=function(connect){
if (!this.isPlay) {
if (this.room)this.room.join(connect);
}
};
Stream.prototype.leave=function(connect){
if (this.room)this.room.leave(connect);
};
Stream.prototype._stopTimers=function(){
if (this.timeC != -1)
clearInterval(this.timeC);
if (this.timeWaitC != -1)clearTimeout(this.timeWaitC);
this.timeWaitC = -1;
this.timeC = -1;
};
Stream.prototype.remove=function(){
delete server.streams[this.id];
this._stopTimers();
if (this.onClose != null)this.onClose();
this.onClose = null;
this.updateCB = null;
this.send('close');
this.isPlay = false;
if (this.room)this.room.removeRoom();
this.room = null;
};





function Room(id){
this.id = id;
this.clients = [];
this.autoDelete = false;
this.inOutHandler = null;
if (server.Debug) {
//console.log('Create room "' + id + '"');
}
}
Room.prototype.join=function(connect){
if (connect) {
this.clients.push(connect);
if (this.inOutHandler != null)this.inOutHandler(connect, true);
}
};
Room.prototype.leave=function(connect){
if (connect) {
                for (var i = 0; i < this.clients.length; i++) {
                    if (this.clients[i] == connect) {
                        this.clients.splice(i, 1);
                        if (this.inOutHandler != null)
                            this.inOutHandler(connect, false);
                        break;
                    }
                }
            }
            if (this.autoDelete && this.clients.length == 0)
                this.removeRoom();
};
Room.prototype.isClient=function(connect){
if (connect) {
                for (var i = 0; i < this.clients.length; i++) {
                    var client = this.clients[i];
                    if (client == connect) {
                        return true;
                    }
                }
            }
            return false;
};
Room.prototype.CountClients=function(){
return this.clients.length;
};
Room.prototype.removeRoom=function(){
this.clients = [];
this.inOutHandler = null;
server.rooms.remove(this.id);
};
Room.prototype.emit=function(e){
var args = [e];
for (var i = 1; i < arguments.length; i++)args.push(arguments[i]);
for (var k = 0; k < this.clients.length; k++) {
var client = this.clients[k];
var o = [2,args];
socketWriteObject(server,client, o);
if (server.Debug)
console.log('emit ->', JSON.stringify(o));
}
};
Room.prototype.emitNoInitiator=function(connect, e){
var args = [e];
            for (var i = 2; i < arguments.length; i++)args.push(arguments[i]);
            for (var k = 0; k < this.clients.length; k++) {
                var client = this.clients[k];
                if (client != connect) {
                    var o = [2,args];
                    socketWriteObject(server,client, o);
                    if (server.Debug)
                    console.log('emitNoInitiator ->', JSON.stringify(o));
                }
            }
};
Room.prototype.emitStream=function(args){
for (var k = 0; k < this.clients.length; k++) {
                var client = this.clients[k];
                var o = [3,args];
                socketWriteObject(server,client, o);
                if (server.Debug)
                console.log('emitStream ->', JSON.stringify(o));
            }
};
Room.prototype.emit2Stream=function(connect,args){
for (var k = 0; k < this.clients.length; k++) {
var client = this.clients[k];
if (client != connect) {
var o = [3,args];
socketWriteObject(server,client, o);
if (server.Debug)
console.log('emit2Stream ->', o);
}
}
};

this.ParamsData=ParamsData;
this.Stream=Stream;
this.RoomsMaster=RoomsMaster;
this.Room=Room;


            var service1 = {
                run: function (connect, params) {
                    var cmm = params.args[1];
                    if(server.cmdsCallback!=null){
                    server.cmdsCallback(cmm, params, params.args[3]);
                    }else{
                    if (server.cmds.hasOwnProperty(cmm)) {
                    var funcName = params.args[1];
                    //var funcA = funcName.split('.');
                    var cmdO = server.cmds[funcName];
                    cmdO.cb.apply(params, params.args[3]);
                    } else {
                        console.log('cmd ' + cmm + ' not found');
                        connect.close();
                    }
                    }
                }
            };
            var service3 = {
                run: function (connect, params) {
                    var p = params.args[1];

                    var streamid = p.shift();
                    //console.log('pppp',streamid,p);
                    var t = p.shift();
                    //console.log('pppp',streamid,p);
                    if (server.streams.hasOwnProperty(streamid)) {
                        var q = server.streams[streamid];
                        if (t == 1) {
                            var ev = p.shift();
                            //console.log(p);
                            q.dispatch(connect, ev, p);
                        } else if (t == 2) {
                            q.join(connect);
                        } else if (t == 3) {
                            q.leave(connect);
                        }
                    } else {
                        var o = [3,[streamid,0]];//JSON.stringify([3,[streamid,0]]);
                        socketWriteObject(server,connect,o);
                        //console.log('emitStream ->', o);
                    }
                }
            };

            this.startTime=Math.floor(Date.now() / 1000);
            this.rooms = new this.RoomsMaster();

            //server = this;
            this.app = '';
            this.disconnectCB = disconnectCB;
            this.streams = {};
            this.errorCB = null;
            this.cmdsObjectClassCB = null;
            this.isInit = false;
            this.cmds = {};
            this.services = {};
            this.addService(1, 'MAIN', service1);
            this.addService(3, 'stream', service3);
            this.logHandler = null;
            this.statsActive = true;
            this.serverName='AnimalsGameServer';
            this.serverVersion = '1.0.0';
            this.cmdsAccessObj = null;
            this.Debug = true;
            this.startTime=0;
            this.addCmd('ping', function(){
                this.send(1);
            });
this.rooms = new this.RoomsMaster();
}

AnimalsGameServer.prototype.addCmd=function(name,cb){
this.cmds[name]={cb:cb};
};
AnimalsGameServer.prototype.addService=function(id, name, o){
o.id = id;
o.name = name;
this.services[id] = o;
return o;
};
AnimalsGameServer.prototype.addServiceUniq=function(o){
var rnd = 0;
do {
rnd = Math.floor(Math.random() * 100000);
} while (this.services[rnd] != null);
o.id = rnd;
this.services[rnd] = o;
return rnd;
};
AnimalsGameServer.prototype.send=function(paramsData){
if (paramsData) {
var args = [];
for (var i = 0; i < arguments[1].length; i++) {
var arg = arguments[1][i];
args.push(arg);
}
var qw = [1,args,paramsData.uniq];
socketWriteObject(this,paramsData.connect, qw);
if (this.Debug) {
console.log('send ->', JSON.stringify(qw));
}
}
};
AnimalsGameServer.prototype.sendService=function(id, paramsData, arr){
if (paramsData) {
                var args = [];
                for (var i = 0; i < arr.length; i++) {
                    var arg = arr[i];
                    args.push(arg);
                }
                var o = [id,args];
                socketWriteObject(this,paramsData.connect, o);
                if (this.Debug) {
                    console.log('sendService ->', JSON.stringify(o));
                }
            }
};
AnimalsGameServer.prototype.init=function(app, port){
this.app = app;
            var th = this;
			var host = '127.0.0.1';
			//host = null;
            var https=require('https');
			// отказ от express модуля, чтобы не тянуть 200+ файлов
            //var app = require('express')();
			var app = function(req, res){
				
			};
            this.express=app;
            var http=require('http');
            var server=null;
            if(this.httpsObj!=null && this.httpsObj.type=='letsencrypt'){
            var pathCert=this.httpsObj.path;
            var HTTPSOptions = {cert: fs.readFileSync(pathCert+'/cert.pem'),
    key: fs.readFileSync(pathCert+'/privkey.pem'),requestCert: false,rejectUnauthorized: false};
            http=https.createServer(HTTPSOptions, app);
            server=http;
            }else{
            server=http.createServer(app);
            http=server;
            //http = http.createServer(function(request, response) {});
            }
            var io = null;
			
			function noop(){
			}
			
			function heartbeat(){
			this.isAlive = true;
			}
			
            if(this.type=='ws'){
                var WebSocket = require('ws');
				io = new WebSocket.Server({noServer:true});
				server.on('upgrade', function(request, socket, head){
				io.handleUpgrade(request, socket, head, function(ws){
				io.emit('connection', ws, request);
				});
				});
                //io = new WebSocket.Server({server:server});

                var interval = setInterval(function ping() {
                io.clients.forEach(function each(ws) {
                if (ws.isAlive === false) return ws.terminate();
                ws.isAlive = false;
                if (ws.readyState !== WebSocket.OPEN) {
                }else{
                    ws.ping('ping',undefined,true);
                    //ws.ping(noop);
                }
            });
            }, 60*1000);

            }else{
            //io = require('socket.io').listen(http);
            }
            
            //var io = require('socket.io').listen(http);
            io.on('connection', function (socket,req) {
                if(th.type=='ws'){
                socket.reqDataObj=req.connection;
                if('x-real-ip' in req.headers)socket.reqDataObj['x-real-ip']=req.headers['x-real-ip'];
                socket.isAlive = true;
                socket.on('pong', heartbeat);
            }

                socket.on('error',function(){
                });

                socket.on('message', function (ar) {
                    th.dataHandler(socket,ar);
                });
                socket.on('disconnect', function () {
                    th.disconnect(socket);
                });
                socket.on('close', function () {
                    th.disconnect(socket);
                });
            });
            http.listen(port, host);
};

AnimalsGameServer.prototype.dataHandler=function(socket,ar){
var th=this;
if(socket!=null){
                    var message = ar;
                    try{
                        if(typeof ar=='string')
                        message=JSON.parse(ar);
                    }catch(e){}
                    try {

                        if(message instanceof Buffer){
                            var baa=new ByteArray(message);
                            message=baa.readObject();
                            ar=message;
                        }

                        //console.log('dttttt',message);
                        if (message instanceof Array) {
                            var arr = message;
                            var serviceID = arr[0];

                            if (th.services.hasOwnProperty(serviceID)) {
                                var s = th.services[serviceID];

                                var uniq = arr[2];
                                
                                if (th.Debug) {
                                    var logFunc = console.log;
                                    if (th.logHandler) {
                                        logFunc = th.logHandler;
                                    }
                                    logFunc('SERVICE ' + s.name + ' DATA -> ' + JSON.stringify(ar) + '');
                                    //logFunc('SERVICE ' + s.name + ' DATA -> ' + ar + '');
                                }

                                var cl = new th.ParamsData(socket, arr);
                                cl.uniq = uniq;
                                s.run(socket, cl);
                                
                            } else {
                            }
                        } else {
                            var cl = new th.ParamsData(socket, null);
                            cl.uniq = 0;
                            if (th.cmdsObjectClassCB != null) {
                                th.cmdsObjectClassCB.apply(cl, [message]);
                            }
                        }
                    } catch (e) {
                        var str = e.stack.toString();
                        console.log(e);
                        if (th.errorCB != null) {
                            var cl = new th.ParamsData(socket, []);
                            th.errorCB.apply(cl, [str]);
                        } else {
                            if (th.Debug) {
                                console.log(str);
                            }
                        }
                    }
}
};


AnimalsGameServer.prototype.disconnect=function(connect){
if (connect) {
for (var n in this.streams) {
var stream = this.streams[n];
stream.leave(connect);
}
if (this.disconnectCB)this.disconnectCB.apply(connect);
}
};
AnimalsGameServer.prototype.createStream=function(id){
return new this.Stream(id);
};

function socketWriteObject(server,connect,o){
if(connect!=null){
var rr=null;
if('isBinary' in server){
var ba=null;
if('isWriteObj' in connect && connect.isWriteObj){
//ba=new BuildObject();
}else{
ba=new ByteArray();
}
ba.writeObject(o);
rr=ba.getBytes();
}else{
rr=JSON.stringify(o);
}
if(server.type=='ws')
connect.send(rr,function(err){

});
else{
connect.emit('data',rr);
}
}
}


Array.prototype.removeIf=function(cb){
if(typeof cb!=="undefined"){
for (var i = 0; i < this.length; i++) {
if(cb.apply(this[i])){
this.splice(i,1);
}
}
}
};

Array.prototype.getObjByArr=function(v){
var o={};
if(v!=null && this.length <= v.length){
for (var i = 0; i < this.length; i++)o[v[i]] = this[i];
}
return o;
};

Array.prototype.createArrayByObject=function(o){
var arr=[];
if(o!=null){
for (var i = 0; i < this.length; i++){
var s=this[i];
arr.push(o[s]);
}
}
return arr;
};


Array.prototype.random=function(){
if(this.length>0){
var v=Math.floor(Math.random()*this.length);
return this[v];
}
return null;
};

//module.exports={Server:AnimalsGameServer};