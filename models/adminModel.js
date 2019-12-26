const pool = require('./connection');

function adminModel()
{
    this.addcat = (catnm, caticonnm)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err,con)=>{
                sqlQuery = "insert into addcat values(NULL,?,?)"
                sqlData = [catnm, caticonnm]
                con.query(sqlQuery,sqlData,(err,result)=>{
                    con.release()
                    err ? reject(err) : resolve(result);
                })
            })
        })
    }

    this.addsubcat = (catnm, subcatnm, subcaticonnm)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err,con)=>{
                sqlQuery = "insert into addsubcat values(NULL,?,?,?)"
                sqlData = [catnm, subcatnm, subcaticonnm]
                con.query(sqlQuery,sqlData,(err,result)=>{
                    con.release()
                    err ? reject(err) : resolve(result);
                })
            })
        })
    }


    this.viewUser = ()=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err,con)=>{
                sqlQuery = "select * from register where role='user' "
                con.query(sqlQuery,(err,result)=>{
                    con.release()
                    err ? reject(err) : resolve(result);
                })
            })
        })
    }

    this.manageUserStatus = (details)=>{
        return new Promise((resolve, reject)=>{
            pool.getConnection((err,con)=>{
                var sqlQuery 
                if (details.s=='block')
                    sqlQuery = "update register set status=0 where regid=? "
                else if (details.s=='unblock')
                    sqlQuery = "update register set status=1 where regid=? "
                else
                    sqlQuery = "delete from register where regid=? "
                sqlData = [details.regid]
                console.log(sqlData);
                con.query(sqlQuery,sqlData,(err,result)=>{
                    con.release()
                    err ? reject(err) : resolve(result);
                })
            })
        })
    }
}

module.exports = new adminModel()