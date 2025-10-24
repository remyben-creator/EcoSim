// components/GridBox.js

export default function GridBox({ plants, animals, width = 3, height = 3 }) {
  // Initialize empty grid with 2x2 mini-cells
  const grid = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => Array(4).fill("⬜"))
  );

  // Helper to push entity into first available slot
  const addToCell = (x, y, emoji) => {
    const cell = grid[y][x];
    for (let i = 0; i < 4; i++) {
      if (cell[i] === "⬜") {
        cell[i] = emoji;
        break;
      }
    }
  };

  // Add plants
  for (const plant of plants) {
    const { x, y } = plant.position;
    addToCell(x, y, "🌱");
  }

  // Add animals
  for (const animal of animals) {
    if (!animal.alive) continue;
    const { x, y } = animal.position;
    if (animal.species === "rabbit") addToCell(x, y, "🐇");
    if (animal.species === "fox") addToCell(x, y, "🦊");
  }

  // Convert each 2x2 cell to string with a black outline
  const gridString = grid
    .map(row => {
      const top = row.map(cell => `┌${cell[0]}${cell[1]}┐`).join(" ");
      const bottom = row.map(cell => `└${cell[2]}${cell[3]}┘`).join(" ");
      return `${top}\n${bottom}`;
    })
    .join("\n");

  // Calculate dynamic font size based on grid dimensions to fill available space
  const containerWidth = 800; // Approximate available width (adjust based on your container)
  const containerHeight = 700; // Approximate available height (50rem - padding)
  
  // Each cell takes up roughly 6 characters width (┌xx┐ + space) and 2 lines height
  const cellWidth = 6;
  const cellHeight = 2;
  
  // Calculate max font size that fits both width and height constraints
  const maxFontSizeForWidth = containerWidth / (width * cellWidth);
  const maxFontSizeForHeight = containerHeight / (height * cellHeight);
  const baseFontSize = Math.max(6, Math.min(maxFontSizeForWidth, maxFontSizeForHeight));
  
  // Scale up the font size by 1.75x
  const fontSize = baseFontSize * 1.75;

  return (
    <div style={{ 
      flex: 1, 
      fontFamily: "monospace", 
      fontSize: `${fontSize}px`, 
      padding: "1rem", 
      color: "black", 
      borderRadius: "8px", 
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
      height: "50rem", 
      overflowY: "auto", 
      border: "1px solid #059669",
      whiteSpace: "pre",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {gridString}
    </div>
  );
}
