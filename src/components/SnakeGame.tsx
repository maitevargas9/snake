import { useState, useEffect, useCallback } from "react";

type Position = { x: number; y: number };

const GRID_SIZE = 20;

const getRandomPosition = (): Position => ({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
});

export default function SnakeGame() {
    const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
    const [direction, setDirection] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">("RIGHT");
    const [food, setFood] = useState<Position>(getRandomPosition());
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (
                e.key === "ArrowUp" ||
                e.key === "ArrowDown" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight"
            ) {
                e.preventDefault();
            }

            switch (e.key) {
                case "ArrowUp":
                    if (direction !== "DOWN") setDirection("UP");
                    break;
                case "ArrowDown":
                    if (direction !== "UP") setDirection("DOWN");
                    break;
                case "ArrowLeft":
                    if (direction !== "RIGHT") setDirection("LEFT");
                    break;
                case "ArrowRight":
                    if (direction !== "LEFT") setDirection("RIGHT");
                    break;
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [direction]);

    const moveSnake = useCallback(() => {
        const head = { ...snake[0] };

        switch (direction) {
            case "UP":
                head.y -= 1;
                break;
            case "DOWN":
                head.y += 1;
                break;
            case "LEFT":
                head.x -= 1;
                break;
            case "RIGHT":
                head.x += 1;
                break;
        }

        if (
            head.x < 0 ||
            head.x >= GRID_SIZE ||
            head.y < 0 ||
            head.y >= GRID_SIZE ||
            snake.some((s) => s.x === head.x && s.y === head.y)
        ) {
            setGameOver(true);
            return;
        }

        const newSnake = [head, ...snake];

        if (head.x === food.x && head.y === food.y) {
            setFood(getRandomPosition());
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    }, [snake, direction, food]);

    useEffect(() => {
        if (gameOver) return;
        const interval = setInterval(moveSnake, 200);
        return () => clearInterval(interval);
    }, [moveSnake, gameOver]);

    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setDirection("RIGHT");
        setFood(getRandomPosition());
        setGameOver(false);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen overflow-hidden bg-blue-950 text-white">
            <h1 className="text-4xl font-extrabold mb-6 text-green-300 drop-shadow-lg">
                🐍 Snake Game
            </h1>

            <div className="relative p-4 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
                <div
                    className="grid gap-0.5 bg-gray-900 p-2 rounded-xl border border-gray-700"
                    style={{
                        gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
                        gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
                    }}
                >
                    {Array.from({ length: GRID_SIZE }).map((_, y) =>
                        Array.from({ length: GRID_SIZE }).map((_, x) => {
                            const isSnake = snake.some((s) => s.x === x && s.y === y);
                            const isFood = food.x === x && food.y === y;
                            return (
                                <div
                                    key={`${x}-${y}`}
                                    className={`w-5 h-5 rounded-sm transition-colors ${isSnake
                                        ? "bg-green-500 shadow-[0_0_6px_2px_rgba(34,197,94,0.6)]"
                                        : isFood
                                            ? "bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.6)]"
                                            : "bg-gray-700"
                                        }`}
                                />
                            );
                        })
                    )}
                </div>

                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl">
                        <p className="text-3xl font-bold text-red-400 drop-shadow-md">
                            Game Over!
                        </p>
                        <button
                            onClick={resetGame}
                            className="mt-4 px-6 py-3 bg-green-600 rounded-xl font-semibold text-lg hover:bg-green-700 shadow-lg transition"
                        >
                            Restart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
