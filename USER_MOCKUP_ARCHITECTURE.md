# User Mockup System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER MOCKUP SYSTEM                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  1. DATA LAYER                                                   │
│  ━━━━━━━━━━━━━                                                   │
│                                                                   │
│  📄 src/assets/data/users.json                                   │
│      ┌──────────────────────────────────────┐                   │
│      │ User 1: Alex (Gold, 7500 pts)       │                   │
│      │ User 2: María (Platinum, 15420 pts) │                   │
│      │ User 3: Carlos (Silver, 3200 pts)   │                   │
│      └──────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. SERVICE LAYER                                                │
│  ━━━━━━━━━━━━━━━━                                                │
│                                                                   │
│  🔧 src/services/userService.js                                  │
│      ┌──────────────────────────────────────┐                   │
│      │ • getUserById()                      │                   │
│      │ • authenticateUser()                 │                   │
│      │ • updateUserProfile()                │                   │
│      │ • addUserPoints()                    │                   │
│      │ • getCurrentUser()                   │                   │
│      │ • saveCurrentUser()                  │                   │
│      └──────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. LOADER LAYER                                                 │
│  ━━━━━━━━━━━━━━━                                                 │
│                                                                   │
│  📥 src/loaders/userLoader.js                                    │
│      ┌──────────────────────────────────────┐                   │
│      │ • userProfileLoader()                │                   │
│      │   → Fetches user before page render  │                   │
│      │ • userByIdLoader()                   │                   │
│      │   → Fetches specific user            │                   │
│      └──────────────────────────────────────┘                   │
│                                                                   │
│  🔗 Used in App.jsx Router:                                      │
│      {                                                            │
│        path: "profile",                                           │
│        element: <UserProfile />,                                  │
│        loader: userProfileLoader                                  │
│      }                                                            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. CONTEXT LAYER                                                │
│  ━━━━━━━━━━━━━━━━                                                │
│                                                                   │
│  🌐 src/context/UserContext.jsx                                  │
│      ┌──────────────────────────────────────┐                   │
│      │ State:                               │                   │
│      │  • user (current user object)        │                   │
│      │  • loading                           │                   │
│      │                                      │                   │
│      │ Methods:                             │                   │
│      │  • login(userData)                   │                   │
│      │  • logout()                          │                   │
│      │  • updatePersonal(data)              │                   │
│      │  • updateAddress(data)               │                   │
│      │  • updatePreferences(data)           │                   │
│      │  • updateGaming(data)                │                   │
│      │  • addPoints(points)                 │                   │
│      └──────────────────────────────────────┘                   │
│                                                                   │
│  🪝 src/hooks/useUser.js                                         │
│      → Custom hook for easy context access                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. PAGE LAYER                                                   │
│  ━━━━━━━━━━━━━                                                   │
│                                                                   │
│  📄 src/pages/UserProfile.jsx                                    │
│      ┌──────────────────────────────────────┐                   │
│      │ 1. useLoaderData() to get user       │                   │
│      │ 2. Wraps content in <UserProvider>   │                   │
│      │ 3. Displays user stats & level       │                   │
│      │ 4. Renders tab components            │                   │
│      └──────────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  6. COMPONENT LAYER                                              │
│  ━━━━━━━━━━━━━━━━━━                                              │
│                                                                   │
│  All tabs use: const { user, updateXXX } = useUser()            │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 🔹 ProfilePersonalTab      → user.personal               │ │
│  │ 🔹 ProfileAddressTab       → user.address                │ │
│  │ 🔹 ProfilePreferencesTab   → user.preferences            │ │
│  │ 🔹 ProfileGamingTab        → user.gaming                 │ │
│  │ 🔹 ProfileCouponsTab       → user.coupons, user.stats    │ │
│  │ 🔹 ProfileSecurityTab      → Standalone                   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  7. DEVELOPER UTILITIES                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━                                          │
│                                                                   │
│  🛠️ src/utils/userSwitcher.js                                   │
│      ┌──────────────────────────────────────┐                   │
│      │ Console Commands:                    │                   │
│      │  • switchToUser(1/2/3)              │                   │
│      │  • whoAmI()                          │                   │
│      │  • logoutUser()                      │                   │
│      └──────────────────────────────────────┘                   │
│                                                                   │
│  📖 src/utils/userMockupInfo.js                                  │
│      → Displays help guide on app load                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  DATA FLOW EXAMPLE                                               │
│  ━━━━━━━━━━━━━━━━━━                                              │
│                                                                   │
│  User navigates to /profile                                      │
│           ↓                                                       │
│  Router calls userProfileLoader()                                │
│           ↓                                                       │
│  Loader calls userService.getUserById()                          │
│           ↓                                                       │
│  Service reads from users.json                                   │
│           ↓                                                       │
│  User data returned to page                                      │
│           ↓                                                       │
│  UserProfile wraps in UserProvider                               │
│           ↓                                                       │
│  Components use useUser() hook                                   │
│           ↓                                                       │
│  User sees data, can edit                                        │
│           ↓                                                       │
│  On save: updatePersonal() called                                │
│           ↓                                                       │
│  Context updates state & localStorage                            │
│           ↓                                                       │
│  UI reflects changes immediately                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STORAGE STRATEGY                                                │
│  ━━━━━━━━━━━━━━━━━                                               │
│                                                                   │
│  localStorage Key: "currentUser"                                 │
│                                                                   │
│  Stored on:                                                      │
│   • User login                                                   │
│   • Profile updates                                              │
│   • User switch (dev tool)                                       │
│                                                                   │
│  Retrieved on:                                                   │
│   • App initialization                                           │
│   • Loader execution                                             │
│   • Context creation                                             │
└─────────────────────────────────────────────────────────────────┘
```

## Key Principles

1. **Single Source of Truth**: users.json → Service → Context
2. **React Router Integration**: Loaders fetch data before render
3. **Context for State**: UserContext manages global user state
4. **Hook for Access**: useUser() provides clean component API
5. **LocalStorage Persistence**: Current user survives page reloads
6. **Developer Friendly**: Console commands for easy testing

## Testing Flow

```
1. Open http://localhost:5174/profile
2. Open Console (F12)
3. Run: switchToUser(2)
        ↓
   Page reloads with María's data
        ↓
4. All tabs show María's info
5. Edit some fields
6. Save changes
        ↓
   Data updates in context & localStorage
        ↓
7. Navigate away and back
        ↓
   Data persists!
```
