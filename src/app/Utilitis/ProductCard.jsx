"use client";
import React from "react";
import Image from "next/image";
import { Star, Heart, Eye, ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  const discount =
    product.offerPrice && product.offerPrice < product.price
      ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
      : null;

  const mainImage =
    product?.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder.png";

  return (
    <div className=" bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Product Image */}
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src={mainImage}
          alt={product?.title || "Product"}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          priority
        />

        {/* Hover Icons */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-primary hover:text-white">
            <Eye size={18} />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-red-500 hover:text-white">
            <Heart size={18} />
          </button>
        </div>

        {/* Discount Badge */}
        {discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            -{discount}%
          </span>
        )}

        {/* Stock */}
        {product?.stockQuantity >= 1 ? (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
            In Stock
          </span>
        ) : (
          <span className="absolute top-3 right-3 bg-gray-400 text-white text-xs px-2 py-1 rounded-full shadow-md">
            Out of Stock
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col justify-between h-60">
        <div className="text-center">
          <h2 className="font-semibold text-lg line-clamp-1 mb-1 hover:text-primary cursor-pointer">
            {product?.title}
          </h2>
          <p className="text-xs text-gray-400 uppercase mb-1">
            {product?.brand}
          </p>
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
            {product?.subtitle}
          </p>

          {/* Rating */}
          <div className="flex justify-center items-center gap-1 mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.round(product?.rating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              {product?.rating?.toFixed(1) || "0.0"}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-center gap-2">
            {product?.offerPrice ? (
              <>
                <p className="text-xl font-bold text-primary">
                  {product.currency} {product.offerPrice}
                </p>
                <p className="text-sm text-gray-400 line-through">
                  {product.currency} {product.price}
                </p>
              </>
            ) : (
              <p className="text-xl font-bold text-primary">
                {product.currency} {product.price}
              </p>
            )}
          </div>
        </div>

        {/* Add to Cart Button (Hover Only) */}
        <button
          className="btn btn-primary w-full mt-2 flex items-center justify-center gap-2 rounded-xl shadow-md 
          opacity-0 translate-y-5 group-hover:translate-y-0 group-hover:opacity-100 
          transition-all duration-300"
        >
          <ShoppingCart size={18} /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
