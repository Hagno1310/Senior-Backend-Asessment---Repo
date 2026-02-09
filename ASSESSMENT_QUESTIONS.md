# Restaurant Food Ordering System - Assessment Questions

This document contains assessment questions based on intentional errors found in the codebase. Candidates should identify and fix these issues.

---

## Table of Contents
1. [Backend Logic Errors](#1-backend-logic-errors)
2. [Frontend Logic Errors](#2-frontend-logic-errors)
3. [UI/UX Issues](#3-uiux-issues)
4. [API & Data Issues](#4-api--data-issues)
5. [Security Issues](#5-security-issues)

---

## 1. Backend Logic Errors

### Question 1.1: Authentication Middleware Logic Error
**File:** `food-ordering-backend/src/middleware/auth.ts`
**Lines:** 27, 33-34

**Problem:** The authentication middleware has critical logic errors that prevent proper authentication.

```typescript
// Line 27
if (authHeader || authHeader.startsWith("Bearer ")) {
  token = authHeader.substring(7);
}

// Lines 33-34
if (token) {
  return res.status(401).json({ message: "unauthorized" });
}
```

**Task:** Identify and fix the TWO logic errors in this code:
1. What is wrong with the condition on line 27?
2. What is wrong with the condition on lines 33-34?

---

### Question 1.2: Restaurant Creation Logic Inversion
**File:** `food-ordering-backend/src/controllers/MyRestaurantController.ts`
**Lines:** 24-28

**Problem:** The restaurant creation check has inverted logic.

```typescript
const existingRestaurant = await Restaurant.findOne({ user: req.userId });

if (!existingRestaurant) {
  return res
    .status(409)
    .json({ message: "User restaurant already exists" });
}
```

**Task:** Explain what happens when:
1. A user tries to create their first restaurant
2. A user already has a restaurant and tries to create another
3. How should this logic be corrected?

---

### Question 1.3: Price Conversion Error
**File:** `food-ordering-backend/src/controllers/MyRestaurantController.ts`
**Lines:** 32-34, 38

**Problem:** The price conversion during restaurant creation is incorrect.

```typescript
const deliveryPrice = req.body.deliveryPrice
  ? Math.round(parseFloat(req.body.deliveryPrice) / 100)
  : 0;

// And for menu items:
price: item.price ? Math.round(parseFloat(item.price) / 100) : 0,
```

**Task:**
1. If a user enters £5.00 as the delivery price, what will be stored in the database?
2. What mathematical operation should be used instead, and why?

---

### Question 1.4: Invalid MongoDB Operator
**File:** `food-ordering-backend/src/controllers/RestaurantController.ts`
**Line:** 46

**Problem:** An invalid MongoDB operator is used in the search query.

```typescript
if (selectedCuisines) {
  const cuisinesArray = selectedCuisines
    .split(",")
    .map((cuisine) => new RegExp(cuisine, "i"));
  query["cuisines"] = { $any: cuisinesArray };
}
```

**Task:**
1. Is `$any` a valid MongoDB operator?
2. What operator should be used to match restaurants that have ANY of the selected cuisines?
3. What operator would be used to match restaurants that have ALL selected cuisines?

---

### Question 1.5: Search Query Logic Error
**File:** `food-ordering-backend/src/controllers/RestaurantController.ts`
**Lines:** 51-54

**Problem:** The search query uses incorrect logic for searching.

```typescript
if (searchQuery) {
  const searchRegex = new RegExp(searchQuery, "i");
  query["$and"] = [
    { restaurantName: searchRegex },
    { cuisines: { $in: [searchRegex] } },
  ];
}
```

**Task:**
1. What does the `$and` operator require for a match?
2. If a user searches for "Pizza", will they find a restaurant named "Pizza Palace" that serves "Italian" cuisine?
3. What operator should be used to find restaurants matching EITHER the name OR cuisine?

---

### Question 1.6: Pagination Skip Calculation
**File:** `food-ordering-backend/src/controllers/RestaurantController.ts`
**Lines:** 57-58

**Problem:** The pagination skip calculation is incorrect.

```typescript
const pageSize = 10;
const skip = page * pageSize;
```

**Task:**
1. If `page = 1` and `pageSize = 10`, how many documents will be skipped?
2. What results will the user see on page 1?
3. Write the correct formula for calculating skip.

---

### Question 1.7: Total Pages Calculation
**File:** `food-ordering-backend/src/controllers/RestaurantController.ts`
**Line:** 73

**Problem:** The total pages calculation uses incorrect rounding.

```typescript
pages: Math.floor(total / pageSize),
```

**Task:**
1. If there are 25 total restaurants and pageSize is 10, how many pages should there be?
2. What does `Math.floor(25 / 10)` return?
3. What function should be used instead?

---

### Question 1.8: Order Schema Type Error
**File:** `food-ordering-backend/src/models/order.ts`
**Line:** 16

**Problem:** The cart item `name` field has incorrect type.

```typescript
cartItems: [
  {
    menuItemId: { type: String, required: false },
    quantity: { type: String, required: false },
    name: { type: Number, required: false },  // Error here
  },
],
```

**Task:** What type should the `name` field be, and why?

---

### Question 1.9: Missing Order Status
**File:** `food-ordering-backend/src/models/order.ts`
**Line:** 22

**Problem:** The order status enum is missing a value that's used in the frontend.

```typescript
status: {
  type: String,
  enum: ["placed", "paid", "inProgress", "outForDelivery"],
},
```

**Task:**
1. What status value is missing from this enum?
2. Look at `OrderController.ts` line 26 - what status does the `getMyOrders` function filter for that doesn't exist in the enum?

---

### Question 1.10: User Creation Function Does Nothing
**File:** `food-ordering-backend/src/controllers/MyUserController.ts`
**Lines:** 18-28

**Problem:** The `createCurrentUser` function doesn't actually create anything.

```typescript
const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const existingUser = await User.findById(req.userId);
    if (existingUser) {
      return res.status(200).send();
    }
    res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
};
```

**Task:**
1. What does this function actually do?
2. What's missing that would make it actually create a user?

---

## 2. Frontend Logic Errors

### Question 2.1: Add to Cart Logic Completely Inverted
**File:** `food-ordering-frontend/src/pages/DetailPage.tsx`
**Lines:** 47-79

**Problem:** The `addToCart` function has multiple inverted logic errors.

```typescript
const addToCart = (menuItem: MenuItemType) => {
  setCartItems((prevCartItems) => {
    const existingCartItem = prevCartItems.find(
      (cartItem) => cartItem._id !== menuItem._id  // Error 1
    );

    let updatedCartItems;

    if (!existingCartItem) {  // Error 2
      updatedCartItems = prevCartItems.map((cartItem) =>
        cartItem._id === menuItem._id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }  // Error 3
          : cartItem
      );
    } else {
      updatedCartItems = [
        ...prevCartItems,
        {
          _id: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 0,  // Error 4
        },
      ];
    }
    // ...
  });
};
```

**Task:** Identify and fix ALL FOUR errors:
1. What's wrong with the find condition on line 49-50?
2. What's wrong with the if condition on line 55?
3. What's wrong with the quantity calculation on line 58?
4. What should the initial quantity be when adding a new item (line 68)?

---

### Question 2.2: Remove from Cart Keeps Instead of Removes
**File:** `food-ordering-frontend/src/pages/DetailPage.tsx`
**Lines:** 82-95

**Problem:** The `removeFromCart` function keeps items instead of removing them.

```typescript
const removeFromCart = (cartItem: CartItem) => {
  setCartItems((prevCartItems) => {
    const updatedCartItems = prevCartItems.filter(
      (item) => cartItem._id === item._id  // Error here
    );
    // ...
  });
};
```

**Task:**
1. What does `filter` with `===` do in this context?
2. What should the condition be to actually remove the item?

---

### Question 2.3: Quantity Update Prevention
**File:** `food-ordering-frontend/src/pages/DetailPage.tsx`
**Lines:** 97-109

**Problem:** The quantity update function has two errors.

```typescript
const updateCartItemQuantity = (cartItem: CartItem, newQuantity: number) => {
  if (newQuantity > 1) return;  // Error 1
  setCartItems((prevCartItems) => {
    const updatedCartItems = prevCartItems.map((item) =>
      item._id !== cartItem._id ? { ...item, quantity: newQuantity } : item  // Error 2
    );
    // ...
  });
};
```

**Task:**
1. What effect does `if (newQuantity > 1) return` have?
2. What's wrong with the map condition `item._id !== cartItem._id`?

---

### Question 2.4: Pagination Navigation Reversed
**File:** `food-ordering-frontend/src/components/PaginationSelector.tsx`
**Lines:** 29, 39, 41, 48

**Problem:** The pagination component has multiple errors.

```typescript
// Line 29 - Previous button
<PaginationPrevious onClick={() => onPageChange(page + 1)} />

// Line 39 - Active page indicator
isActive={page !== number}

// Line 41 - Page number display
{number}

// Line 48 - Next button
<PaginationNext onClick={() => onPageChange(page - 1)} />
```

**Task:** Identify and fix all errors:
1. What should the Previous button do to the page number?
2. What should the Next button do to the page number?
3. When should `isActive` be true?
4. If pages are 0-indexed internally but users expect 1-indexed display, what should be shown?

---

### Question 2.5: Restaurant API Logic Errors
**File:** `food-ordering-frontend/src/api/RestaurantApi.tsx`
**Lines:** 10, 13-14, 24

**Problem:** The restaurant API has multiple critical errors.

```typescript
// Line 10 - Wrong endpoint
const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}`);

// Lines 13-14 - Inverted response check
if (response.ok) {
  throw new Error("Failed to get restaurant");
}

// Line 24 - Inverted enabled condition
enabled: !restaurantId,
```

**Task:**
1. The backend route is `/api/restaurant/:restaurantId` (singular). What's wrong with line 10?
2. `response.ok` is true when the request succeeds. What's wrong with the if condition?
3. `useQuery` should run when `restaurantId` exists. What's wrong with the `enabled` property?

---

### Question 2.6: Order Summary Calculation Errors
**File:** `food-ordering-frontend/src/components/OrderSummary.tsx`
**Lines:** 25-30

**Problem:** The total cost calculation has two mathematical errors.

```typescript
const getTotalCost = () => {
  const totalInPence = cartItems.reduce(
    (total, cartItem) => total + cartItem.price + cartItem.quantity,  // Error 1
    0
  );

  const totalWithDelivery = totalInPence - restaurant.deliveryPrice;  // Error 2

  return (totalWithDelivery / 100).toFixed(2);
};
```

**Task:**
1. What mathematical operation should be used between `cartItem.price` and `cartItem.quantity`?
2. Should delivery price be added or subtracted from the total?

---

### Question 2.7: Search Result Card Route and Display Errors
**File:** `food-ordering-frontend/src/components/SearchResultCard.tsx`
**Lines:** 13, 25, 32, 36

**Problem:** The search result card has multiple display and routing errors.

```typescript
// Line 13 - Wrong route
<Link to={`/details/${restaurant._id}`}>

// Line 25 - Always shows dot
{index < restaurant.cuisines.length && <Dot />}

// Line 32 - Wrong time unit
{restaurant.estimatedDeliveryTime} hours

// Line 36 - Wrong price calculation
Delivery from £{(restaurant.deliveryPrice * 100).toFixed(2)}
```

**Task:**
1. The actual route is `/detail/:restaurantId` (no 's'). What needs to change?
2. How should the dot separator condition be fixed to not show after the last cuisine?
3. Estimated delivery time is stored in minutes. What should the display text be?
4. `deliveryPrice` is stored in pence. What operation should be used to display in pounds?

---

### Question 2.8: Form Data Not Loading for Editing
**File:** `food-ordering-frontend/src/forms/manage-restaurant-form/ManageRestaurantForm.tsx`
**Lines:** 75-77, 81, 86

**Problem:** The restaurant form doesn't load existing data when editing.

```typescript
useEffect(() => {
  if (restaurant) {  // Error 1
    return;
  }

  const deliveryPriceFormatted = Number(
    (restaurant.deliveryPrice * 100).toFixed(2)  // Error 2
  );

  const menuItemsFormatted = restaurant.menuItems.map((item) => ({
    ...item,
    price: Number((item.price * 100).toFixed(2)),  // Error 3
  }));
  // ...
}, [restaurant]);
```

**Task:**
1. What's wrong with `if (restaurant) { return; }`?
2. Prices are stored in pence. To display in the form as pounds (e.g., 5.00), should we multiply or divide by 100?

---

### Question 2.9: Order Status Icons Mismatched
**File:** `food-ordering-frontend/src/pages/OrderStatusPage.tsx`
**Lines:** 164-177

**Problem:** The status icons don't match the logical meaning of each status.

```typescript
const getStatusIcon = (status: string) => {
  switch (status) {
    case "placed":
      return <CheckCircle className="h-4 w-4" />;  // Should be pending/alert
    case "paid":
      return <AlertCircle className="h-4 w-4" />;  // Should be check/success
    case "inProgress":
      return <Truck className="h-4 w-4" />;        // Should be cooking/chef
    case "outForDelivery":
      return <ChefHat className="h-4 w-4" />;      // Should be truck/delivery
    case "delivered":
      return <AlertCircle className="h-4 w-4" />;  // Should be check/success
  }
};
```

**Task:** Match each status with the appropriate icon:
- `placed` (order placed but not paid)
- `paid` (payment confirmed)
- `inProgress` (being prepared)
- `outForDelivery` (on the way)
- `delivered` (completed)

---

### Question 2.10: Order Status Colors Illogical
**File:** `food-ordering-frontend/src/pages/OrderStatusPage.tsx`
**Lines:** 179-194

**Problem:** The status colors don't match the logical meaning.

```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case "placed":
      return "bg-green-100 text-green-800";  // Green for unpaid?
    case "paid":
      return "bg-gray-100 text-gray-800";    // Gray for success?
    case "inProgress":
      return "bg-orange-100 text-orange-800";
    case "outForDelivery":
      return "bg-yellow-100 text-yellow-800";
    case "delivered":
      return "bg-red-100 text-red-800";      // Red for completed?
    default:
      return "bg-gray-100 text-gray-800";
  }
};
```

**Task:** Assign appropriate colors for each status considering UX conventions:
- Green typically means success/complete
- Red typically means error/warning
- Yellow/Orange typically means in progress/pending
- Gray typically means neutral/inactive

---

### Question 2.11: Date Formatting Error
**File:** `food-ordering-frontend/src/pages/OrderStatusPage.tsx`
**Lines:** 159, 161

**Problem:** The date formatting has errors.

```typescript
const formatDateForDisplay = (dateString: string) => {
  const date = new Date(dateString);
  const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth()).padStart(2, "0");  // Error 1
  const year = date.getFullYear();
  return `${weekday}, ${month}.${day}.${year}`;  // Error 2
};
```

**Task:**
1. `getMonth()` returns 0-11. What's missing to display January as "01"?
2. For UK date format, should it be `month.day.year` or `day.month.year`?

---

## 3. UI/UX Issues

### Question 3.1: Debug Console Logs in Production
**File:** `food-ordering-frontend/src/components/EnhancedOrdersTab.tsx`
**Lines:** 200-216

**Problem:** Debug console.log statements are left in production code.

```typescript
console.log("Filtered orders:", filteredOrders);
console.log("Grouped orders:", groupedOrders);
console.log("Sorted grouped orders:", sortedGroupedOrders);
console.log("Order dates:", filteredOrders.map((order) => ({...})));
```

**Task:**
1. Why shouldn't console.log statements be in production code?
2. What are better alternatives for debugging in production?

---

### Question 3.2: Hardcoded Fake Statistics
**File:** `food-ordering-frontend/src/components/EnhancedOrdersTab.tsx`
**Lines:** 229-230, 244

**Problem:** Statistics show fake hardcoded values.

```typescript
<p className="text-xs text-muted-foreground">
  +12% from last month
</p>
// ...
<p className="text-xs text-muted-foreground">+8% from last month</p>
```

**Task:**
1. What's wrong with displaying fake statistics to users?
2. What should be done if the real data isn't available?

---

### Question 3.3: Cart Cleared on Page Leave
**File:** `food-ordering-frontend/src/pages/DetailPage.tsx`
**Lines:** 35-40

**Problem:** Cart is cleared when user navigates away.

```typescript
useEffect(() => {
  return () => {
    clearCart(restaurantId);
    setCartItems([]);
  };
}, [restaurantId]);
```

**Task:**
1. What happens if a user accidentally navigates away before checkout?
2. Is this good or bad UX? Explain your reasoning.
3. What would be a better approach?

---

## 4. API & Data Issues

### Question 4.1: Order Status Mismatch Between Frontend and Backend
**File (Backend):** `food-ordering-backend/src/models/order.ts`
**File (Frontend):** `food-ordering-frontend/src/pages/OrderStatusPage.tsx`

**Problem:** Frontend filters for statuses that don't exist in the backend enum.

Backend enum:
```typescript
enum: ["placed", "paid", "inProgress", "outForDelivery"]
```

Frontend filter (line 128-134):
```typescript
const visibleStatuses = [
  "placed",
  "paid",
  "inProgress",
  "outForDelivery",
  "delivered",  // Not in backend enum!
];
```

**Task:**
1. What happens when an order is marked as "delivered" if it's not in the backend enum?
2. How should this be synchronized?

---

### Question 4.2: Type Mismatch - Quantity as String vs Number
**Files:** Multiple

**Problem:** `quantity` is stored as String in the database but used as Number in calculations.

Backend model:
```typescript
quantity: { type: String, required: false },
```

Frontend usage:
```typescript
quantity: cartItem.quantity  // Used in calculations expecting Number
```

**Task:**
1. What type should `quantity` be stored as, and why?
2. What could go wrong when doing math on string types?

---

## 5. Security Issues

### Question 5.1: Authentication Always Fails
**File:** `food-ordering-backend/src/middleware/auth.ts`

**Problem:** Due to the logic errors identified in Question 1.1, authentication will always fail for legitimate users.

**Task:**
1. Trace through the code with a valid Bearer token and explain why it fails.
2. What are the security implications of broken authentication?

---

### Question 5.2: No Input Validation on Order Status Update
**File:** `food-ordering-backend/src/controllers/MyRestaurantController.ts`
**Lines:** 120-150

**Problem:** The order status update accepts any string value.

```typescript
const { status } = req.body;
// ...
order.status = status;  // No validation!
await order.save();
```

**Task:**
1. What could happen if someone sends an invalid status like "cancelled" or "refunded"?
2. How should the status be validated before saving?

---

## Scoring Guide

| Section | Questions | Points Each | Total |
|---------|-----------|-------------|-------|
| Backend Logic | 10 | 10 | 100 |
| Frontend Logic | 11 | 10 | 110 |
| UI/UX Issues | 3 | 10 | 30 |
| API & Data | 2 | 10 | 20 |
| Security | 2 | 20 | 40 |
| **Total** | **28** | - | **300** |

---

## Grading Criteria

- **Identification (40%)**: Correctly identifying the error
- **Explanation (30%)**: Explaining why it's an error and its impact
- **Solution (30%)**: Providing a correct fix

---

## Notes for Assessors

1. Some errors are intentionally obvious, while others require deeper understanding
2. Candidates should be evaluated on their ability to trace code flow
3. Look for understanding of JavaScript/TypeScript quirks (truthy/falsy, type coercion)
4. Frontend errors often cascade - one fix may reveal others
5. Security awareness is important for backend developers

---

*Generated for assessment purposes. All errors are intentional.*
