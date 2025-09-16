type GameOverProps = {
    score: number;
    highscore: number;
    onRestart: () => void;
};

export default function GameOver({ score, highscore, onRestart }: GameOverProps) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl">
            <p className="text-3xl font-bold text-red-400 drop-shadow-md">Game Over!</p>
            <p className="mt-2 text-lg">Final Score: {score}</p>
            <p className="text-sm text-green-200">High score: {highscore}</p>
            <button
                onClick={onRestart}
                className="mt-4 px-6 py-3 bg-green-600 rounded-xl font-semibold text-lg hover:bg-green-700 shadow-lg transition"
            >
                Restart
            </button>
        </div>
    );
}
