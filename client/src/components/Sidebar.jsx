import {
  Bot,
  Plus,
  MessageSquare,
  Sparkles,
  X,
} from "lucide-react";

function Sidebar({
  conversations,
  threadId,
  mobileSidebar,
  onClose,
  onNewChat,
  onLoadConversation,
}) {
  // console.log("Sidebar1",conversations)
  // console.log("Sidebar2",conversations)
  return (
    <aside
      className={`
        fixed lg:relative z-50
        h-full w-[270px]
        bg-[#071226]/95
        border-r border-blue-500/10
        flex flex-col
        transition-transform duration-300
        ${
          mobileSidebar
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
    >
      {/* Logo */}

      <div className="h-[70px] px-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot size={21} />
          </div>

          <div>
            <div className="font-bold text-lg">
              Chat<span className="text-cyan-400">GPT</span>
            </div>

            <div className="text-[10px] text-gray-500">
              Agentic AI Assistant
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="lg:hidden text-gray-400"
        >
          <X size={20} />
        </button>
      </div>

      {/* New Chat */}

      <div className="p-3">
        <button
          onClick={onNewChat}
          className="
            w-full h-11 rounded-xl
            bg-gradient-to-r from-blue-600 to-cyan-500
            hover:from-blue-500 hover:to-cyan-400
            flex items-center gap-3 px-4
            font-medium text-sm
            shadow-lg shadow-blue-500/20
            transition
          "
        >
          <Plus size={18} />
          New chat
        </button>
      </div>

      <div className="px-4 pb-2 text-[11px] uppercase tracking-wider text-gray-500">
        Recent Chats
      </div>

      {/* Conversations */}

      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        {conversations?.length === 0 ? (
          <div className="px-3 py-4 text-sm text-gray-600">
            No chats yet
          </div>
        ) : (
          conversations?.map((conversation) => (
            <button
              key={conversation.thread_id}
              onClick={() =>
                onLoadConversation(
                  conversation.thread_id
                )
              }
              className={`
                w-full text-left
                flex items-center gap-3
                px-3 py-3 rounded-xl
                text-sm transition
                ${
                  conversation.thread_id === threadId
                    ? "bg-blue-500/15 text-white border border-blue-500/10"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <MessageSquare
                size={15}
                className="shrink-0"
              />

              <span className="truncate">
                {conversation.title || "New Chat"}
              </span>
            </button>
          ))
        )}
      </div>

      {/* Bottom */}

      <div className="p-3">
        <div
          className="
            rounded-xl p-3
            bg-gradient-to-br
            from-blue-600/20
            via-purple-500/10
            to-cyan-500/10
            border border-blue-400/10
          "
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles
              size={15}
              className="text-cyan-400"
            />

            <span className="text-xs font-semibold">
              Supercharge your ideas
            </span>
          </div>

          <p className="text-[10px] text-gray-500">
            Search • Upload • Remember • Reason
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;