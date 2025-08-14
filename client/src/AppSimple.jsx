import React, { useState, useRef, useEffect } from 'react';
import './style.css';

const AppSimple = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [inputType, setInputType] = useState('chat'); // 'chat', 'image', 'search'
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const modelNames = {
    'gemini-2.5-flash': 'چت بات سریع آلفا',
    'gemini-2.5-pro': 'چت بات پیشرفته آلفا'
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
      type: inputType
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let endpoint = '/api/chat';
      let body = {
        message: inputMessage,
        history: messages.map(msg => ({ role: msg.role, content: msg.content })),
        model: selectedModel
      };

      if (inputType === 'image') {
        endpoint = '/api/generate-image';
        body = { prompt: inputMessage, model: selectedModel };
      } else if (inputType === 'search') {
        endpoint = '/api/search';
        body = { query: inputMessage, model: selectedModel };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage = {
          role: 'assistant',
          content: inputType === 'image' ? `![Generated Image](${data.image})` : data.response,
          timestamp: new Date().toISOString(),
          type: inputType,
          ...(inputType === 'image' && { imageData: data.image, mimeType: data.mimeType })
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: `خطا: ${error.message}`,
        timestamp: new Date().toISOString(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="app-title">چت بات آلفا</h1>
          <div className="model-selector">
            <select 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
              className="model-select"
            >
              <option value="gemini-2.5-flash">{modelNames['gemini-2.5-flash']}</option>
              <option value="gemini-2.5-pro">{modelNames['gemini-2.5-pro']}</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="chat-container">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h2>خوش آمدید به چت بات آلفا!</h2>
              <p>می‌توانید با من چت کنید، تصویر تولید کنید یا جستجو کنید.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className="message-content">
                  {message.type === 'image' && message.role === 'assistant' && message.imageData ? (
                    <div className="image-response">
                      <p>{message.content}</p>
                      <img 
                        src={`data:${message.mimeType};base64,${message.imageData}`} 
                        alt="Generated" 
                        className="generated-image"
                      />
                    </div>
                  ) : (
                    <div className="text-content">
                      {message.content}
                    </div>
                  )}
                </div>
                <div className="message-timestamp">
                  {new Date(message.timestamp).toLocaleTimeString('fa-IR')}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="message assistant-message">
              <div className="message-content">
                <div className="loading-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="input-container">
        <div className="input-tabs">
          <button 
            className={`tab ${inputType === 'chat' ? 'active' : ''}`}
            onClick={() => setInputType('chat')}
          >
            چت
          </button>
          <button 
            className={`tab ${inputType === 'image' ? 'active' : ''}`}
            onClick={() => setInputType('image')}
          >
            تولید تصویر
          </button>
          <button 
            className={`tab ${inputType === 'search' ? 'active' : ''}`}
            onClick={() => setInputType('search')}
          >
            جستجو
          </button>
        </div>
        
        <div className="input-area">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              inputType === 'chat' ? 'پیام خود را بنویسید...' :
              inputType === 'image' ? 'توضیح تصویر مورد نظر را بنویسید...' :
              'موضوع جستجو را بنویسید...'
            }
            className="message-input"
            rows="1"
            disabled={isLoading}
          />
          <button 
            onClick={sendMessage} 
            disabled={!inputMessage.trim() || isLoading}
            className="send-button"
          >
            {isLoading ? 'در حال ارسال...' : 'ارسال'}
          </button>
        </div>
        
        <div className="input-actions">
          <button onClick={clearChat} className="clear-button">
            پاک کردن چت
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AppSimple;