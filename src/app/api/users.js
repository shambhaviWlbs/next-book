// pages/api/books/[id].js
import pool from '../../../lib/db';

export default async function handler(req, res) {
   const { id } = req.query; // Get the ID from the URL

   try {
      const result = await pool.query('SELECT * FROM highlight'); // Use parameterized query
      if (result.rows.length === 0) {
         return res.status(404).json({ error: 'Book not found' });
      }
      res.status(200).json(result.rows[0]); // Return the first book found
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
   }
}
