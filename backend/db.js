const {Pool}=require("pg");
const dotenv=require("dotenv");
dotenv.config();
const db1=new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{rejectUnauthorized:false
    }
});
module.exports=db1;