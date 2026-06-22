async function getItems(db){
    const existingItems=await db.query("SELECT COUNT(*)::int AS count FROM items");

    if(existingItems.rows[0].count===0){
        const totalRows=200000;
        const batchSize=10000;

        for(let start=1; start<=totalRows; start+=batchSize){
            const end=Math.min(start+batchSize-1,totalRows);

            await db.query(
                            `
                            INSERT INTO items(name, price, category, updated_at)
                            SELECT
                            'Product ' || gs,
                            floor(random()*10000)::bigint,
                            (ARRAY['Electric','Household','Automotive'])[floor(random()*3+1)],
                            NOW()
                            FROM generate_series($1::int, $2::int) AS gs
                            `,
                            [start, end]
);
        }
    }

    const res=await db.query("SELECT * FROM items ORDER BY updated_at DESC ");
    return res.rows;
};
module.exports=getItems;