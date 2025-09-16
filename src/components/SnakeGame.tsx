import { useState, useEffect, useCallback, useRef } from "react";
import Cell from "./Cell";
import Score from "./Score";
import GameOver from "./GameOver";

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
    const [score, setScore] = useState(0);
    const [highscore, setHighscore] = useState<number>(0);

    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("snakeHighscore");
        if (saved) {
            setHighscore(parseInt(saved));
        }
    }, []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                e.preventDefault();
            }
            switch (e.key) {
                case "ArrowUp":
                    if (direction !== "DOWN") {
                        setDirection("UP");
                    }
                    break;
                case "ArrowDown":
                    if (direction !== "UP") {
                        setDirection("DOWN");
                    }
                    break;
                case "ArrowLeft":
                    if (direction !== "RIGHT") {
                        setDirection("LEFT");
                    }
                    break;
                case "ArrowRight":
                    if (direction !== "LEFT") {
                        setDirection("RIGHT");
                    }
                    break;
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [direction]);

    const moveSnake = useCallback(() => {
        const head = { ...snake[0] };
        switch (direction) {
            case "UP": head.y -= 1; break;
            case "DOWN": head.y += 1; break;
            case "LEFT": head.x -= 1; break;
            case "RIGHT": head.x += 1; break;
        }

        if (
            head.x < 0 || head.x >= GRID_SIZE ||
            head.y < 0 || head.y >= GRID_SIZE ||
            snake.some((s) => s.x === head.x && s.y === head.y)
        ) {
            setGameOver(true);
            if (score > highscore) {
                setHighscore(score);
                localStorage.setItem("snakeHighscore", score.toString());
            }
            return;
        }

        const newSnake = [head, ...snake];
        if (head.x === food.x && head.y === food.y) {
            setFood(getRandomPosition());
            setScore((prev) => prev + 1);
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    }, [snake, direction, food, score, highscore]);

    useEffect(() => {
        if (gameOver) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            return;
        }

        const getSpeed = () => Math.max(50, 200 - score * 5);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = window.setInterval(moveSnake, getSpeed());

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [moveSnake, score, gameOver]);

    const resetGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setDirection("RIGHT");
        setFood(getRandomPosition());
        setScore(0);
        setGameOver(false);
    };

    return (
        <div className="flex flex-col items-center justify-center fixed top-0 left-0 h-screen w-screen bg-blue-950 text-white">
            <h1 className="text-4xl font-extrabold mb-2 text-green-300 drop-shadow-lg">🐍 Snake Game</h1>

            <Score score={score} highscore={highscore} />

            <div className="relative p-4 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
                <div
                    className="grid gap-0.5 bg-gray-900 p-2 rounded-xl border border-gray-700"
                    style={{
                        gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
                        gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
                    }}
                >
                    {Array.from({ length: GRID_SIZE }).map((_, y) =>
                        Array.from({ length: GRID_SIZE }).map((_, x) => (
                            <Cell
                                key={`${x}-${y}`}
                                isSnake={snake.some((s) => s.x === x && s.y === y)}
                                isFood={food.x === x && food.y === y}
                            />
                        ))
                    )}
                </div>

                {gameOver && <GameOver score={score} highscore={highscore} onRestart={resetGame} />}
            </div>
        </div>
    );
}
