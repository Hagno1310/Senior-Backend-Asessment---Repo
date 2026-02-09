# Restaurant Food Ordering System - Debug Assessment

Find and fix the bugs in the following files.

---

## 1. Backend Bugs

### Bug 1.1: Authentication Middleware
**File:** `food-ordering-backend/src/middleware/auth.ts`
**Lines:** 27, 33-34

```typescript
if (authHeader || authHeader.startsWith("Bearer ")) {
  token = authHeader.substring(7);
}
// ...
if (token) {
  return res.status(401).json({ message: "unauthorized" });
}
```

**Fix the logic errors in this authentication code.**

---

### Bug 1.2: Restaurant Creation Check
**File:** `food-ordering-backend/src/controllers/MyRestaurantController.ts`
**Lines:** 24-28

```typescript
const existingRestaurant = await Restaurant.findOne({ user: req.userId });

if (!existingRestaurant) {
  return res
    .status(409)
    .json({ message: "User restaurant already exists" });
}
```

**Fix the condition to properly check if a restaurant already exists.**

---

### Bug 1.3: Price Conversion
**File:** `food-ordering-backend/src/controllers/MyRestaurantController.ts`
**Lines:** 32-34, 38

```typescript
const deliveryPrice = req.body.deliveryPrice
  ? Math.round(parseFloat(req.body.deliveryPrice) / 100)
  : 0;

price: item.price ? Math.round(parseFloat(item.price) / 100) : 0,
```

**Fix the price conversion to store prices in pence correctly.**

---

### Bug 1.4: MongoDB Query Operator
**File:** `food-ordering-backend/src/controllers/RestaurantController.ts`
**Line:** 46

```typescript
query["cuisines"] = { $any: cuisinesArray };
```

**Fix the invalid MongoDB operator.**

---

### Bug 1.5: Search Query Logic
**File:** `food-ordering-backend/src/controllers/RestaurantController.ts`
**Lines:** 51-54

```typescript
query["$and"] = [
  { restaurantName: searchRegex },
  { cuisines: { $in: [searchRegex] } },
];
```

**Fix the query to search by restaurant name OR cuisine (not AND).**

---

### Bug 1.6: Pagination Skip
**File:** `food-ordering-backend/src/controllers/RestaurantController.ts`
**Line:** 58

```typescript
const skip = page * pageSize;
```

**Fix the skip calculation for 1-indexed pages.**

---

### Bug 1.7: Total Pages Calculation
**File:** `food-ordering-backend/src/controllers/RestaurantController.ts`
**Line:** 73

```typescript
pages: Math.floor(total / pageSize),
```

**Fix the total pages calculation to include partial pages.**

---

### Bug 1.8: Order Schema Type
**File:** `food-ordering-backend/src/models/order.ts`
**Line:** 16

```typescript
name: { type: Number, required: false },
```

**Fix the data type for cart item name.**

---

### Bug 1.9: Missing Order Status
**File:** `food-ordering-backend/src/models/order.ts`
**Line:** 22

```typescript
enum: ["placed", "paid", "inProgress", "outForDelivery"],
```

**Add the missing order status used by the frontend.**

---

### Bug 1.10: Create User Function
**File:** `food-ordering-backend/src/controllers/MyUserController.ts`
**Lines:** 18-28

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

**Fix the function to actually create a new user when one doesn't exist.**

---

## 2. Frontend Bugs

### Bug 2.1: Add to Cart Function
**File:** `food-ordering-frontend/src/pages/DetailPage.tsx`
**Lines:** 47-79

```typescript
const addToCart = (menuItem: MenuItemType) => {
  setCartItems((prevCartItems) => {
    const existingCartItem = prevCartItems.find(
      (cartItem) => cartItem._id !== menuItem._id
    );

    let updatedCartItems;

    if (!existingCartItem) {
      updatedCartItems = prevCartItems.map((cartItem) =>
        cartItem._id === menuItem._id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
    } else {
      updatedCartItems = [
        ...prevCartItems,
        {
          _id: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 0,
        },
      ];
    }
    // ...
  });
};
```

**Fix all logic errors in the add to cart function.**

---

### Bug 2.2: Remove from Cart
**File:** `food-ordering-frontend/src/pages/DetailPage.tsx`
**Lines:** 82-95

```typescript
const removeFromCart = (cartItem: CartItem) => {
  setCartItems((prevCartItems) => {
    const updatedCartItems = prevCartItems.filter(
      (item) => cartItem._id === item._id
    );
    // ...
  });
};
```

**Fix the filter condition to remove the item instead of keeping it.**

---

### Bug 2.3: Update Quantity Function
**File:** `food-ordering-frontend/src/pages/DetailPage.tsx`
**Lines:** 97-109

```typescript
const updateCartItemQuantity = (cartItem: CartItem, newQuantity: number) => {
  if (newQuantity > 1) return;
  setCartItems((prevCartItems) => {
    const updatedCartItems = prevCartItems.map((item) =>
      item._id !== cartItem._id ? { ...item, quantity: newQuantity } : item
    );
    // ...
  });
};
```

