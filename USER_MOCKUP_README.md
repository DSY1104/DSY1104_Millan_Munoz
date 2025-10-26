# User Mockup System

This document describes the user mockup system implemented for the UserProfile page and its components.

## Overview

The system provides a complete user data management solution with:

- **3 Mock Users** with complete profile data
- **Data Layer**: JSON file with user data
- **Service Layer**: User operations and API simulation
- **Context Layer**: React Context for state management
- **Loader Layer**: React Router data loading
- **Components**: Updated profile tabs using the context

## Architecture

```
src/
├── assets/data/
│   └── users.json          # Mock user data (3 users)
├── services/
│   └── userService.js      # User CRUD operations
├── loaders/
│   └── userLoader.js       # React Router loaders
├── context/
│   └── UserContext.jsx     # User state management
├── hooks/
│   └── useUser.js          # Custom hook for user context
├── utils/
│   └── userSwitcher.js     # Utility to switch between users
└── pages/
    └── UserProfile.jsx     # Main profile page (uses loader)
```

## Mock Users

### User 1: Alex Rodriguez (ID: 1)

- **Username**: alexgamer95
- **Email**: alex.rodriguez@levelup.cl
- **Level**: Gold (7,500 points)
- **Style**: Casual RPG/Strategy gamer
- **Stats**: 24 purchases, 12 reviews, 8 favorites
- **Platforms**: PC (Twitch, YouTube)
- **Location**: Santiago, Región Metropolitana

### User 2: María González (ID: 2)

- **Username**: mariagamer
- **Email**: maria.gonzalez@levelup.cl
- **Level**: Platinum (15,420 points)
- **Style**: Pro FPS/Competitive gamer & Streamer
- **Stats**: 42 purchases, 28 reviews, 15 favorites
- **Platforms**: Console (Twitch, YouTube, Kick)
- **Location**: Valparaíso

### User 3: Carlos Silva (ID: 3)

- **Username**: carloslevel
- **Email**: carlos.silva@levelup.cl
- **Level**: Silver (3,200 points)
- **Style**: Indie/Retro game collector
- **Stats**: 15 purchases, 7 reviews, 22 favorites
- **Platforms**: Both PC & Console (YouTube)
- **Location**: Concepción, Biobío

## Data Structure

Each user object contains:

```json
{
  "id": 1,
  "username": "alexgamer95",
  "email": "alex.rodriguez@levelup.cl",
  "password": "demo123",
  "personal": {
    "firstName": "Alex",
    "lastName": "Rodriguez",
    "phone": "+56 9 1234 5678",
    "birthdate": "1995-03-15",
    "bio": "...",
    "avatar": null,
    "memberSince": "2022"
  },
  "address": {
    "addressLine1": "Av. Providencia 1234",
    "addressLine2": "Departamento 56",
    "city": "Santiago",
    "region": "metropolitan",
    "postalCode": "7500000",
    "country": "chile",
    "deliveryNotes": "..."
  },
  "preferences": {
    "favoriteCategories": ["JM", "CG", "AC"],
    "preferredPlatform": "pc",
    "gamingHours": "16-30",
    "notifyOffers": true,
    "notifyNewProducts": true,
    "notifyRestocks": false,
    "notifyNewsletter": true
  },
  "gaming": {
    "gamerTag": "AlexGamer95",
    "favoriteGenre": "rpg",
    "skillLevel": "advanced",
    "streamingPlatforms": ["twitch", "youtube"],
    "favoriteGames": "..."
  },
  "stats": {
    "level": "Gold",
    "points": 7500,
    "purchases": 24,
    "reviews": 12,
    "favorites": 8
  },
  "coupons": [...]
}
```

## Usage

### 1. Loading User Data (Automatic)

The user profile page automatically loads data via React Router loader:

```jsx
// App.jsx
import { userProfileLoader } from "./loaders/userLoader";

const router = createBrowserRouter([
  {
    path: "profile",
    element: <UserProfile />,
    loader: userProfileLoader, // Loads user data
  },
]);
```

### 2. Accessing User Data in Components

Use the `useUser` hook in any component:

```jsx
import { useUser } from "../../hooks/useUser";

function MyComponent() {
  const { user, updatePersonal, updateAddress } = useUser();

  // Access user data
  console.log(user.personal.firstName);

  // Update user data
  await updatePersonal({ firstName: "New Name" });
}
```

### 3. Switching Between Users (Development)

Open browser console and use:

```javascript
// Switch to User 1 (Alex)
switchToUser(1);

// Switch to User 2 (María)
switchToUser(2);

// Switch to User 3 (Carlos)
switchToUser(3);

// Logout current user
logoutUser();
```

## Services Available

### userService.js

- `getUserById(userId)` - Get user by ID
- `getUserByUsername(username)` - Get user by username
- `getUserByEmail(email)` - Get user by email
- `authenticateUser(emailOrUsername, password)` - Login
- `updateUserProfile(userId, updates)` - Update profile
- `addUserPoints(userId, points)` - Add points to user
- `redeemCoupon(userId, couponId)` - Redeem a coupon
- `getCurrentUser()` - Get current user from localStorage
- `saveCurrentUser(user)` - Save user to localStorage

## Context Methods

The UserContext provides:

```javascript
{
  user,              // Current user object
  loading,           // Loading state
  login(userData),   // Login user
  logout(),          // Logout user
  updateUser(updates),      // Update any user field
  updatePersonal(data),     // Update personal info
  updateAddress(data),      // Update address
  updatePreferences(data),  // Update preferences
  updateGaming(data),       // Update gaming profile
  addPoints(points),        // Add points
}
```

## Components Updated

All profile tabs now use the user context:

1. **ProfilePersonalTab** - Uses `user.personal` and `updatePersonal()`
2. **ProfileAddressTab** - Uses `user.address` and `updateAddress()`
3. **ProfilePreferencesTab** - Uses `user.preferences` and `updatePreferences()`
4. **ProfileGamingTab** - Uses `user.gaming` and `updateGaming()`
5. **ProfileCouponsTab** - Uses `user.coupons` and `user.stats.points`
6. **ProfileSecurityTab** - Standalone (password management)

## Level System

Users have different levels based on points:

| Level    | Points Range    | Next Level | Icon |
| -------- | --------------- | ---------- | ---- |
| Bronze   | 0 - 999         | Silver     | 🥉   |
| Silver   | 1,000 - 4,999   | Gold       | 🥈   |
| Gold     | 5,000 - 9,999   | Platinum   | 🥇   |
| Platinum | 10,000 - 19,999 | Diamond    | 💎   |
| Diamond  | 20,000+         | Max        | 💠   |

The progress bar and level info are calculated dynamically in `UserProfile.jsx`.

## Testing

### Test Different Users

1. Go to `/profile` in your browser
2. Open console
3. Run `switchToUser(2)` to switch to María (Platinum user)
4. Check that all tabs show her data
5. Edit some fields and save
6. Switch to another user: `switchToUser(3)`

### Verify Data Persistence

1. Edit user data in any tab
2. Navigate away from the profile page
3. Return to `/profile`
4. Data should persist (stored in localStorage)

## Default Behavior

If no user is logged in, the system defaults to User 1 (Alex Rodriguez). This ensures the profile page always has data to display during development.

## Future Enhancements

- Connect to real backend API
- Add avatar upload functionality
- Implement user registration flow
- Add authentication with JWT tokens
- Add order history integration
- Add wishlist/favorites management
- Add social features (friends, achievements)

## Password

All demo users have the same password: `demo123`

Use this for testing authentication flows.

---

**Last Updated**: October 26, 2025
