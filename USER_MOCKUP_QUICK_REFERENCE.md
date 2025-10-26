# 🎮 User Mockup Quick Reference

## Console Commands (Browser Console)

```javascript
// Switch to different users
switchToUser(1); // Alex Rodriguez - Gold Level
switchToUser(2); // María González - Platinum Level
switchToUser(3); // Carlos Silva - Silver Level

// Check current user
whoAmI();

// Logout
logoutUser();
```

## Test URLs

- Profile Page: `http://localhost:5174/profile`

## File Locations

| File                          | Purpose               |
| ----------------------------- | --------------------- |
| `src/assets/data/users.json`  | 3 mock users data     |
| `src/services/userService.js` | User operations       |
| `src/loaders/userLoader.js`   | React Router loaders  |
| `src/context/UserContext.jsx` | User state management |
| `src/hooks/useUser.js`        | useUser hook          |
| `src/utils/userSwitcher.js`   | Console utilities     |

## User Profiles

### 👤 User 1: Alex Rodriguez

- **ID**: 1
- **Username**: alexgamer95
- **Email**: alex.rodriguez@levelup.cl
- **Level**: Gold (🥇)
- **Points**: 7,500
- **Style**: RPG/Strategy gamer
- **Platform**: PC
- **Location**: Santiago, RM

### 👤 User 2: María González

- **ID**: 2
- **Username**: mariagamer
- **Email**: maria.gonzalez@levelup.cl
- **Level**: Platinum (💎)
- **Points**: 15,420
- **Style**: Pro FPS/Competitive
- **Platform**: Console
- **Location**: Valparaíso

### 👤 User 3: Carlos Silva

- **ID**: 3
- **Username**: carloslevel
- **Email**: carlos.silva@levelup.cl
- **Level**: Silver (🥈)
- **Points**: 3,200
- **Style**: Indie/Retro collector
- **Platform**: Both
- **Location**: Concepción, Biobío

## Usage in Components

```jsx
import { useUser } from '../../hooks/useUser';

function MyComponent() {
  const { user, updatePersonal } = useUser();

  // Access data
  console.log(user.personal.firstName);

  // Update data
  await updatePersonal({ firstName: 'New Name' });
}
```

## Context Methods

```javascript
const {
  user,                      // Current user object
  loading,                   // Loading state
  login(userData),          // Login
  logout(),                 // Logout
  updateUser(updates),      // Update any field
  updatePersonal(data),     // Update personal info
  updateAddress(data),      // Update address
  updatePreferences(data),  // Update preferences
  updateGaming(data),       // Update gaming profile
  addPoints(points),        // Add points
} = useUser();
```

## Password

All users: **demo123**

---

📚 Full Documentation: `USER_MOCKUP_README.md`
