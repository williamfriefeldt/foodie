import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb"

export default async (req:NextApiRequest, res:NextApiResponse) => {
 
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    if(req.method === 'POST') {
      const collection = db.collection("restaurants");
      return collection.insertOne(req.body)
        .then(_ => res.json(`We added ${req.body.name}`))
        .catch(_ => res.json('An error occured'))
    }

    const restaurants = await db.collection("restaurants")
        .find({})
        .toArray();

    return res.json(restaurants);
}

export const config = {
    api: {
      bodyParser: {
        sizeLimit: '40mb',
      },
    },
  } 