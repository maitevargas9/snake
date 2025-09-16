type ScoreProps = {
    score: number;
    highscore: number;
};

export default function Score({ score, highscore }: ScoreProps) {
    return (
        <div className="mb-6 text-center">
            <p className="text-lg font-semibold mb-1">Score: {score}</p>
            <p className="text-sm font-medium text-green-200">High score: {highscore}</p>
        </div>
    );
}