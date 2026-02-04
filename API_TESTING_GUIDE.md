# API Testing Guide - Orders & Coupons

## Prerequisites

- Server running on your configured port
- Authentication token (login as user/admin)
- MongoDB connected

---

## **COUPON ENDPOINTS**

### 1. Create Coupon (Admin Only)

```http
POST /coupon
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "code": "NEWYEAR2026",
  "discountType": "PERCENTAGE",
  "discountValue": 25,
  "startDate": "2026-02-01T00:00:00.000Z",
  "endDate": "2026-12-31T23:59:59.000Z",
  "usageLimit": 1000,
  "isActive": true
}
```

### 2. Create Fixed Discount Coupon

```http
POST /coupon
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "code": "SAVE50",
  "discountType": "FIXED",
  "discountValue": 50,
  "startDate": "2026-02-01T00:00:00.000Z",
  "endDate": "2026-06-30T23:59:59.000Z",
  "usageLimit": 500,
  "isActive": true
}
```

### 3. Get All Coupons (Admin Only)

```http
GET /coupon
Authorization: Bearer <admin_token>
```

### 4. Get Active Coupons (All Users)

```http
GET /coupon/active
Authorization: Bearer <user_token>
```

### 5. Validate Coupon (All Users)

```http
POST /coupon/validate/NEWYEAR2026
Authorization: Bearer <user_token>
```

### 6. Get Single Coupon (Admin Only)

```http
GET /coupon/<coupon_id>
Authorization: Bearer <admin_token>
```

### 7. Update Coupon (Admin Only)

```http
PATCH /coupon/<coupon_id>
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "discountValue": 30,
  "usageLimit": 2000
}
```

### 8. Deactivate Coupon (Admin Only)

```http
PATCH /coupon/<coupon_id>/deactivate
Authorization: Bearer <admin_token>
```

### 9. Activate Coupon (Admin Only)

```http
PATCH /coupon/<coupon_id>/activate
Authorization: Bearer <admin_token>
```

### 10. Delete Coupon (Admin Only)

```http
DELETE /coupon/<coupon_id>
Authorization: Bearer <admin_token>
```

---

## **ORDER ENDPOINTS**

### 1. Create Order WITHOUT Coupon

```http
POST /orders
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "address": "123 Main Street, Apt 4B, New York, NY 10001",
  "phone": "1234567890",
  "note": "Please ring doorbell twice",
  "paymentMethod": "cash"
}
```

### 2. Create Order WITH Coupon

```http
POST /orders
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "address": "456 Oak Avenue, Los Angeles, CA 90001",
  "phone": "9876543210",
  "note": "Leave at front door",
  "paymentMethod": "credit_card",
  "coupon": "65f1234567890abcdef12345"
}
```

**Note:** Before creating an order, ensure:

1. User has items in their cart
2. Products have sufficient stock
3. Coupon is valid (if using one)

### 3. Get All My Orders

```http
GET /orders
Authorization: Bearer <user_token>
```

### 4. Get Single Order Details

```http
GET /orders/<order_id>
Authorization: Bearer <user_token>
```

### 5. Update Order Details

```http
PATCH /orders/<order_id>
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "address": "789 Pine Street, Chicago, IL 60601",
  "phone": "5551234567",
  "note": "Updated delivery instructions"
}
```

### 6. Update Order Status

```http
PATCH /orders/<order_id>/status
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "status": "shipped"
}
```

**Valid status values:**

- `pending`
- `shipped`
- `delivered`
- `cancelled`
- `returned`

### 7. Cancel Order

```http
PATCH /orders/<order_id>/cancel
Authorization: Bearer <user_token>
```

**Note:** Only PENDING orders can be cancelled. This will:

- Restore product stock
- Restore coupon usage (if used)
- Set order status to CANCELLED

### 8. Delete Order

```http
DELETE /orders/<order_id>
Authorization: Bearer <user_token>
```

**Note:** Only CANCELLED orders can be deleted.

---

## **COMPLETE WORKFLOW EXAMPLE**

### Step 1: Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Save the returned token.

### Step 2: Add Products to Cart

```http
POST /cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "<product_id>",
  "quantity": 2
}
```

### Step 3: View Cart

```http
GET /cart
Authorization: Bearer <token>
```

### Step 4: Check Active Coupons

```http
GET /coupon/active
Authorization: Bearer <token>
```

