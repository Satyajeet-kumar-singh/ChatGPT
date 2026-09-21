import {
  Globe,
  FileText,
  Brain,
  Calculator,
  CloudSun,
  TrendingUp,
  Search,
} from "lucide-react";

export const models = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.6-27b",
    "qwen/qwen3.8-27b",
];

export const suggestions = [
  {
    title: "Search latest news",
    description:
      "Get the latest news about a city from the web.",
    icon: Globe,
    color: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-cyan-400",
    prompt: "Get the latest news in Delhi.",
  },
  {
    title: "Search uploaded documents",
    description:
      "Search and find relevant information from your uploaded files.",
    icon: FileText,
    color: "from-purple-500/20 to-fuchsia-500/10",
    iconColor: "text-purple-400",
    prompt: "Search my uploaded documents for relevant information.",
  },
  {
    title: "Save something to memory",
    description:
      "Save an important fact or preference to long-term memory.",
    icon: Brain,
    color: "from-emerald-500/20 to-green-500/10",
    iconColor: "text-emerald-400",
    prompt:
      "Remember that my channel name is dswithbappy.",
  },
  {
    title: "Use calculator tool",
    description:
      "Calculate mathematical expressions quickly and accurately.",
    icon: Calculator,
    color: "from-orange-500/20 to-yellow-500/10",
    iconColor: "text-orange-400",
    prompt: "Calculate 125 * 48 / 6",
  },
  {
    title: "Check weather",
    description:
      "Get the current weather information for any city.",
    icon: CloudSun,
    color: "from-sky-500/20 to-blue-500/10",
    iconColor: "text-sky-400",
    prompt: "What is the current weather in Delhi?",
  },
  {
    title: "Check stock price",
    description:
      "Get the latest stock price for a company.",
    icon: TrendingUp,
    color: "from-green-500/20 to-emerald-500/10",
    iconColor: "text-green-400",
    prompt: "Get the latest stock price of AAPL.",
  },
  {
    title: "Recall memory",
    description:
      "Recall information previously saved in memory.",
    icon: Search,
    color: "from-pink-500/20 to-rose-500/10",
    iconColor: "text-pink-400",
    prompt: "What do you remember about me?",
  },
];