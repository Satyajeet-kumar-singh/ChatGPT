import {
  useEffect,
  useRef,
  useState,
} from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import WelcomeScreen from "./components/WelcomeScreen";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";

function App() {
  const [threadId, setThreadId] = useState(() => {
    let id = localStorage.getItem("thread_id");

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("thread_id", id);
    }

    return id;
  });

  const [model, setModel] = useState(
    () =>
      localStorage.getItem("selected_model") ||
      "openai/gpt-oss-120b" 
  );

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] =
    useState([]);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [tool, setTool] = useState(null);
  const [isRecording, setIsRecording] =
    useState(false);
  const [mobileSidebar, setMobileSidebar] =
    useState(false);

  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);
  const fileRef = useRef(null);
  const chatRef = useRef(null);

  /* -----------------------------
      Conversations
  ----------------------------- */

  async function loadConversations() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/conversations`
      );

      const data = await response.json();
      setConversations(data.conversation || []);
    } catch (error) {
      console.error(
        "Failed to load conversations:",
        error
      );
    }
  }
  

  async function loadConversation(id) {
    try {
      setThreadId(id);
      localStorage.setItem("thread_id", id);

      setMobileSidebar(false);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/history/${id}`
      );

      const data = await response.json();

      const loadedMessages = (
        data.messages || []
      ).map((msg) => ({
        role:
          msg.role === "user"
            ? "user"
            : "assistant",
        content: msg.content,
      }));

      setMessages(loadedMessages);
    } catch (error) {
      console.error(
        "Failed to load conversation:",
        error
      );
    }
  }

  useEffect(() => {
    loadConversations();
    loadConversation(threadId);
  }, []);
  
  /* -----------------------------
      Auto Scroll
  ----------------------------- */

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop =
        chatRef.current.scrollHeight;
    }
  }, [messages, loading, tool]);

  /* -----------------------------
      Model
  ----------------------------- */

  function handleModelChange(value) {
    setModel(value);
    localStorage.setItem(
      "selected_model",
      value
    );
  }

  /* -----------------------------
      New Chat
  ----------------------------- */

  async function newChat() {
    const newId = crypto.randomUUID();

    localStorage.setItem(
      "thread_id",
      newId
    );

    setThreadId(newId);
    setMessages([]);
    setTool(null);
    setStatus("Ready");
    setMobileSidebar(false);

    await loadConversations();

    textareaRef.current?.focus();
  }

  /* -----------------------------
      Prompt
  ----------------------------- */

  function usePrompt(prompt) {
    setMessage(prompt);
    textareaRef.current?.focus();
  }

  /* -----------------------------
      Tool Detection
  ----------------------------- */

