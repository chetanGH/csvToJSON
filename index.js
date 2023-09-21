const fs = require('fs');
const {Transform } = require('stream')

const parseJSON = new Transform({
    transform(row,encoding,callback){
        let output = [];
        
        let data =  row.toString();
        let arr = data.split('\n');
        let head = arr.splice(0,1)[0].split(',');
    
        let keys = [];
        head.forEach((i)=>{
            if(i.includes('\r')){
                i = i.split('\r')[0]
            }
            keys.push(i)
        });
        for (let index = 0; index < arr.length; index++) {
            let val = arr[index].split(',');
            let obj = {};
            if(Array.isArray(val) == true && val.length ==keys.length){
                val.forEach((i,inx)=>{
                    if(i.includes('\r')){
                        i = i.split('\r')[0]
                    }
                    obj[keys[inx]] = i;
                })
                output.push(obj)
            }
        }
        callback(null,Buffer.from(JSON.stringify(output)))
    }
})

let file = fs.createReadStream('./sample.csv')
.pipe(parseJSON)
file.on('data',(data)=>{
    console.log("data",JSON.parse(data.toString()))
   
})
file.on('error',(err)=>{
    console.log(err);
    process.exit(1)
})
file.on('end',()=>{
    console.log("end file")
})