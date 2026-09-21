import { ArrowRight } from "lucide-react";

function SuggestionCard({
  title,
  description,
  icon: Icon,
  color,
  iconColor,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        group
        text-left
        rounded-2xl
        border border-white/5
        bg-gradient-to-br ${color}
        hover:border-white/10
        p-4
        transition
        hover:-translate-y-0.5
      `}
    >
      <div className="flex items-center justify-between">
        <div
          className={`
            w-9 h-9
            rounded-xl
            bg-black/20
            flex items-center justify-center
            ${iconColor}
          `}
        >
          <Icon size={18} />
        </div>

        <ArrowRight
          size={16}
          className="
            text-gray-600
            group-hover:text-gray-300
            group-hover:translate-x-1
            transition
          "
        />
      </div>

      <div className="mt-3">
        <div className="font-medium text-sm">
          {title}
        </div>

        <div className="text-xs text-gray-500 mt-1 leading-5">
          {description}
        </div>
      </div>
    </button>
  );
}

export default SuggestionCard;