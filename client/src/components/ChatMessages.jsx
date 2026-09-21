import { Bot } from "lucide-react";
import ToolProgress from "./ToolProgress";

function ChatMessages({
  messages,
  loading,
  tool,
}) {
  return (
    <div className="
      relative
      max-w-4xl
      mx-auto
      pt-8
    ">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`
            flex gap-3 mb-7
            ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }
          `}
        >
          {msg.role === "assistant" && (
            <div className="
              shrink-0
              w-8 h-8
              rounded-xl
              bg-gradient-to-br
              from-cyan-500
              to-blue-600
              flex items-center justify-center
            ">
              <Bot size={16} />
            </div>
          )}

          <div
            className={`
              max-w-[85%]
              text-sm md:text-[15px]
              leading-7
              whitespace-pre-wrap
              break-words
              ${
                msg.role === "user"
                  ? `
                    bg-gradient-to-br
                    from-blue-600/30
                    to-purple-600/20
                    border border-blue-400/10
                    rounded-2xl
                    rounded-br-md
                    px-4 py-3
                  `
                  : "text-gray-300 pt-1"
              }
            `}
          >
            {msg.content}
          </div>

          {msg.role === "user" && (
            <div className="
              shrink-0
              w-8 h-8
              rounded-full
              bg-gradient-to-br
              from-purple-500
              to-blue-500
              flex items-center justify-center
              text-xs font-bold
            ">
              U
            </div>
          )}
        </div>
      ))}

      <ToolProgress tool={tool} />

      {loading &&
        messages.at(-1)?.role === "assistant" &&
        !messages.at(-1)?.content && (
          <div className="
            flex items-center gap-2
            text-gray-500 text-xs
          ">
            <span className="
              w-2 h-2 rounded-full
              bg-cyan-400
              animate-pulse
            " />
            Thinking...
          </div>
        )}
    </div>
  );
}

export default ChatMessages;