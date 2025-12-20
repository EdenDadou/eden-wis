export default function PixelHeart({ size = 100 }: { size?: number }) {
  // Grille 10x10 - 1 = vert (coeur), 0 = transparent
  const grid = [
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  // Espacement entre les carrés (gap)
  const gap = 0.1;
  const cellSize = 1 - gap;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
    >
      {grid.map((row, y) =>
        row.map((cell, x) =>
          cell === 1 ? (
            <rect
              key={`${x}-${y}`}
              x={x + gap / 2}
              y={y + gap / 2}
              width={cellSize}
              height={cellSize}
              rx={0.08}
              fill="#22c55e"
            />
          ) : null
        )
      )}
    </svg>
  );
}
