import React from 'react'
import { Bot } from "lucide-react";
import { suggestions } from "../data/chatdata";
import SuggestionCard from './SuggestionCard';

function WelcomeScreen({onPrompt}) {
  return (
    <div className="relative max-w-4xl mx-auto pt-16 md:pt-24">
      <div className="text-center">
        <div className="relative mx-auto mb-7 w-24 h-24">
          <div className="
            absolute inset-0
            rounded-full
            bg-cyan-400/10
            blur-xl
          " />

          <div className="
            relative w-24 h-24
            rounded-[28px]
            bg-gradient-to-br
            from-blue-500/20
            to-purple-500/20
            border border-cyan-400/20
            flex items-center justify-center
            shadow-2xl shadow-blue-500/10
          ">
            <Bot
              size={48}
              className="text-cyan-300"
            />
          </div>
        </div>

        <div className="text-[10px] text-gray-600 italic mb-2">
          Your AI assistant, always with you
        </div>

        <h1 className="
          text-3xl md:text-5xl
          font-bold
          tracking-tight
          mb-4
        ">
            How can I help you{" "}
          <span className="
            text-transparent
            bg-clip-text
            bg-gradient-to-r
            from-cyan-400
            to-blue-500
          ">
            today?
          </span>
        </h1>

        <p className="
          text-sm md:text-base
          text-gray-500
          max-w-xl
          mx-auto
        ">
          Ask questions, upload documents,
          use tools, search the web,
          and chat with memory.
        </p>
      </div>

      <div className="
        grid grid-cols-1 sm:grid-cols-2
        gap-3 mt-10
      ">
        {suggestions.map((suggestion)=>(
          <SuggestionCard key={suggestion.title} 
          {...suggestion} 
          onClick={()=>{onPrompt(suggestion.prompt)}}/>
        ))}
      </div>
    </div>
  )
}

export default WelcomeScreen
