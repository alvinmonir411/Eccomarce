"use client";
import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Addtocard from "@/app/Utilitis/Addtocard";

export default function ProductDetails({ params }) {
  const { id } = use(params);

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setActiveImage(data.images?.[0]);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500 border-solid"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-xl font-semibold">
        Product not found ❌
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6 py-16 space-y-16">
      {/* Top Section: Gallery + Info */}
      <div className="grid md:grid-cols-2 gap-16">
        {/* Product Images */}
        <div>
          <div className="rounded-3xl overflow-hidden border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition duration-500">
            <Image
              src={activeImage || "/placeholder.jpg"}
              alt={product.title}
              width={700}
              height={700}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mt-4 justify-center flex-wrap">
            {product.images?.map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveImage(img)}
                className={`cursor-pointer rounded-xl overflow-hidden border ${
                  activeImage === img
                    ? "border-yellow-500 ring-2 ring-yellow-400"
                    : "border-gray-200"
                } bg-white shadow-md hover:shadow-lg hover:scale-105 transition`}
              >
                <Image
                  src={img}
                  alt={`${product.title}-${i}`}
                  width={120}
                  height={120}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info Panel */}
        <div className="flex flex-col justify-between bg-white rounded-3xl p-10 shadow-lg border border-gray-100 space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
              {product.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4 italic">
              {product.subtitle}
            </p>

            {/* Brand + Category + SKU */}
            <div className="text-sm text-gray-500 mb-4 space-y-1">
              <p>
                <span className="font-medium">Brand:</span> {product.brand}
              </p>
              <p>
                <span className="font-medium">Category:</span>{" "}
                {product.category}
              </p>
              <p>
                <span className="font-medium">SKU:</span> {product.sku} |{" "}
                <span className="font-medium">Model:</span> {product.model}
              </p>
              <p>
                <span className="font-medium">Gender:</span> {product.gender}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl md:text-4xl font-bold text-yellow-600">
                {product.currency} {product.offerPrice || product.price}
              </span>
              {product.offerPrice && (
                <span className="text-gray-400 line-through text-lg">
                  {product.currency} {product.price}
                </span>
              )}
            </div>

            {/* Stock & Purchase Count */}
            <div className="flex items-center gap-4 mb-6">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.stockQuantity > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.availability}
              </span>
              <span className="text-gray-500 text-sm">
                {product.purchaseCount}+ purchased
              </span>
            </div>

            {/* Overview */}
            <div className="bg-gray-50 p-4 rounded-xl mb-4 shadow-sm">
              <h2 className="font-semibold text-lg mb-2">Overview</h2>
              <ul className="text-gray-700 space-y-1">
                <li>Certification: ✅ {product.certification}</li>
                <li>Warranty: ✅ {product.warranty}</li>
              </ul>
            </div>

            {/* Technical Specs */}
            <div className="bg-gray-50 p-4 rounded-xl mb-4 shadow-sm">
              <h2 className="font-semibold text-lg mb-2">Specifications</h2>
              <ul className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                <li>Height: {product.height}</li>
                <li>Width: {product.width}</li>
                <li>Length: {product.length}</li>
                <li>Weight: {product.weight}</li>
                <li>Color: {product.color}</li>
                <li>Diamond: {product.diamondWeight}</li>
                <li>Materials: {product.materials?.join(", ")}</li>
              </ul>
            </div>

            {/* Care Instructions */}
            <div className="bg-gray-50 p-4 rounded-xl mb-4 shadow-sm">
              <h2 className="font-semibold text-lg mb-2">Care Instructions</h2>
              <p className="text-gray-700">{product.careInstructions}</p>
            </div>

            {/* Customization Options */}
            {product.customizationOptions?.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-xl mb-4 shadow-sm">
                <h2 className="font-semibold text-lg mb-2">
                  Customization Options
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.customizationOptions.map((opt, i) => (
                    <button
                      key={i}
                      className="px-4 py-2 border rounded-xl text-gray-700 hover:bg-yellow-50 transition"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-3">
              {product.giftWrappingAvailable && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  🎁 Gift wrapping available
                </span>
              )}
              {product.isFeatured && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  Featured
                </span>
              )}
              {product.isTrending && (
                <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
                  Trending
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <Addtocard />
            <button className="border-2 border-yellow-600 text-yellow-600 px-10 py-3 rounded-2xl hover:bg-yellow-50 transition font-semibold text-lg">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid md:grid-cols-2 gap-16">
        {/* Reviews */}
        <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
          <h2 className="font-semibold text-xl mb-4">
            Customer Reviews ({product.reviews?.length || 0})
          </h2>
          {product.reviews?.length > 0 ? (
            product.reviews.map((review, idx) => (
              <div key={idx} className="mb-4 border-b border-gray-200 pb-2">
                <div className="flex items-center gap-2 text-yellow-500 mb-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                  ))}
                  <span className="text-gray-600 ml-2">{review.rating}</span>
                </div>
                <p className="text-gray-700">{review.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>

        {/* Shipping & Returns */}
        <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
          <h2 className="font-semibold text-xl mb-4">Shipping & Returns</h2>
          <p className="mb-2">Shipping: ✅ {product.shippingInfo}</p>
          <p>Return Policy: ✅ {product.returnPolicy}</p>
        </div>
      </div>
    </section>
  );
}
