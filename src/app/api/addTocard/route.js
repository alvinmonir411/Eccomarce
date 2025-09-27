import clientPromise from "@/app/lib/mongodb";

export async function POST(req) {
  const carddata = await req.json();

  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);

  try {
    const result = await db.collection("usercard").insertOne(carddata);
    return new Response(JSON.stringify(result));
  } catch (err) {
    return new Response(JSON.stringify(err.message));
  }
}
