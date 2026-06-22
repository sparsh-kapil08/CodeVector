const express=require("express");
const dotenv=require("dotenv");
dotenv.config();
const app=express();
const db=require("./db");
const cors=require("cors");
const getItems=require("./script");
app.use(cors());    
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get("/",async(req,res)=>{
    const items=await getItems(db);
    res.json(items);
});
app.get("/:filter",async(req,res)=>{
    const filter=req.params.filter;
    const resp=await db.query(`SELECT * FROM ITEMS WHERE category=$1 ORDER BY updated_at DESC `,[filter]);
    const items=resp.rows;

    res.json(items);
});
app.listen(5000,()=>{
    console.log("Server is running on port 5000");
});
