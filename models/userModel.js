const pool = require('./connection');

function userModel()
{
   this.addProduct=(pDetails,f1_name,f2_name,f3_name)=>{
       return new Promise((resolve,reject)=>{
           pool.getConnection((err,con)=>{
               sqlQuery='insert into product values(NULL,?,?,?,?,?,?,?,?,?,?,?)'
               sqlData=[pDetails.title,pDetails.cat,pDetails.subcat,pDetails.city,pDetails.des,f1_name,f2_name,f3_name,pDetails.price,pDetails.email,Date()]
               con.query(sqlQuery,sqlData,(err,result)=>{
                   con.release();
                   err ? reject(err) : resolve(result)
               })
           })
       })
   }

   this.orderlist=(uid)=>{
       return new Promise((resolve,reject)=>{
            pool.getConnection((err,con)=>{
                sqlQuery='select * from payment where uid=?'
                sqlData=[uid]
                con.query(sqlQuery,sqlData,(err,result)=>{
                con.release();
                err ? reject(err) : resolve(result)
              })
           })
        })
    }
}

module.exports = new userModel()