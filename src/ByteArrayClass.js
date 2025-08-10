(function(){

var PRIMITIVE_INT = 1;
var PRIMITIVE_NUMBER = 2;
var PRIMITIVE_STRING = 3;
var PRIMITIVE_BOOLEAN = 4;
var PRIMITIVE_ARRAY = 5;
var PRIMITIVE_OBJECT = 6;
var PRIMITIVE_BYTES = 7;
var PRIMITIVE_FUNCTION = 8;
var PRIMITIVE_BIG_STRING = 10;

var isDouble=function(n) {return n === +n && n !== (n|0);}

class ByteArrayClass{
constructor(bytes){
this.ba = [];
this.pos = 0;
this.endian="big";
if(bytes != null){
this.ba = bytes;
}
}


writeInt(v){
this.writeU32(v);
}
writeShort(v){
this.writeU16(v);
}
writeNumber(v){
this.writeString(''+v);
}

writeByte(v){
if(v!=null){
this.ba[this.pos]=v;
this.pos+=1;
}
}

writeBytes(v){
if(v!=null){
for(var i = 0; i < v.length; i++){
this.writeByte(v[i]);
}
}
}

writeBoolean(v){
if(v!=null){
var c=0;
if(v==true){
c=1;
}
this.writeByte(c);
}
}

writeString(v){
var str=''+v;
var buf=Buffer.from(str);
var isBig=false;
if(arguments.length>1 && arguments[1]=='big')isBig=true;
if(isBig){
this.writeInt(buf.length);
this.writeBytes(buf);
}else{
if (buf.length > 0xFFFF)return;
this.writeShort(buf.length);
this.writeBytes(buf);
}
}

writeUTFBytes(v){
var str=''+v;
var buf=Buffer.from(str);
this.writeBytes(buf);
}

/*writeString(v){
var str=''+v;
var buf=Buffer.from(str);
this.writeShort(buf.length);
for (var i = 0; i < buf.length; i++)this.writeByte(buf[i]);
}*/

writeObject(arg){
var t = typeof arg;
    if(arg===null||arg==undefined){
	this.writeByte(0);
	}else if(Array.isArray(arg)){
	
	var sz=arg.length
	this.writeByte(PRIMITIVE_ARRAY)
	this.writeInt(sz)
	for (var i = 0; i < sz; i++)this.writeObject(arg[i])
    }
    else if(t=="number"){
	if(isDouble(arg)){
	this.writeByte(PRIMITIVE_NUMBER);
	this.writeString(""+arg);
	}else{
	this.writeByte(PRIMITIVE_INT);
	this.writeInt(arg);
	}
	}

    else if(t=="object"){
	if(arg instanceof Buffer){
    	this.writeByte(PRIMITIVE_BYTES);
    	this.writeInt(arg.length);
    	this.writeBytes(arg);
		return;
	}
	
var nums=0;
for(var n in arg)nums+=1;
this.writeByte(PRIMITIVE_OBJECT);
this.writeInt(nums);
for(var n in arg){
this.writeObject(n);
this.writeObject(arg[n]);
}
}else if(t=="string"){
if(arg.length>0xFFFF){
this.writeByte(PRIMITIVE_BIG_STRING);
this.writeString(arg,'big');
}else{
this.writeByte(PRIMITIVE_STRING);
this.writeString(arg,'normal');
}
}
else if(t=="boolean"){
this.writeByte(PRIMITIVE_BOOLEAN);
this.writeBoolean(arg);
}
}


// запись 8-битного беззнакового целого числа
writeU8(value){
// следующая строчка обеспечивает беззнаковость
value &= 0xFF;
this.ba[this.pos]=value;
this.pos+=1;
}

// запись 16-битного беззнакового целого числа
writeU16(value){
  value &= 0xFFFF;
  if(this.endian == "big") { //прямой порядок
    this.writeU8( value >> 8 );
    this.writeU8( value >> 0 );
  } else {
    // обратный порядок
    this.writeU8( value >> 0 );
    this.writeU8( value >> 8 );
  }
}
 
// запись 32-битного беззнакового целого числа

writeU32(value){
value &= 0xFFFFFFFF;
if(this.endian == "big") {
this.writeU8( value >> 24 );
this.writeU8( value >> 16 );
this.writeU8( value >> 8  );
this.writeU8( value >> 0  );
}else {
this.writeU8( value >> 0  );
this.writeU8( value >> 8  );
this.writeU8( value >> 16 );
this.writeU8( value >> 24 );
}
}

// чтение 8-битного беззнакового целого числа
readU8(){
if(this.pos >= this.ba.length) {
throw new Error("Неожиданный конец файла");
}
return this.ba[this.pos++];
}

// чтение 16-битного беззнакового целого числа
readU16(){
var value = 0;
if(this.endian == "big") {
value |= this.readU8() << 8;
value |= this.readU8() << 0;
} else {
value |= this.readU8() << 0;
value |= this.readU8() << 8;
}
return value;
}

// чтение 32-битного беззнакового целого числа
readU32(){
var value = 0
if(this.endian == "big") {
value |= this.readU8() << 24;
value |= this.readU8() << 16;
value |= this.readU8() << 8;
value |= this.readU8() << 0;
} else {
value |= this.readU8() << 0;
value |= this.readU8() << 8;
value |= this.readU8() << 16;
value |= this.readU8() << 24;
}
return value;
}

readInt(){
return this.readU32();
}

readShort(){
return this.readU16();
}

readNumber(){
var str=this.readString();
if(str){
return parseFloat(str);
}
return null;
}

readByte(){
return this.readU8();
}


readBytes(c){
var a =[];
for(var i = 0; i < c; i++){
var b=this.readByte();
a.push(b);
}
return a;
}

readUTFBytes(count){
if(count>0){
var arr=this.readBytes(count);
if(arr && arr.length>0){
var buf=Buffer.from(arr);
return ''+buf;
}
}
return '';
}

readString(){
var count = this.readShort();
return this.readUTFBytes(count);
}


readBigString(){
var sz=this.readInt();
return this.readUTFBytes(sz);
}

readBoolean(){
var v = this.readByte();
return v==1;
}

readObject(){
var o=null;
if(this.available() > 0){
var t=this.readByte();
if(t==PRIMITIVE_ARRAY){
o=[];
var len=this.readInt();
for (var i = 0; i < len; i++){
var v=this.readObject();
o.push(v);
}
}else if(t==PRIMITIVE_INT){
o=this.readInt();
}else if(t==PRIMITIVE_NUMBER){
var v=this.readNumber();
o=v;
}else if(t==PRIMITIVE_STRING){
o=this.readString();
}else if(t==PRIMITIVE_BIG_STRING){
o=this.readBigString();
}else if(t==PRIMITIVE_BOOLEAN){
o=this.readBoolean();
}
else if(t==PRIMITIVE_FUNCTION){
o=this.readObject();
}

else if(t==PRIMITIVE_OBJECT){
var count=this.readInt();
o={};
for (var i = 0; i < count; i++){
var k=this.readObject();
var v=this.readObject();
o[k]=v;
}
}else if(t==PRIMITIVE_BYTES){
var len=this.readInt();
var bytes=this.readBytes(len);
var buf=new Buffer(bytes.length);
for (var i = 0; i < bytes.length; i++) {
var n=bytes[i];
buf[i]=n;
}
o=buf;
}else if(t==0){
o=null;
}else{
throw new Error("error read object");
}
}
return o;

}



available(){
if(this.ba != null){
var v = this.ba.length - this.pos;
if(v <= 0){
v = 0;
}
return v;
}
return 0;
}


getBytes(){
var buf=new Buffer(this.ba.length);
for (var i = 0; i < this.ba.length; i++) {
var n=this.ba[i];
buf[i]=n;
}
return buf;
}

cut(length,offset){
if(this.ba.length>0){
offset=offset||0;
this.ba.splice(this.pos+offset,length);
}
}


}

global.ByteArray = ByteArrayClass;
})();
//module.exports=ByteArrayClass;