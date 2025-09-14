'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import ProductReviews from '../../../components/ProductReviews'
import { useCart } from '../../../context/CartContext'
import { useWishlist } from '../../../context/WishlistContext'
import { useToast } from '../../../components/Toaster'
import { ShoppingCart, ArrowLeft, Star, Heart, Share2, Play } from 'lucide-react'

export default function ProductDetailPage() {
  const [carouselIdx, setCarouselIdx] = useState(0)
  const params = useParams()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, items: wishlistItems } = useWishlist()
  const { addToast } = useToast()

  const [product, setProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showVideo, setShowVideo] = useState(false)

  // Check if product is in wishlist
  const isInWishlist = product ? wishlistItems.some(item => item.id === product.id) : false

  const handleWishlistToggle = () => {
    if (!product) return
    
    if (isInWishlist) {
      removeFromWishlist(product.id)
      addToast(`${product.name} removed from wishlist`, 'success')
    } else {
      const selectedSizeObj = product.sizes.find(size => size.size === selectedSize) || product.sizes[0]
      addToWishlist({ 
        id: product.id, 
        name: product.name, 
        image: product.image,
        price: selectedSizeObj?.price || 0
      })
      addToast(`${product.name} added to wishlist`, 'success')
    }
  }

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!params?.id) return
      
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`http://localhost:8080/api/products/${params.id}`, {
          headers: { 'Cache-Control': 'no-cache' }
        })
        
        if (!response.ok) {
          throw new Error('Product not found')
        }
        
        const data = await response.json()
        
        if (!data.success || !data.data?.product) {
          throw new Error('Invalid product data received')
        }
        
        const fetchedProduct = data.data.product
        setProduct(fetchedProduct)
        
        // Set default selected size
        if (fetchedProduct.sizes && fetchedProduct.sizes.length > 0) {
          setSelectedSize(fetchedProduct.sizes[0].size)
        }
        
      } catch (err) {
        console.error('Product fetch error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-vibe-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibe-brown mx-auto mb-4"></div>
          <p className="text-vibe-brown text-lg">Loading product...</p>
        </div>
      </div>
    )
  }

  // Handle error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-vibe-bg">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-vibe-brown mb-4">Product Not Found</h1>
            <p className="text-lg text-vibe-brown/70 mb-8">
              {error || "The product you're looking for doesn't exist."}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-vibe-cookie text-vibe-brown font-semibold rounded-full hover:bg-vibe-accent transition-colors duration-300"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Get selected size object and calculate price
  const selectedSizeObj = product.sizes?.find(size => size.size === selectedSize) || {}
  const currentPrice = selectedSizeObj.price || 0
  const maxStock = selectedSizeObj.stock ?? 99

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      addToast('Please select a size', 'error')
      return
    }

    if (selectedSizeObj.stock === 0) {
      addToast('Selected size is out of stock', 'error')
      return
    }

    if (quantity > maxStock) {
      addToast(`Only ${maxStock} left in stock`, 'error')
      setQuantity(maxStock)
      return
    }

    addToCart(product, selectedSize, quantity)
    addToast(`${product.name} added to cart!`, 'success')
    setQuantity(1)
  }

  return (
    <div className="min-h-screen bg-vibe-bg">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-vibe-brown/60">
            <li><Link href="/" className="hover:text-vibe-brown">Home</Link></li>
            <li>/</li>
            <li><Link href="/products" className="hover:text-vibe-brown">Products</Link></li>
            <li>/</li>
            <li><Link href={`/products?category=${product.category?.toLowerCase()}`} className="hover:text-vibe-brown">{product.category}</Link></li>
            <li>/</li>
            <li className="text-vibe-brown font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images Carousel */}
          <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {product.images && product.images.length > 1 ? (
              <>
                <Image
                  src={product.images[carouselIdx] || product.image || "/images/hero-snack-1.jpg"}
                  alt={product.name || "Product"}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      className={`w-3 h-3 rounded-full ${carouselIdx === idx ? 'bg-vibe-brown' : 'bg-vibe-cookie'}`}
                      onClick={() => setCarouselIdx(idx)}
                      aria-label={`Go to image ${idx+1}`}
                    />
                  ))}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    aria-label="Add to wishlist"
                    onClick={handleWishlistToggle}
                  >
                    <Heart className={`h-5 w-5 transition-colors ${
                      isInWishlist 
                        ? 'text-red-500 fill-current' 
                        : 'text-vibe-brown hover:text-red-500'
                    }`} />
                  </button>
                  <button
                    className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    aria-label="Share"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: product.name,
                          text: product.description,
                          url: window.location.href
                        })
                        .then(() => addToast('Product shared!', 'success'))
                        .catch(() => addToast('Share cancelled', 'info'))
                      } else {
                        navigator.clipboard.writeText(window.location.href)
                        addToast('Product link copied!', 'success')
                      }
                    }}
                  >
                    <Share2 className="h-5 w-5 text-vibe-brown" />
                  </button>
                </div>
                {product.featured && (
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center bg-vibe-cookie text-vibe-brown px-3 py-1 rounded-full text-sm font-semibold">
                      <Star className="h-4 w-4 fill-current mr-1" />
                      Featured
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <Image
                  src={product.image || (product.images && product.images[0]) || "/images/hero-snack-1.jpg"}
                  alt={product.name || "Product"}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    onClick={handleWishlistToggle}
                  >
                    <Heart className={`h-5 w-5 transition-colors ${
                      isInWishlist 
                        ? 'text-red-500 fill-current' 
                        : 'text-vibe-brown hover:text-red-500'
                    }`} />
                  </button>
                  <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Share2 className="h-5 w-5 text-vibe-brown" />
                  </button>
                </div>
                {product.featured && (
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center bg-vibe-cookie text-vibe-brown px-3 py-1 rounded-full text-sm font-semibold">
                      <Star className="h-4 w-4 fill-current mr-1" />
                      Featured
                    </div>
                  </div>
                )}
              </>
            )}
            {/* Product Video */}
            {product.video && product.video.trim() && (
              <div className="absolute bottom-4 left-4">
                <button
                  onClick={() => setShowVideo(!showVideo)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
                >
                  <Play className="h-4 w-4 text-vibe-brown fill-current" />
                  <span className="text-sm font-medium text-vibe-brown">
                    {showVideo ? 'Hide Video' : 'Watch Video'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Rating */}
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-vibe-brown/60">
                {product.rating || 0} ({product.reviewCount || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-vibe-brown">
              ₹{currentPrice}
              {selectedSize && <span className="text-lg text-vibe-brown/60 ml-2">/ {selectedSize}</span>}
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-vibe-brown mb-3">Select Size</label>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.size}
                      onClick={() => setSelectedSize(size.size)}
                      className={`px-6 py-3 rounded-lg border-2 transition-colors ${
                        selectedSize === size.size
                          ? 'bg-vibe-cookie text-vibe-brown border-vibe-cookie'
                          : 'border-vibe-cookie/30 text-vibe-brown hover:border-vibe-cookie'
                      }`}
                    >
                      <div className="font-semibold">{size.size}</div>
                      <div className="text-sm">₹{size.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-vibe-brown mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-vibe-cookie text-vibe-brown hover:bg-vibe-accent transition-colors flex items-center justify-center"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-xl font-semibold text-vibe-brown w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                  className="w-10 h-10 rounded-full bg-vibe-cookie text-vibe-brown hover:bg-vibe-accent transition-colors flex items-center justify-center"
                  disabled={quantity >= maxStock}
                >
                  +
                </button>
                {selectedSizeObj.stock === 0 && <span className="text-red-500 ml-2">Out of Stock</span>}
                {selectedSizeObj.stock > 0 && (
                  <span className="text-vibe-brown/60 ml-2">Stock: {selectedSizeObj.stock}</span>
                )}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || selectedSizeObj.stock === 0}
              className="w-full inline-flex items-center justify-center px-8 py-4 bg-vibe-cookie text-vibe-brown font-semibold rounded-full hover:bg-vibe-accent transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {selectedSizeObj.stock === 0 ? 'Out of Stock' : `Add to Cart - ₹${currentPrice * quantity}`}
            </button>

            {/* Product Details */}
            <div className="space-y-6 pt-8 border-t border-vibe-cookie/20">
              <div>
                <h3 className="text-lg font-semibold text-vibe-brown mb-3">Ingredients</h3>
                <p className="text-vibe-brown/70">{product.ingredients || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-vibe-brown mb-3">Nutrition Facts</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Calories", product.nutrition?.calories],
                    ["Protein", product.nutrition?.protein],
                    ["Carbs", product.nutrition?.carbs],
                    ["Fat", product.nutrition?.fat],
                    ["Fiber", product.nutrition?.fiber]
                  ].map(([label, value]) => (
                    <div className="flex justify-between" key={label}>
                      <span className="text-vibe-brown/70">{label}</span>
                      <span className="font-semibold text-vibe-brown">{value || "N/A"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Video Modal */}
        {showVideo && product.video && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-vibe-brown">Product Video</h3>
                <button
                  onClick={() => setShowVideo(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <video
                  src={product.video}
                  controls
                  autoPlay
                  className="absolute inset-0 w-full h-full"
                  onError={() => {
                    setShowVideo(false)
                    addToast('Video failed to load', 'error')
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        <ProductReviews productId={product._id || product.id} productName={product.name} />
      </div>
      
      <Footer />
    </div>
  )
}
