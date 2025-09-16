type CellProps = {
    isSnake: boolean;
    isFood: boolean;
    score?: number;
};

export default function Cell({ isSnake, isFood, score = 0 }: CellProps) {
    const glowIntensity = Math.min(10 + score * 0.5, 20);
    const snakeShadow = `0 0 ${glowIntensity}px 2px rgba(34,197,94,0.6)`;

    return (
        <div
            className={`w-5 h-5 rounded-sm transition-all duration-150`}
            style={{
                backgroundColor: isSnake
                    ? `rgba(34,197,94,${0.5 + Math.min(score * 0.02, 0.5)})`
                    : isFood
                        ? "rgba(239,68,68,0.8)"
                        : "#374151",
                boxShadow: isSnake
                    ? snakeShadow
                    : isFood
                        ? "0 0 6px 2px rgba(239,68,68,0.6)"
                        : "none",
            }}
        />
    );
}