**Fix the quantity validation and update logic.**

---

### Bug 2.4: Pagination Component
**File:** `food-ordering-frontend/src/components/PaginationSelector.tsx`
**Lines:** 29, 39, 41, 48

```typescript
<PaginationPrevious onClick={() => onPageChange(page + 1)} />

isActive={page !== number}

{number}

<PaginationNext onClick={() => onPageChange(page - 1)} />
```

**Fix the pagination navigation and active state logic.**

---

### Bug 2.5: Restaurant API
**File:** `food-ordering-frontend/src/api/RestaurantApi.tsx`
**Lines:** 10, 13-14, 24

```typescript
const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}`);

if (response.ok) {
  throw new Error("Failed to get restaurant");
}

enabled: !restaurantId,
```

**Fix the API endpoint, response check, and enabled condition.**

---

### Bug 2.6: Order Total Calculation
**File:** `food-ordering-frontend/src/components/OrderSummary.tsx`
**Lines:** 25-30

```typescript
const getTotalCost = () => {
  const totalInPence = cartItems.reduce(
    (total, cartItem) => total + cartItem.price + cartItem.quantity,
    0
  );

  const totalWithDelivery = totalInPence - restaurant.deliveryPrice;

  return (totalWithDelivery / 100).toFixed(2);
};
```

**Fix the total calculation formula.**

---

### Bug 2.7: Search Result Card
**File:** `food-ordering-frontend/src/components/SearchResultCard.tsx`
**Lines:** 13, 25, 32, 36

```typescript
<Link to={`/details/${restaurant._id}`}>

{index < restaurant.cuisines.length && <Dot />}

{restaurant.estimatedDeliveryTime} hours

Delivery from £{(restaurant.deliveryPrice * 100).toFixed(2)}
```

**Fix the route path, cuisine separator, time unit, and price display.**

---

### Bug 2.8: Restaurant Form Data Loading
**File:** `food-ordering-frontend/src/forms/manage-restaurant-form/ManageRestaurantForm.tsx`
**Lines:** 75-77, 81, 86

```typescript
useEffect(() => {
  if (restaurant) {
    return;
  }

  const deliveryPriceFormatted = Number(
    (restaurant.deliveryPrice * 100).toFixed(2)
  );

  const menuItemsFormatted = restaurant.menuItems.map((item) => ({
    ...item,
    price: Number((item.price * 100).toFixed(2)),
  }));
  // ...
}, [restaurant]);
```

**Fix the condition and price conversion for form data loading.**

---

### Bug 2.9: Status Icons
**File:** `food-ordering-frontend/src/pages/OrderStatusPage.tsx`
**Lines:** 164-177

```typescript
const getStatusIcon = (status: string) => {
  switch (status) {
    case "placed":
      return <CheckCircle className="h-4 w-4" />;
    case "paid":
      return <AlertCircle className="h-4 w-4" />;
    case "inProgress":
      return <Truck className="h-4 w-4" />;
    case "outForDelivery":
      return <ChefHat className="h-4 w-4" />;
    case "delivered":
      return <AlertCircle className="h-4 w-4" />;
  }
};
```

**Fix the icons to match each order status logically.**

---

### Bug 2.10: Status Colors
**File:** `food-ordering-frontend/src/pages/OrderStatusPage.tsx`
**Lines:** 179-194

```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case "placed":
      return "bg-green-100 text-green-800";
    case "paid":
      return "bg-gray-100 text-gray-800";
    case "inProgress":
      return "bg-orange-100 text-orange-800";
    case "outForDelivery":
      return "bg-yellow-100 text-yellow-800";
    case "delivered":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
```

**Fix the colors to match UX conventions (green=success, red=error).**

---

### Bug 2.11: Date Formatting
**File:** `food-ordering-frontend/src/pages/OrderStatusPage.tsx`
**Lines:** 159, 161

```typescript
const month = String(date.getMonth()).padStart(2, "0");
return `${weekday}, ${month}.${day}.${year}`;
```

**Fix the month value and date format order.**

---

## 3. Code Quality Issues

### Bug 3.1: Debug Logs in Production
**File:** `food-ordering-frontend/src/components/EnhancedOrdersTab.tsx`
**Lines:** 200-216

```typescript
console.log("Filtered orders:", filteredOrders);
console.log("Grouped orders:", groupedOrders);
console.log("Sorted grouped orders:", sortedGroupedOrders);
```

**Remove debug console.log statements.**

---

### Bug 3.2: Hardcoded Statistics
**File:** `food-ordering-frontend/src/components/EnhancedOrdersTab.tsx`
**Lines:** 229-230, 244

```typescript
<p className="text-xs text-muted-foreground">
  +12% from last month
</p>
```

**Remove or replace hardcoded fake statistics.**

---

## Scoring

| Section | Bugs | Points Each | Total |
|---------|------|-------------|-------|
| Backend | 10 | 10 | 100 |
| Frontend | 11 | 10 | 110 |
| Code Quality | 2 | 5 | 10 |
| **Total** | **23** | - | **220** |

---

*All bugs are intentional for assessment purposes.*
