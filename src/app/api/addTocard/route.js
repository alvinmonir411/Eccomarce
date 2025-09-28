//  api/ cart / route.js;
import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
export async function POST(req) {
  const { userId, productId, quantity = 1 } = await req.json();

  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);

  try {
    // Check if product already exists in user's cart
    const existingItem = await db.collection("usercart").findOne({
      userId,
      productId,
    });

    if (existingItem) {
      // Update quantity
      const updated = await db.collection("usercart").updateOne(
        { _id: existingItem._id },
        { $inc: { quantity } } 
      );
      return new Response(JSON.stringify({ success: true, updated }), {
        status: 200,
      });
    } else {
      // Insert new item
      const result = await db.collection("usercart").insertOne({
        userId,
        productId,
        quantity,
        createdAt: new Date(),
      });
      return new Response(JSON.stringify({ success: true, result }), {
        status: 200,
      });
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
      }
    );
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
