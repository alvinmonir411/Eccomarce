//  api/ cart / route.js;
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  const { userId, productId } = await req.json();

  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);

  try {
    const result = await db.collection("usercart").insertOne({
      userId,
      productId,
      createdAt: new Date(),
    });
    return new Response(JSON.stringify({ success: true, result }));
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }));
  }
}
// GET => Fetch cart items with product details
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(
      JSON.stringify({ success: false, error: "Missing userId" }),
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);

  try {
    const cartItems = await db
      .collection("usercart")
      .find({ userId })
      .toArray();
    console.log(cartItems);
    if (cartItems.length === 0) {
      return new Response(JSON.stringify({ success: true, items: [] }), {
        status: 200,
      });
    }

    const productIds = cartItems.map((item) => new ObjectId(item.productId));
    console.log(productIds);

    const products = await db
      .collection("juwelaryitemdeteils")
      .find({ _id: { $in: productIds } })
      .toArray();
    console.log(products);
    return new Response(JSON.stringify({ success: true, items: products }), {
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
