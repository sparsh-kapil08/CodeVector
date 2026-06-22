const pool = require("./_db");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { filter } = req.query;
    const resp = await pool.query(
      "SELECT * FROM items WHERE category=$1 ORDER BY updated_at DESC",
      [filter]
    );
    return res.status(200).json(resp.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch filtered items" });
  }
};
