const {Pool}=require("pg");
const dotenv=require("dotenv");
dotenv.config();
const db1=new Pool({
    host:process.env.HOST,
    port:process.env.PORT,
    database:process.env.DATABASE,
    user:process.env.USER,
    password:process.env.PASS,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false,
        sslmode: 'require'
    } : false,
    statement_timeout: 30000,
    query_timeout: 30000,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
});
module.exports=db1;