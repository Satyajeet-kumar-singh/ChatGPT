import {
  Check,
  Loader2,
} from "lucide-react";

function ToolProgress({ tool }) {
  if (!tool) return null;

  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className="
          px-3 py-2
          rounded-xl
          bg-white/5
          border border-white/5
          text-xs text-gray-400
          flex items-center gap-2
        "
      >
        {tool.completed ? (
          <Check
            size={14}
            className="text-emerald-400"
          />
        ) : (
          <Loader2
            size={14}
            className="
              text-cyan-400
              animate-spin
            "
          />
        )}

        {tool.completed
          ? `${tool.name} completed`
          : `Using ${tool.name}...`}
      </div>
    </div>
  );
}

export default ToolProgress;