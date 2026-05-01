(function() {
  const RAILWAY_URL = 'https://chatbot-production-7076.up.railway.app';

  const styles = `
    #ai-chat-bubble {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a3a6e, #0f2347);
      border: 1px solid rgba(111,163,224,0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      z-index: 999999;
      transition: transform 0.2s;
    }
    #ai-chat-bubble:hover { transform: scale(1.08); }
    #ai-chat-bubble svg { width: 22px; height: 22px; fill: white; }
    #ai-chat-window {
      position: fixed;
      bottom: 92px;
      right: 24px;
      width: 340px;
      background: #0d0f18;
      border: 1px solid rgba(111,163,224,0.2);
      border-radius: 4px;
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 999999;
      box-shadow: 0 24px 80px rgba(0,0,0,0.5);
    }
    #ai-chat-header {
      background: linear-gradient(135deg, #0f2347, #1a3a6e);
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid rgba(111,163,224,0.15);
    }
    #ai-chat-header-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    #ai-chat-header-info { flex: 1; }
    #ai-chat-header-name {
      font-size: 14px;
      font-weight: 500;
      color: white;
      font-family: sans-serif;
    }
    #ai-chat-header-status {
      font-size: 10px;
      color: #6fa3e0;
      font-family: sans-serif;
      letter-spacing: 1px;
    }
    #ai-chat-close {
      background: none;
      border: none;
      color: rgba(255,255,255,0.4);
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
      padding: 2px 6px;
    }
    #ai-chat-close:hover { color: white; }
    #ai-chat-messages {
      padding: 12px;
      height: 260px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-family: sans-serif;
    }
    .ai-msg {
      max-width: 82%;
      padding: 9px 13px;
      font-size: 13px;
      line-height: 1.5;
      border-radius: 12px;
    }
    .ai-msg-bot {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.07);
      color: rgba(255,255,255,0.85);
      align-self: flex-start;
      border-bottom-left-radius: 3px;
    }
    .ai-msg-user {
      background: linear-gradient(135deg, #1a3a6e, #0f2347);
      border: 1px solid rgba(111,163,224,0.2);
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 3px;
    }
    .ai-typing {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.07);
      align-self: flex-start;
      border-radius: 12px;
      border-bottom-left-radius: 3px;
      padding: 10px 14px;
    }
    .ai-dots { display: flex; gap: 4px; }
    .ai-dots span {
      width: 5px; height: 5px;
      background: #6fa3e0;
      border-radius: 50%;
      animation: ai-bounce 1.3s infinite;
      opacity: 0.5;
    }
    .ai-dots span:nth-child(2) { animation-delay: 0.15s; }
    .ai-dots span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes ai-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-4px); opacity: 1; }
    }
    #ai-chat-input-row {
      display: flex;
      gap: 8px;
      padding: 10px 12px;
      border-top: 1px solid rgba(111,163,224,0.1);
    }
    #ai-chat-input {
      flex: 1;
      background: #111320;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 4px;
      padding: 9px 12px;
      font-size: 12px;
      color: white;
      font-family: sans-serif;
      outline: none;
    }
    #ai-chat-input::placeholder { color: rgba(255,255,255,0.2); }
    #ai-chat-input:focus { border-color: #6fa3e0; }
    #ai-send-btn {
      width: 34px;
      height: 34px;
      border-radius: 4px;
      background: linear-gradient(135deg, #1a3a6e, #0f2347);
      border: 1px solid rgba(111,163,224,0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    #ai-send-btn svg { width: 13px; height: 13px; fill: white; }
    #ai-chat-footer {
      text-align: center;
      padding: 6px;
      font-size: 9px;
      color: rgba(111,163,224,0.2);
      font-family: sans-serif;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  document.body.innerHTML += `
    <button id="ai-chat-bubble" onclick="aiToggleChat()">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
    </button>
    <div id="ai-chat-window">
      <div id="ai-chat-header">
        <div id="ai-chat-header-avatar">💬</div>
        <div id="ai-chat-header-info">
          <div id="ai-chat-header-name">Business Assistant</div>
          <div id="ai-chat-header-status">● Online · Replies instantly</div>
        </div>
        <button id="ai-chat-close" onclick="aiToggleChat()">×</button>
      </div>
      <div id="ai-chat-messages">
        <div class="ai-msg ai-msg-bot">Hi there! How can I help you today?</div>
      </div>
      <div id="ai-chat-input-row">
        <input type="text" id="ai-chat-input" placeholder="Type a message..." />
        <button id="ai-send-btn" onclick="aiSendMessage()">
          <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
        </button>
      </div>
      <div id="ai-chat-footer">Powered by AI</div>
    </div>
  `;

  document.getElementById('ai-chat-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') aiSendMessage();
  });

  let aiHistory = [];
  let aiIsOpen = false;

  window.aiToggleChat = function() {
    aiIsOpen = !aiIsOpen;
    const win = document.getElementById('ai-chat-window');
    win.style.display = aiIsOpen ? 'flex' : 'none';
    if (aiIsOpen) document.getElementById('ai-chat-input').focus();
  };

  window.aiSendMessage = async function() {
    const input = document.getElementById('ai-chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    aiAddMessage(text, 'user');
    aiHistory.push({ role: 'user', content: text });
    aiShowTyping();
    try {
      const res = await fetch(RAILWAY_URL + '/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: aiHistory.slice(0, -1) })
      });
      const data = await res.json();
      aiRemoveTyping();
      aiAddMessage(data.reply, 'bot');
      aiHistory.push({ role: 'assistant', content: data.reply });
    } catch (err) {
      aiRemoveTyping();
      aiAddMessage('Sorry, something went wrong. Please try again!', 'bot');
    }
  };

  function aiAddMessage(text, role) {
    const msgs = document.getElementById('ai-chat-messages');
    const div = document.createElement('div');
    div.className = 'ai-msg ai-msg-' + role;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function aiShowTyping() {
    const msgs = document.getElementById('ai-chat-messages');
    const div = document.createElement('div');
    div.className = 'ai-typing';
    div.id = 'ai-typing';
    div.innerHTML = '<div class="ai-dots"><span></span><span></span><span></span></div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function aiRemoveTyping() {
    const t = document.getElementById('ai-typing');
    if (t) t.remove();
  }
})();