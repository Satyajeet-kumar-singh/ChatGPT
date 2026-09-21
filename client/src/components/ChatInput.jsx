import {
  Paperclip,
  Mic,
  Send,
} from "lucide-react";
import { models } from "../data/chatdata"

function ChatInput({
  message,
  model,
  loading,
  isRecording,
  textareaRef,
  fileRef,
  onInput,
  onKeyDown,
  onSend,
  onModelChange,
  onDictation,
  onUpload,
}) {
  return (
    <div
      className="
        absolute bottom-0 left-0 right-0
        px-3 md:px-6
        pb-4 pt-10
        bg-gradient-to-t
        from-[#020817]
        via-[#020817]/95
        to-transparent
      "
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="
            rounded-2xl
            border border-blue-500/10
            bg-[#0b1428]/95
            backdrop-blur-xl
            shadow-2xl
            shadow-black/30
            p-2
            flex items-end
            gap-1
          "
        >
          {/* Attachment */}

          <button
            onClick={() =>
              fileRef.current?.click()
            }
            className="
              w-10 h-10 shrink-0
              rounded-xl
              flex items-center justify-center
              text-gray-500
              hover:text-white
              hover:bg-white/5
              transition
            "
            title="Upload document"
          >
            <Paperclip size={19} />
          </button>

          <input
            ref={fileRef}
            type="file"
            hidden
            accept=".pdf,.docx,.txt,.md,.py,.csv"
            onChange={onUpload}
          />

          {/* Textarea */}

          <textarea
            ref={textareaRef}
            value={message}
            onChange={onInput}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Ask anything..."
            className="
              flex-1
              bg-transparent
              outline-none
              resize-none
              text-sm
              text-gray-200
              placeholder:text-gray-600
              min-h-[40px]
              max-h-[170px]
              py-2.5 px-2
            "
          />

          {/* Model */}

          <select
            value={model}
            onChange={(e) =>
              onModelChange(e.target.value)
            }
            className="
              hidden sm:block
              h-10
              max-w-[135px]
              bg-[#111c32]
              border border-white/5
              rounded-xl
              px-2
              text-[11px]
              text-gray-300
              outline-none
              cursor-pointer
            "
          >
            {models.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Mic */}

          <button
            onClick={onDictation}
            className={`
              w-10 h-10
              shrink-0
              rounded-xl
              flex items-center justify-center
              transition
              ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }
            `}
            title="Voice input"
          >
            <Mic size={18} />
          </button>

          {/* Send */}

          <button
            onClick={onSend}
            disabled={!message.trim() || loading}
            className="
              w-10 h-10
              shrink-0
              rounded-xl
              flex items-center justify-center
              bg-gradient-to-br
              from-cyan-400
              to-blue-600
              text-white
              shadow-lg shadow-blue-500/20
              hover:scale-105
              disabled:opacity-30
              disabled:hover:scale-100
              transition
            "
          >
            <Send size={17} />
          </button>
        </div>

        <div className="
          text-center
          text-[10px]
          text-gray-600
          mt-2
        ">
          BappyGPT can make mistakes.
          Check important info.
        </div>
      </div>
    </div>
  );
}

export default ChatInput;