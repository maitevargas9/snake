type CellProps = {
    isSnake: boolean;
    isFood: boolean;
};

export default function Cell({ isSnake, isFood }: CellProps) {
    return (
        <div
            className={`w-5 h-5 rounded-sm transition-colors ${isSnake
                ? "bg-green-500 shadow-[0_0_6px_2px_rgba(34,197,94,0.6)]"
                : isFood
                    ? "bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.6)]"
                    : "bg-gray-700"
                }`}
        />
    );
}
