import React, { useState } from 'react'
import { MessageCircle, RotateCcw, Send } from 'lucide-react'
import './index.css'

interface Message {
  sender: 'user' | 'bot'
  content: string
}

type AgentKey =
  | 'Cost Analysis Agent'
  | 'Model Selection Agent'
  | 'Optimization Recommender'
  | 'ROI Calculator Agent'
  | 'Alert & Monitoring Agent'

const agentEndpoints: Record<AgentKey, {
  url: string
  apiKey: string
  user_id: string
  agent_id: string
  session_id: string
}> = {
  'Cost Analysis Agent': {
    url: 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/',
    apiKey: 'sk-default-73Ksx6vvAAgMNgpvumC7SefeqNVyRd87',
    user_id: 'faultymanoman@gmail.com',
    agent_id: '683b013406e05ef78261ac3b',
    session_id: '683b013406e05ef78261ac3b-xxiixornlxg',
  },
  'Model Selection Agent': {
    url: 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/',
    apiKey: 'sk-default-7ELNwGL2R9o9IWhAKzbGdCIoxRiDM2RO',
    user_id: 'dhruv.cloud2004@gmail.com',
    agent_id: '683afe4bc446a3a00dfef8bf',
    session_id: '683afe4bc446a3a00dfef8bf-9i5eiwavxj',
  },
  'Optimization Recommender': {
    url: 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/',
    apiKey: 'sk-default-73Ksx6vvAAgMNgpvumC7SefeqNVyRd87',
    user_id: 'faultymanoman@gmail.com',
    agent_id: '683b1e3ec446a3a00dfefb3a',
    session_id: '683b1e3ec446a3a00dfefb3a-5sfphd8guz',
  },
  'ROI Calculator Agent': {
    url: 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/',
    apiKey: 'sk-default-73Ksx6vvAAgMNgpvumC7SefeqNVyRd87',
    user_id: 'faultymanoman@gmail.com',
    agent_id: '683b231dc446a3a00dfefb8c',
    session_id: '683b231dc446a3a00dfefb8c-eq295nuzxgg',
  },
  'Alert & Monitoring Agent': {
    url: 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/',
    apiKey: 'sk-default-7ELNwGL2R9o9IWhAKzbGdCIoxRiDM2RO',
    user_id: 'dhruv.cloud2004@gmail.com',
    agent_id: '683b0b6dc446a3a00dfef9af',
    session_id: '683b0b6dc446a3a00dfef9af-rd7v32fkt',
  }
}

const examplePrompts = [
  { icon: '🎯', text: 'What are your main features?' },
  { icon: '📚', text: 'How do I get started?' },
  { icon: '🧠', text: 'What knowledge are you trained on?' },
  { icon: '</>', text: 'Show me an example of your output' }
]

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [agent, setAgent] = useState<AgentKey>('Cost Analysis Agent')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input
    if (!textToSend.trim()) return

    const selectedAgent = agentEndpoints[agent]
    const newUserMsg = { sender: 'user' as const, content: textToSend }
    setMessages(prev => [...prev, newUserMsg])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(selectedAgent.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': selectedAgent.apiKey,
        },
        body: JSON.stringify({
          user_id: selectedAgent.user_id,
          agent_id: selectedAgent.agent_id,
          session_id: selectedAgent.session_id,
          message: textToSend,
        }),
      })

      const data = await response.json()
      const botReply = data.response ?? 'No response received.'
      setMessages(prev => [...prev, { sender: 'bot', content: botReply }])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { sender: 'bot', content: 'Error contacting agent.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <h1 className="header-title">Test Agent Inference</h1>
      </div>

      {/* Chat Tab */}
      <div className="tab-container">
        <div className="tab active">
          <MessageCircle size={16} />
          Chat
        </div>
      </div>

      {/* Agent Selection */}
      <div className="agent-selection">
        <select 
          value={agent} 
          onChange={e => setAgent(e.target.value as AgentKey)}
          className="agent-select"
        >
          {Object.keys(agentEndpoints).map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="clear-button"
          >
            <RotateCcw size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="welcome-screen">
            <div className="welcome-container">
              <h2 className="welcome-title">Start a conversation or try one of these examples:</h2>
              
              <div className="examples-grid">
                {examplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt.text)}
                    className="example-button"
                  >
                    <span className="example-icon">{prompt.icon}</span>
                    <span className="example-text">{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="chat-messages">
            <div className="messages-container">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message-wrapper ${msg.sender}`}>
                  <div className={`message ${msg.sender}`}>
                    {msg.sender === 'bot' ? (
                      <pre className="bot-message-content">{msg.content}</pre>
                    ) : (
                      <div className="user-message-content">{msg.content}</div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message-wrapper bot">
                  <div className="message bot">
                    <div className="loading-indicator">
                      <div className="loading-dots">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                      </div>
                      <span className="loading-text">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="input-area">
          <div className="input-container">
            <div className="input-wrapper">
              <div className="textarea-container">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask ${agent} anything...`}
                  rows={1}
                  className="message-input"
                />
                <div className="input-hint">
                  ↑↓ to navigate chat history, Shift+Enter for newline
                </div>
              </div>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="send-button"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App