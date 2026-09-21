import {
  Menu,
  Sparkles,
  Sun,
} from "lucide-react";

function Topbar({
  status,
  model,
  onOpenSidebar,
}) {
  return (
    <header
      className="
        h-[62px] shrink-0
        px-4 md:px-6
        border-b border-white/5
        bg-[#071226]/80
        backdrop-blur-xl
        flex items-center justify-between
      "
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden text-gray-400"
        >
          <Menu size={22} />
        </button>

        <div>
          <div className="text-sm font-semibold">
            Agentic AI Chatbot
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow shadow-emerald-400" />
            {status}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-300">
          <Sparkles
            size={13}
            className="text-purple-400"
          />
          {model}
        </div>

        <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
          <Sun size={17} />
        </button>

        <div
          className="
            w-8 h-8 rounded-full
            bg-gradient-to-br from-blue-500 to-purple-500
            flex items-center justify-center
            text-xs font-bold
          "
        >
          S
        </div>
      </div>
    </header>
  );
}

export default Topbar;