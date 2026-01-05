const {logevents}=require('./logevent')
const errorhandler=function(err,req,res,next)
{   
    logevents(`${err.name}: ${err.message}` , 'errLog.txt');
    
     res.status(500).send(err.message);
}

module.exports=errorhandler ;