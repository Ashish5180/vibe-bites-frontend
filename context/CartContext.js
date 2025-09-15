'use client'

import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        ...action.payload
      }
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        item => item.id === action.payload.id && item.selectedSize === action.payload.selectedSize
      )
      // Get max stock from payload (should be passed from frontend)
      const maxStock = action.payload.maxStock ?? 99
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + action.payload.quantity, maxStock)
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && item.selectedSize === action.payload.selectedSize
              ? { ...item, quantity: newQuantity }
              : item
          )
        }
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: Math.min(action.payload.quantity, maxStock) }]
        }
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          item => !(item.id === action.payload.id && item.selectedSize === action.payload.selectedSize)
        )
      }

    case 'UPDATE_QUANTITY': {
      // Get max stock from payload (should be passed from frontend)
      const maxStock = action.payload.maxStock ?? 99
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && item.selectedSize === action.payload.selectedSize
            ? { ...item, quantity: Math.min(action.payload.quantity, maxStock) }
            : item
        )
      }
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        appliedCoupon: null
      }

    case 'APPLY_COUPON':
      return {
        ...state,
        appliedCoupon: action.payload
      }

    case 'REMOVE_COUPON':
      return {
        ...state,
        appliedCoupon: null
      }

    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    appliedCoupon: null
  })

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('vibe-bites-cart')
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      dispatch({ type: 'LOAD_CART', payload: parsedCart })
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vibe-bites-cart', JSON.stringify(state))
    // If logged-in, try to sync to server (best-effort)
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://vibebitstest-env.eba-ubvupniq.ap-south-1.elasticbeanstalk.com/api'}/cart/sync`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      headers: getAuthHeaders(),
      body: JSON.stringify(state)
    }).catch(() => {})
  }, [state])

  const addToCart = (product, selectedSize, quantity = 1) => {
    const sizeObj = product.sizes.find(size => size.size === selectedSize) || {}
    const price = sizeObj.price || 0
    const maxStock = sizeObj.stock ?? 99
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        image: product.image,
        selectedSize,
        price,
        quantity,
        category: product.category,
        maxStock
      }
    })
  }

  const removeFromCart = (id, selectedSize) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { id, selectedSize }
    })
  }

  const updateQuantity = (id, selectedSize, quantity, maxStock = 99) => {
    if (quantity <= 0) {
      removeFromCart(id, selectedSize)
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id, selectedSize, quantity, maxStock }
      })
    }
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const applyCoupon = async (couponCode) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://vibebitstest-env.eba-ubvupniq.ap-south-1.elasticbeanstalk.com/api'}/coupons/validate`, {
        method: 'POST',
        headers,
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          code: couponCode, 
          orderAmount: getCartTotal(),
          items: state.items 
        }),
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok && data.success && data.data && data.data.coupon) {
        dispatch({
          type: 'APPLY_COUPON',
          payload: { code: couponCode.toUpperCase(), ...data.data.coupon, discountAmount: data.data.discountAmount }
        });
        return { success: true, message: `Coupon ${couponCode.toUpperCase()} applied!` }
      } else {
        return { success: false, message: data.message || 'Invalid coupon code' }
      }
    } catch {
      return { success: false, message: 'Network error' }
    }
  }

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' })
  }

  const getCartTotal = () => {
    const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    
    if (!state.appliedCoupon) return subtotal

    let discount = 0
    if (state.appliedCoupon.type === 'percentage') {
      if (state.appliedCoupon.category) {
        // Category-specific discount
        const categoryItems = state.items.filter(item => item.category === state.appliedCoupon.category)
        const categoryTotal = categoryItems.reduce((total, item) => total + (item.price * item.quantity), 0)
        discount = (categoryTotal * state.appliedCoupon.discount) / 100
      } else {
        // General discount
        discount = (subtotal * state.appliedCoupon.discount) / 100
      }
    }

    return subtotal - discount
  }

  const getCartCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    items: state.items,
    appliedCoupon: state.appliedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getCartTotal,
    getCartCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 