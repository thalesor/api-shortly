import { v4 as uuidv4 } from 'uuid';

import { connection } from '../database.js';

export async function createUrl(req, res) {
  userId = res.locals.user.id;
  try {
     const shortUrl = uuidv4().split("-")[0]; 
    await connection.query(`
      INSERT INTO 
        urls("userId", "shortUrl", url) 
      VALUES ($1, $2, $3)
    `, [userId, shortUrl, req.body.url])

    res.status(201).send();
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function getUrl(req, res) {
  const { shortUrl } = req.params;
  try {

   const resultUrls = await connection.query(`
     SELECT id, "shortUrl", url FROM 
     urls 
     WHERE shortUrl=$1
   `, [shortUrl]);

   if( resultUrls?.rowCount === 0)
    return res.sendStatus(404);
   
   res.status(200).send(resultUrls.rows[0]);
 } catch (error) {
   return res.sendStatus(500);
 }
}

export async function deleteUrl(req, res)
{
	const { id } = req.params;
	const result = await connection.query("SELECT * FROM urls WHERE id=$1", [id]);

        if( result?.rows[0].userId !== res.locals.user.id)
          return res.sendStatus(401);
            
	      await connection.query(`DELETE FROM urls WHERE id=$1`, [id]);
        res.sendStatus(204);
		return;	
}