### Step 5: Validate a Coupon

```http
POST /coupon/validate/NEWYEAR2026
Authorization: Bearer <token>
```

### Step 6: Create Order with Coupon

```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "address": "123 Main St, City, State 12345",
  "phone": "1234567890",
  "note": "Please deliver in the morning",
  "paymentMethod": "cash",
  "coupon": "<coupon_id_from_validation>"
}
```

### Step 7: View Order

```http
GET /orders/<order_id>
Authorization: Bearer <token>
```

### Step 8: Update Order Status

```http
PATCH /orders/<order_id>/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shipped"
}
```

### Step 9: Cancel Order (if needed)

```http
PATCH /orders/<order_id>/cancel
Authorization: Bearer <token>
```

---

## **ADMIN WORKFLOW EXAMPLE**

### Create Seasonal Coupons

```http
# Spring Sale
POST /coupon
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "code": "SPRING25",
  "discountType": "PERCENTAGE",
  "discountValue": 25,
  "startDate": "2026-03-01T00:00:00.000Z",
  "endDate": "2026-05-31T23:59:59.000Z",
  "usageLimit": 500,
  "isActive": true
}

# Summer Sale
POST /coupon
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "code": "SUMMER30",
  "discountType": "PERCENTAGE",
  "discountValue": 30,
  "startDate": "2026-06-01T00:00:00.000Z",
  "endDate": "2026-08-31T23:59:59.000Z",
  "usageLimit": 1000,
  "isActive": true
}

# Welcome Bonus
POST /coupon
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "code": "WELCOME10",
  "discountType": "FIXED",
  "discountValue": 10,
  "startDate": "2026-01-01T00:00:00.000Z",
  "endDate": "2026-12-31T23:59:59.000Z",
  "usageLimit": 0,
  "isActive": true
}
```

---

## **PAYMENT METHODS**

Available payment methods:

- `cash`
- `credit_card`
- `paypal`
- `stripe`
- `bank_transfer`

---

## **ERROR SCENARIOS TO TEST**

### 1. Create Order with Empty Cart

Expected: `400 Bad Request - Cart is empty`

### 2. Use Invalid Coupon

Expected: `400 Bad Request - Coupon is not valid`

### 3. Use Already Used Coupon

Expected: `400 Bad Request - You have already used this coupon`

### 4. Cancel Non-Pending Order

Expected: `400 Bad Request - Only pending orders can be cancelled`

### 5. Delete Non-Cancelled Order

Expected: `400 Bad Request - Only cancelled orders can be deleted`

### 6. Access Another User's Order

Expected: `404 Not Found - Order not found`

### 7. Create Order with Insufficient Stock

Expected: `400 Bad Request - Insufficient stock for one or more products`

### 8. Use Expired Coupon

Expected: `400 Bad Request - Invalid or expired coupon`

### 9. Exceed Coupon Usage Limit

Expected: `400 Bad Request - Coupon usage limit reached`

### 10. Create Duplicate Coupon Code

Expected: `400 Bad Request - Coupon code already exists`

---

## **TIPS FOR TESTING**

1. **Use Postman or Thunder Client** for easier API testing
2. **Save environment variables** for tokens and IDs
3. **Test authorization** by trying endpoints with wrong user types
4. **Test edge cases** like empty inputs, invalid IDs, etc.
5. **Monitor server logs** for detailed error messages
6. **Check database** to verify data changes
7. **Test concurrent requests** for race conditions (stock, coupons)
8. **Verify populates** - product and coupon data should be included in responses

---

## **POSTMAN COLLECTION STRUCTURE**

Organize your Postman collection as:

```
E-commerce API
├── Auth
│   ├── Login
│   └── Register
├── Coupons
│   ├── Create Coupon
│   ├── Get All Coupons
│   ├── Get Active Coupons
│   ├── Validate Coupon
│   ├── Get Single Coupon
│   ├── Update Coupon
│   ├── Activate Coupon
│   ├── Deactivate Coupon
│   └── Delete Coupon
└── Orders
    ├── Create Order
    ├── Create Order with Coupon
    ├── Get All Orders
    ├── Get Single Order
    ├── Update Order
    ├── Update Order Status
    ├── Cancel Order
    └── Delete Order
```

Save tokens in environment variables:

- `admin_token`
- `user_token`
- `order_id`
- `coupon_id`