function detectTool(text) {
  const value = text.toLowerCase();

  const mathPattern =
    /(\d+\s*[\+\-\*\/]\s*\d+)|calculate|calculation|math|solve/;

  const ragPattern =
    /document|pdf|file|uploaded|summarize|summary|according to|based on/;

  const memorySavePattern =
    /remember that|save this|store this|keep in memory|memorize/;

  const memoryRecallPattern =
    /what do you remember|recall|my memory|remember about me/;

  const weatherPattern =
    /weather|temperature|forecast|rain|raining|climate|hot|cold/;

  const stockPattern =
    /stock|share price|stock price|share market|market price|share value|nasdaq|nyse|nifty|sensex/;

  const webPattern =
    /latest|current|today|now|recent|news|search web|web search|internet|online|price|version|update|2025|2026|who is|trending|release|new model|current ceo/;

  if (memorySavePattern.test(value))
    return "Memory Save";

  if (memoryRecallPattern.test(value))
    return "Memory Recall";

  if (ragPattern.test(value))
    return "Document Search";

  if (weatherPattern.test(value))
    return "Weather";

  if (stockPattern.test(value))
    return "Stock Price";

  if (webPattern.test(value))
    return "Web Search";

  if (mathPattern.test(value))
    return "Calculator";

  return null;
}


  /* -----------------------------
      SSE
  ----------------------------- */

  function parseSSE(part) {
    const lines = part
      .split(/\r?\n/)
      .filter((line) =>
        line.trim().startsWith("data:")
      );

    if (!lines.length) return null;

    const jsonText = lines
      .map((line) =>
        line.replace(/^data:\s*/, "")
      )
      .join("\n")
      .trim();

    if (
      !jsonText ||
      jsonText === "[DONE]"
    ) {
      return null;
    }

    try {
      return JSON.parse(jsonText);
    } catch {
      return null;
    }
  }

  function appendToken(token) {
    setMessages((prev) => {
      const copy = [...prev];
      const last = copy.length - 1;

      if (
        last >= 0 &&
        copy[last].role === "assistant"
      ) {
        copy[last] = {
          ...copy[last],
          content:
            copy[last].content + token,
        };
      }

      return copy;
    });
  }

  function updateLastAssistant(content) {
    setMessages((prev) => {
      const copy = [...prev];
      const last = copy.length - 1;

      if (
        last >= 0 &&
        copy[last].role === "assistant"
      ) {
        copy[last] = {
          ...copy[last],
          content,
        };
      }

      return copy;
    });
  }

  /* -----------------------------
      Send Message
  ----------------------------- */

  async function sendMessage() {
    const text = message.trim();

    if (!text || loading) return;

    if (isRecording) {
      stopDictation();
    }

    setMessage("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: text,
      },
      {
        role: "assistant",
        content: "",
      },
    ]);

    setLoading(true);
    setStatus(
      `Thinking with ${model}...`
    );

    const detectedTool =
      detectTool(text);

    if (detectedTool) {
      setTool({
        name: detectedTool,
        completed: false,
      });

      setStatus(
        `Using ${detectedTool}...`
      );
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/chat/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: text,
            thread_id: threadId,
            model,
          }),
        }
      );

      if (!response.ok) {
        let errorText =
          "Request failed.";

        try {
          const data =
            await response.json();

          errorText =
            data.detail ||
            data.message ||
            errorText;
        } catch {}

        updateLastAssistant(
          errorText
        );

        return;
      }

      if (!response.body) {
        updateLastAssistant(
          "Streaming is not supported by this browser."
        );

        return;
      }

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder("utf-8");

      let buffer = "";
      let firstToken = false;

      while (true) {
        const { value, done } =
          await reader.read();

        if (done) break;

        buffer += decoder.decode(
          value,
          { stream: true }
        );

        const parts = buffer.split(
          /\r?\n\r?\n/
        );

        buffer =
          parts.pop() || "";

        for (const part of parts) {
          const data =
            parseSSE(part);

          if (!data) continue;

          if (
            data.token !== undefined
          ) {
            if (!firstToken) {
              firstToken = true;

              if (detectedTool) {
                setTool({
                  name: detectedTool,
                  completed: true,
                });
              }

              setStatus(
                `Generating with ${model}...`
              );
            }

            appendToken(data.token);
          }

          if (data.error) {
            appendToken(
              `\n\nError: ${data.error}`
            );
          }

          if (data.done) {
            setStatus("Ready");
          }
        }
      }

      buffer += decoder.decode();

      if (buffer.trim()) {
        const data =
          parseSSE(buffer);

        if (data?.token) {
          appendToken(
            data.token
          );
        }

        if (data?.done) {
          setStatus("Ready");
        }
      }
    } catch (error) {
      console.error(error);

      updateLastAssistant(
        `Something went wrong: ${error.message}`
      );
    } finally {
      setLoading(false);
      setTool(null);
      setStatus("Ready");

      await loadConversations();

      textareaRef.current?.focus();
    }
  }

  /* -----------------------------
      Upload
  ----------------------------- */

  async function uploadFile(event) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content:
          `📎 Uploaded document: ${file.name}`,
      },
    ]);

    setTool({
      name: "Document Ingestion",
      completed: false,
    });

    setStatus(
      "Using Document Ingestion..."
    );

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "thread_id",
      threadId
    );

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      setTool({
        name: "Document Ingestion",
        completed: true,
      });

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.message +
              "\n\nYou can now ask questions about this document.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Upload failed: " +
              data.message,
          },
        ]);
      }

      await loadConversations();
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Upload failed: " +
            error.message,
        },
      ]);
    } finally {
      setTool(null);
      setStatus("Ready");
      event.target.value = "";
    }
  }

  /* -----------------------------
      Speech Recognition
  ----------------------------- */

  /* -----------------------------
    Speech Recognition
----------------------------- */

