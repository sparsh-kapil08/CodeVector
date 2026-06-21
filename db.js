const {Pool}=require("pg");
const dotenv=require("dotenv");
dotenv.config();
const db1=new Pool({
    host:process.env.HOST,
    port:process.env.PORT,
    database:process.env.DATABASE,
    user:process.env.USER,
    password:process.env.PASS,
    options:'-c default_transaction_read_only=off',
    ssl:{rejectUnauthorized:false
    }
});
module.exports=db1;