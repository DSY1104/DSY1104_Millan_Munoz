/**
 * Level Service Usage Examples
 *
 * This file demonstrates various ways to use the levelService methods
 */

import {
  getLevelsData,
  getAllLevels,
  getLevelByName,
  getLevelByPoints,
  getPointsRules,
  calculatePointsForPurchase,
  getPointsToNextLevel,
  getLevelNames,
} from "../services/levelService";

// ============================================
// Example 1: Get all levels data
// ============================================
export const fetchAllLevelsData = async () => {
  try {
    const data = await getLevelsData();
    console.log("Complete levels data:", data);
    console.log("Levels:", data.levels);
    console.log("Points rules:", data.pointsPerPurchase);
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

// ============================================
// Example 2: Get just the levels array
// ============================================
export const fetchLevels = async () => {
  try {
    const levels = await getAllLevels();
    console.log("All levels:", levels);

    levels.forEach((level) => {
      console.log(
        `${level.icon} ${level.name}: ${level.minPoints}-${
          level.maxPoints || "∞"
        } points`
      );
    });

    return levels;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

// ============================================
// Example 3: Get a specific level by name
// ============================================
export const fetchLevelDetails = async () => {
  try {
    const levelName = "Gold";
    const level = await getLevelByName(levelName);

    if (level) {
      console.log(`${level.icon} ${level.name} Level`);
      console.log(`Points range: ${level.minPoints}-${level.maxPoints || "∞"}`);
      console.log(`Color: ${level.color}`);
      console.log("Benefits:");
      level.benefits.forEach((benefit) => console.log(`  - ${benefit}`));
    } else {
      console.log("Level not found");
    }

    return level;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

// ============================================
// Example 4: Determine user's level by points
// ============================================
export const getUserLevel = async (userPoints) => {
  try {
    const level = await getLevelByPoints(userPoints);

    if (level) {
      console.log(
        `User with ${userPoints} points is at ${level.icon} ${level.name} level`
      );
      return level;
    } else {
      console.log("Could not determine level");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

// ============================================
// Example 5: Calculate points for a purchase
// ============================================
export const calculatePurchasePoints = async () => {
  try {
    const purchaseAmount = 75000; // $75.000 CLP
    const points = await calculatePointsForPurchase(purchaseAmount);

    console.log(
      `Purchase of $${purchaseAmount.toLocaleString(
        "es-CL"
      )} earns ${points} points`
    );

    return points;
  } catch (error) {
    console.error("Error:", error);
    return 0;
  }
};

// ============================================
// Example 6: Calculate progress to next level
// ============================================
export const showLevelProgress = async (userPoints) => {
  try {
    const progress = await getPointsToNextLevel(userPoints);

    if (progress.currentLevel) {
      console.log(
        `Current Level: ${progress.currentLevel.icon} ${progress.currentLevel.name}`
      );
      console.log(`Current Points: ${userPoints}`);
      console.log(`Progress: ${progress.progress}%`);

      if (progress.nextLevel) {
        console.log(
          `Next Level: ${progress.nextLevel.icon} ${progress.nextLevel.name}`
        );
        console.log(`Points needed: ${progress.pointsNeeded}`);
      } else {
        console.log("🎉 You are at the maximum level!");
      }
    }

    return progress;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

// ============================================
// Example 7: Display level comparison component
// ============================================
export const LevelComparisonExample = () => {
  const [levels, setLevels] = React.useState([]);

  React.useEffect(() => {
    const loadLevels = async () => {
      const data = await getAllLevels();
      setLevels(data);
    };
    loadLevels();
  }, []);

  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {levels.map((level) => (
        <div
          key={level.name}
          style={{
            border: `2px solid ${level.color}`,
            borderRadius: "8px",
            padding: "1rem",
            minWidth: "200px",
          }}
        >
          <h3 style={{ color: level.color }}>
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
    </div>
  );
};

// ============================================
// Example 8: User level progress bar
// ============================================
export const LevelProgressBar = ({ userPoints }) => {
  const [progress, setProgress] = React.useState(null);

  React.useEffect(() => {
    const loadProgress = async () => {
      const data = await getPointsToNextLevel(userPoints);
      setProgress(data);
    };
    loadProgress();
  }, [userPoints]);

  if (!progress || !progress.currentLevel) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h3>
        {progress.currentLevel.icon} {progress.currentLevel.name}
      </h3>
      <p>{userPoints} puntos</p>

      {progress.nextLevel && (
        <>
          <div
            style={{
              width: "100%",
              height: "20px",
              backgroundColor: "#eee",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress.progress}%`,
                height: "100%",
                backgroundColor: progress.currentLevel.color,
                transition: "width 0.3s",
              }}
            />
          </div>
          <p>
            {progress.pointsNeeded} puntos para {progress.nextLevel.icon}{" "}
            {progress.nextLevel.name}
          </p>
        </>
      )}

      {!progress.nextLevel && <p>🎉 ¡Has alcanzado el nivel máximo!</p>}
    </div>
  );
};

// ============================================
// Example 9: Points calculator
// ============================================
export const PointsCalculatorExample = () => {
  const [amount, setAmount] = React.useState(0);
  const [points, setPoints] = React.useState(0);
  const [rules, setRules] = React.useState([]);

  React.useEffect(() => {
    const loadRules = async () => {
      const data = await getPointsRules();
      setRules(data.rules || []);
    };
    loadRules();
  }, []);

  const handleCalculate = async () => {
    const earnedPoints = await calculatePointsForPurchase(amount);
    setPoints(earnedPoints);
  };

  return (
    <div>
      <h3>Calculadora de Puntos</h3>

      <div>
        <label>Monto de compra (CLP):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Ej: 50000"
        />
        <button onClick={handleCalculate}>Calcular</button>
      </div>

      {points > 0 && (
        <div>
          <h4>Puntos ganados: {points}</h4>
        </div>
      )}

      <div>
        <h4>Reglas de puntos:</h4>
        <ul>
          {rules.map((rule, idx) => (
            <li key={idx}>
              ${rule.minAmount.toLocaleString("es-CL")}+:
              {rule.pointsPerPeso} puntos por peso
              {rule.description && ` (${rule.description})`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ============================================
// Example 10: Level benefits display
// ============================================
export const displayLevelBenefits = async (levelName) => {
  try {
    const level = await getLevelByName(levelName);

    if (level) {
      console.log(`\n${level.icon} ${level.name} Level Benefits:`);
      console.log("=".repeat(40));
      level.benefits.forEach((benefit, index) => {
        console.log(`${index + 1}. ${benefit}`);
      });
      console.log("=".repeat(40));
    }

    return level;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export default {
  fetchAllLevelsData,
  fetchLevels,
  fetchLevelDetails,
  getUserLevel,
  calculatePurchasePoints,
  showLevelProgress,
  displayLevelBenefits,
};
