/**
 * Example: How to integrate levelLoader with React Router
 *
 * This file demonstrates how to use the levelLoader in your router configuration.
 */

import { createBrowserRouter, useLoaderData } from "react-router-dom";
import {
  levelsDataLoader,
  levelsLoader,
  levelDetailLoader,
  userLevelLoader,
  userProfileWithLevelLoader,
} from "./loaders/levelLoader";

// ============================================
// Example 1: Route with all levels data
// ============================================
const routerExample1 = createBrowserRouter([
  {
    path: "/loyalty",
    element: <LoyaltyProgramPage />,
    loader: levelsDataLoader, // Loads complete levels data + points rules
  },
]);

function LoyaltyProgramPage() {
  const data = useLoaderData();
  const { levels, pointsPerPurchase } = data;

  return (
    <div>
      <h1>Programa de Lealtad</h1>

      <section>
        <h2>Niveles</h2>
        {levels.map((level) => (
          <div key={level.name}>
            <h3>
              {level.icon} {level.name}
            </h3>
            <p>
              {level.minPoints} - {level.maxPoints || "∞"} puntos
            </p>
            <ul>
              {level.benefits.map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2>Cómo ganar puntos</h2>
        <p>Multiplicador base: {pointsPerPurchase.baseMultiplier}x</p>
        <ul>
          {pointsPerPurchase.rules.map((rule, idx) => (
            <li key={idx}>
              Compras sobre ${rule.minAmount.toLocaleString("es-CL")}:
              {rule.pointsPerPeso} puntos por peso
              {rule.description && ` - ${rule.description}`}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// ============================================
// Example 2: Route with just levels array
// ============================================
const routerExample2 = createBrowserRouter([
  {
    path: "/levels",
    element: <LevelsListPage />,
    loader: levelsLoader, // Loads only the levels array
  },
]);

function LevelsListPage() {
  const levels = useLoaderData();

  return (
    <div>
      <h1>Niveles de Membresía</h1>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {levels.map((level) => (
          <div
            key={level.name}
            style={{
              border: `3px solid ${level.color}`,
              borderRadius: "12px",
              padding: "1.5rem",
              minWidth: "250px",
            }}
          >
            <h2 style={{ color: level.color }}>
              {level.icon} {level.name}
            </h2>
            <p>
              <strong>Puntos:</strong> {level.minPoints} -{" "}
              {level.maxPoints || "∞"}
            </p>
            <h3>Beneficios:</h3>
            <ul>
              {level.benefits.map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Example 3: Route for single level detail
// ============================================
const routerExample3 = createBrowserRouter([
  {
    path: "/levels/:levelName",
    element: <LevelDetailPage />,
    loader: levelDetailLoader, // Loads specific level by name from URL
  },
]);

function LevelDetailPage() {
  const level = useLoaderData();

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          borderLeft: `5px solid ${level.color}`,
          paddingLeft: "1rem",
        }}
      >
        <h1>
          {level.icon} Nivel {level.name}
        </h1>

        <div style={{ marginTop: "2rem" }}>
          <h2>Rango de puntos</h2>
          <p style={{ fontSize: "1.5rem", color: level.color }}>
            {level.minPoints} - {level.maxPoints || "∞"} puntos
          </p>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h2>Beneficios exclusivos</h2>
          <ul style={{ lineHeight: "2" }}>
            {level.benefits.map((benefit, idx) => (
              <li key={idx}>{benefit}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Example 4: User profile with level
// ============================================
const routerExample4 = createBrowserRouter([
  {
    path: "/profile/:userId",
    element: <UserProfilePage />,
    loader: userProfileWithLevelLoader, // Loads user + their level
  },
]);

function UserProfilePage() {
  const { user, level } = useLoaderData();

  return (
    <div>
      <h1>Perfil de {user.name}</h1>
      <p>Email: {user.email}</p>

      <div style={{ marginTop: "2rem" }}>
        <h2>Tu nivel actual</h2>
        {level ? (
          <div
            style={{
              border: `3px solid ${level.color}`,
              borderRadius: "8px",
              padding: "1.5rem",
              maxWidth: "400px",
            }}
          >
            <h3 style={{ color: level.color }}>
              {level.icon} {level.name}
            </h3>
            <p>
              <strong>Puntos actuales:</strong> {user.points}
            </p>
            <p>
              <strong>Rango:</strong> {level.minPoints} -{" "}
              {level.maxPoints || "∞"}
            </p>

            <h4>Tus beneficios:</h4>
            <ul>
              {level.benefits.map((benefit, idx) => (
                <li key={idx}>✅ {benefit}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No se pudo determinar el nivel</p>
        )}
      </div>
    </div>
  );
}

// ============================================
// Example 5: Dashboard with level query param
// ============================================
const routerExample5 = createBrowserRouter([
  {
    path: "/dashboard",
    element: <DashboardPage />,
    loader: userLevelLoader, // Loads level based on ?points=XXX query param
  },
]);

function DashboardPage() {
  const { points, level } = useLoaderData();

  return (
    <div>
      <h1>Dashboard</h1>

      <div
        style={{
          background: "#f5f5f5",
          padding: "1.5rem",
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
      >
        <h2>Tu información de lealtad</h2>
        <p style={{ fontSize: "1.2rem" }}>
          Puntos totales: <strong>{points}</strong>
        </p>

        {level && (
          <div style={{ marginTop: "1rem" }}>
            <p>
              Nivel actual: {level.icon} <strong>{level.name}</strong>
            </p>
            <div
              style={{
                background: level.color,
                height: "4px",
                borderRadius: "2px",
                marginTop: "0.5rem",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Complete router configuration example
// ============================================
const completeRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "loyalty",
        element: <LoyaltyProgramPage />,
        loader: levelsDataLoader,
      },
      {
        path: "levels",
        element: <LevelsListPage />,
        loader: levelsLoader,
      },
      {
        path: "levels/:levelName",
        element: <LevelDetailPage />,
        loader: levelDetailLoader,
      },
      {
        path: "profile/:userId",
        element: <UserProfilePage />,
        loader: userProfileWithLevelLoader,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
        loader: userLevelLoader, // Access with /dashboard?points=3500
      },
    ],
  },
]);

export default completeRouter;