function toggleDictation() {
  if (!recognitionRef.current) {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported. Please use Chrome or Edge."
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    // Important for mobile duplicate issue
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      setStatus("Listening...");
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0]?.[0]?.transcript?.trim();

      if (!transcript) return;

      setMessage((prev) => {
        if (!prev.trim()) {
          return transcript;
        }

        return `${prev.trim()} ${transcript}`;
      });
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsRecording(false);
      setStatus("Ready");
    };

    recognition.onend = () => {
      setIsRecording(false);
      setStatus("Ready");
    };

    recognitionRef.current =
      recognition;
  }

  if (isRecording) {
    stopDictation();
    return;
  }

  try {
    recognitionRef.current.start();
  } catch (error) {
    console.error(
      "Recognition start error:",
      error
    );
  }
}

function stopDictation() {
  try {
    recognitionRef.current?.stop();
  } catch {}

  setIsRecording(false);
  setStatus("Ready");
}

  /* -----------------------------
      Keyboard
  ----------------------------- */

  function handleKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  }

  function handleInput(event) {
    const textarea =
      event.target;

    textarea.style.height = "auto";

    textarea.style.height =
      Math.min(
        textarea.scrollHeight,
        170
      ) + "px";

    setMessage(
      textarea.value
    );
  }

  const hasMessages =
    messages.length > 0;
  
  return (
    <div className="
      h-screen overflow-hidden
      bg-[#020817]
      text-white
      flex
    ">
      {/* Mobile Overlay */}

      {mobileSidebar && (
        <div
          className="
            fixed inset-0 z-40
            bg-black/60 lg:hidden
          "
          onClick={() =>
            setMobileSidebar(false)
          }
        />
      )}

      {/* Sidebar */}

      <Sidebar
        conversations={conversations}
        threadId={threadId}
        mobileSidebar={mobileSidebar}
        onClose={() =>
          setMobileSidebar(false)
        }
        onNewChat={newChat}
        onLoadConversation={
          loadConversation
        }
      />

      {/* Main */}

      <main className="
        flex-1
        min-w-0
        flex
        flex-col
        relative
      ">
        <Topbar
          status={status}
          model={model}
          onOpenSidebar={() =>
            setMobileSidebar(true)
          }
        />

        {/* Chat */}

        <div
          ref={chatRef}
          className="
            flex-1
            overflow-y-auto
            px-4 md:px-6
            pb-44
            relative
          "
        >
          {/* Background */}

          <div className="
            pointer-events-none
            absolute inset-0
            overflow-hidden
          ">
            <div className="
              absolute top-20 left-1/2
              -translate-x-1/2
              w-[500px] h-[300px]
              bg-blue-600/10
              blur-[100px]
              rounded-full
            " />

            <div className="
              absolute bottom-0 right-0
              w-[350px] h-[250px]
              bg-purple-600/10
              blur-[100px]
              rounded-full
            " />
          </div>

          {!hasMessages ? (
            <WelcomeScreen
              onPrompt={usePrompt}
            />
          ) : (
            <ChatMessages
              messages={messages}
              loading={loading}
              tool={tool}
            />
          )}
        </div>

        {/* Input */}

        <ChatInput
          message={message}
          model={model}
          loading={loading}
          isRecording={isRecording}
          textareaRef={textareaRef}
          fileRef={fileRef}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onSend={sendMessage}
          onModelChange={
            handleModelChange
          }
          onDictation={
            toggleDictation
          }
          onUpload={uploadFile}
        />
      </main>
    </div>
  );
}

export default App;