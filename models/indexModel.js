const pool = require('./connection');

function indexModel() {
    this.register = (userDetails) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, con) => {
                var sqlQuery = "insert into register values(NULL,?,?,?,?,0,?,'user')"
                var sqlData = [userDetails.name, userDetails.email, userDetails.password, userDetails.mobile, Date()]
                con.query(sqlQuery, sqlData, (err, result) => {
                    con.release()
                    err ? reject(err) : resolve(result);
                })
            })
        })
    }

    this.contact = (userDetails) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, con) => {
                var sqlQuery = "insert into msg values(NULL,?,?,?,?,?,?)"
                var sqlData = [userDetails.name, userDetails.email, userDetails.subject, userDetails.mobile, userDetails.message, Date()]
                con.query(sqlQuery, sqlData, (err, result) => {
                    con.release()
                    err ? reject(err) : resolve(result);
                })
            })
        })
    }

    this.login = (userDetails) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, con) => {
                var sqlQuery = "select * from register where email=? and password=? and status=1"
                var sqlData = [userDetails.email, userDetails.password]
                con.query(sqlQuery, sqlData, (err, result) => {
                    con.release()
                    err ? reject(err) : resolve(result);
                })
            })
        })
    }

    this.verify = (emailID) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, con) => {
                var sqlQuery = "update register set status=1 where email=?"
                var sqlData = [emailID]
                con.query(sqlQuery, sqlData, (err, result) => {
                    con.release()
                    err ? reject(err) : resolve(result);
                })
            })
        })
    }

    this.fetchall = (tbl_nm) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, con) => {
                var sqlQuery = "select * from " + tbl_nm
                con.query(sqlQuery, (err, result) => {
                    con.release()
                    err ? reject(err) : resolve(result);
                })
            })
        })
    }

    this.fetchsubcat = (cnm) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, con) => {
                var sqlQuery = "select * from addsubcat where catnm=?"
                var sqlData = [cnm]
                con.query(sqlQuery, sqlData, (err, result) => {
                    con.release()
                    err ? reject(err) : resolve(result);
                })
            })
        })
    }

    this.fetchProduct = (urlObj) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, con) => {
                if (urlObj.sprice != undefined) {
                    var sqlQuery = "select * from product where subcat=? and price between ? and ?"
                    var sqlData = [urlObj.scnm, urlObj.sprice, urlObj.eprice]
                }
                else if (urlObj.city != undefined) {
                    var sqlQuery = "select * from product inner join register on product.pid=register.email where subcat=? and city=?"
                    var sqlData = [urlObj.scnm, urlObj.city]
                }
                else {
                    var sqlQuery = "select * from product where subcat=?"
                    var sqlData = [urlObj.scnm]
                }
                con.query(sqlQuery, sqlData, (err, result) => {
                    con.release()
                    err ? reject(err) : resolve(result);
                })
            })
        })
    }

    this.payment = (pDetails) => {
        console.log(pDetails);
        return new Promise((resolve, reject) => {
            pool.getConnection((err, con) => {
                var sqlQuery = "insert into payment values(NULL,?,?,?,?)"
                var sqlData = [pDetails.pid, pDetails.uid, pDetails.price, Date()]
                con.query(sqlQuery, sqlData, (err, result) => {
                    con.release()
                    err ? reject(err) : resolve(result);
                })
            })
        })

    }
}

module.exports = new indexModel()