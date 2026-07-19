/**
 * SMART STADIUM AI (3D EDITION) - CHAT & VOICE CONTROLLER
 * Handles: Chat Q&A, Session memory, Follow-up chips, Voice Speech I/O, PDF Export & Throttling
 */

(function () {
  'use strict';

  let chatHistory = [];
  let isSpeechRecognizing = false;
  let recognition = null;
  let isSending = false;
  const sessionId = "session_" + Math.random().toString(36).substring(2, 9);

  // DOM Elements
  const chatForm = document.getElementById('chatForm');
  const userInput = document.getElementById('userInput');
  const chatBox = document.getElementById('chat-box');
  const typingIndicator = document.getElementById('typing-indicator');
  const sendBtn = document.getElementById('sendBtn');
  const clearChatBtn = document.getElementById('clearChatBtn');
  const copyChatBtn = document.getElementById('copyChatBtn');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const voiceMicBtn = document.getElementById('voiceMicBtn');
  const micIcon = document.getElementById('micIcon');
  const languageSelect = document.getElementById('languageSelect');
  const followUpContainer = document.getElementById('followUpContainer');
  const followUpChips = document.getElementById('followUpChips');

  if (window.marked) {
    window.marked.setOptions({ breaks: true, gfm: true });
  }

  // --- Voice Input (SpeechRecognition) Setup ---
  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (voiceMicBtn) voiceMicBtn.style.display = 'none';
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function () {
      isSpeechRecognizing = true;
      if (micIcon) micIcon.className = "fa-solid fa-microphone-slash text-danger pulse-dot";
      if (userInput) userInput.placeholder = "Listening... Speak now!";
    };

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      if (userInput) userInput.value = transcript;
      stopSpeechRecognition();
      if (chatForm) chatForm.dispatchEvent(new Event('submit'));
    };

    recognition.onerror = function () {
      stopSpeechRecognition();
      if (window.showAppToast) window.showAppToast("Voice Error", "Could not capture speech.");
    };

    recognition.onend = function () {
      stopSpeechRecognition();
    };
  }

  function toggleSpeechRecognition() {
    if (!recognition) initSpeechRecognition();
    if (!recognition) return;

    if (isSpeechRecognizing) {
      stopSpeechRecognition();
    } else {
      const lang = languageSelect ? languageSelect.value : 'English';
      const langMap = { 'English': 'en-US', 'Spanish': 'es-ES', 'French': 'fr-FR', 'Portuguese': 'pt-BR', 'Hindi': 'hi-IN' };
      recognition.lang = langMap[lang] || 'en-US';
      recognition.start();
    }
  }

  function stopSpeechRecognition() {
    isSpeechRecognizing = false;
    if (recognition) recognition.stop();
    if (micIcon) micIcon.className = "fa-solid fa-microphone text-danger";
    if (userInput) userInput.placeholder = "Ask Stadia anything about the stadium (e.g. 'Where is Food Court?')...";
  }

  // --- Text-to-Speech Output ---
  window.speakText = function (text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*#_`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const lang = languageSelect ? languageSelect.value : 'English';
    const langMap = { 'English': 'en-US', 'Spanish': 'es-ES', 'French': 'fr-FR', 'Portuguese': 'pt-BR', 'Hindi': 'hi-IN' };
    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 1.0;

    window.speechSynthesis.speak(utterance);
  };

  // Render Smart Follow-Up Chips
  function renderFollowUpChips(chips) {
    if (!followUpContainer || !followUpChips) return;
    if (!chips || chips.length === 0) {
      followUpContainer.classList.add('d-none');
      return;
    }

    followUpChips.innerHTML = '';
    chips.forEach(chipText => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-followup';
      btn.innerText = chipText;
      btn.addEventListener('click', () => sendChatMessage(chipText));
      followUpChips.appendChild(btn);
    });

    followUpContainer.classList.remove('d-none');
  }

  // --- Render Chat Message ---
  function appendMessage(sender, text, isMarkdown = false) {
    const isBot = sender === 'bot';
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${isBot ? 'bot-message' : 'user-message d-flex justify-content-end'} mb-3 d-flex gap-3`;

    let htmlContent = isMarkdown && window.marked ? window.marked.parse(text) : `<p class="mb-0">${escapeHtml(text)}</p>`;

    if (isBot) {
      msgDiv.innerHTML = `
        <div class="bot-icon-circle rounded-circle p-2 text-white bg-primary text-center align-self-start flex-shrink-0" style="width:36px; height:36px;">
          <i class="fa-solid fa-robot fs-6"></i>
        </div>
        <div class="message-content glass-bubble p-3 rounded-4 text-white">
          <div class="message-text markdown-body">${htmlContent}</div>
          <div class="d-flex align-items-center gap-2 mt-2 pt-1 border-top border-secondary opacity-75">
            <button class="btn btn-link p-0 text-light-50 fs-xs text-decoration-none speak-btn"><i class="fa-solid fa-volume-high me-1"></i> Listen</button>
            <span class="fs-xs text-light-50">•</span>
            <button class="btn btn-link p-0 text-light-50 fs-xs text-decoration-none copy-msg-btn"><i class="fa-solid fa-copy me-1"></i> Copy</button>
          </div>
        </div>
      `;

      msgDiv.querySelector('.speak-btn').addEventListener('click', () => window.speakText(text));
      msgDiv.querySelector('.copy-msg-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(text);
        if (window.showAppToast) window.showAppToast("Copied", "Response copied to clipboard!");
      });

    } else {
      msgDiv.innerHTML = `
        <div class="message-content glass-bubble p-3 rounded-4 text-white text-start">
          <p class="mb-0">${escapeHtml(text)}</p>
        </div>
        <div class="user-icon-circle rounded-circle p-2 text-white bg-secondary text-center align-self-start flex-shrink-0" style="width:36px; height:36px;">
          <i class="fa-solid fa-user fs-6"></i>
        </div>
      `;
    }

    if (chatBox) {
      chatBox.appendChild(msgDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    chatHistory.push({ sender, text, timestamp: new Date().toLocaleTimeString() });
  }

  // Streaming/Typing Effect Reveal
  function appendBotMessageWithTyping(fullText, followUps = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message bot-message mb-3 d-flex gap-3';

    msgDiv.innerHTML = `
      <div class="bot-icon-circle rounded-circle p-2 text-white bg-primary text-center align-self-start flex-shrink-0" style="width:36px; height:36px;">
        <i class="fa-solid fa-robot fs-6"></i>
      </div>
      <div class="message-content glass-bubble p-3 rounded-4 text-white">
        <div class="message-text markdown-body"></div>
        <div class="d-flex align-items-center gap-2 mt-2 pt-1 border-top border-secondary opacity-75">
          <button class="btn btn-link p-0 text-light-50 fs-xs text-decoration-none speak-btn"><i class="fa-solid fa-volume-high me-1"></i> Listen</button>
          <span class="fs-xs text-light-50">•</span>
          <button class="btn btn-link p-0 text-light-50 fs-xs text-decoration-none copy-msg-btn"><i class="fa-solid fa-copy me-1"></i> Copy</button>
        </div>
      </div>
    `;

    if (chatBox) {
      chatBox.appendChild(msgDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    const textContainer = msgDiv.querySelector('.message-text');
    let index = 0;
    const speed = 10;

    function typeChunk() {
      if (index < fullText.length) {
        index += 3;
        const currentSub = fullText.substring(0, index);
        textContainer.innerHTML = window.marked ? window.marked.parse(currentSub) : escapeHtml(currentSub);
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        setTimeout(typeChunk, speed);
      } else {
        textContainer.innerHTML = window.marked ? window.marked.parse(fullText) : escapeHtml(fullText);
        msgDiv.querySelector('.speak-btn').addEventListener('click', () => window.speakText(fullText));
        msgDiv.querySelector('.copy-msg-btn').addEventListener('click', () => {
          navigator.clipboard.writeText(fullText);
          if (window.showAppToast) window.showAppToast("Copied", "Response copied to clipboard!");
        });
        renderFollowUpChips(followUps);
      }
    }

    typeChunk();
    chatHistory.push({ sender: 'bot', text: fullText, timestamp: new Date().toLocaleTimeString() });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }

  // --- Send Chat Request to Backend ---
  window.sendChatMessage = async function (promptText, module = 'general') {
    if (!promptText || !promptText.trim() || isSending) return;

    isSending = true;
    const userPrompt = promptText.trim();
    appendMessage('user', userPrompt);

    if (userInput) userInput.value = '';
    if (sendBtn) sendBtn.disabled = true;
    if (typingIndicator) typingIndicator.classList.remove('d-none');

    const selectedLang = languageSelect ? languageSelect.value : 'English';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          language: selectedLang,
          module: module,
          session_id: sessionId
        })
      });

      const data = await response.json();

      if (typingIndicator) typingIndicator.classList.add('d-none');
      if (sendBtn) sendBtn.disabled = false;
      isSending = false;

      if (data.response) {
        appendBotMessageWithTyping(data.response, data.follow_ups || []);
      } else {
        appendMessage('bot', "I apologize, I could not process your request right now. Please try again.");
      }

    } catch (err) {
      console.error("Chat error:", err);
      if (typingIndicator) typingIndicator.classList.add('d-none');
      if (sendBtn) sendBtn.disabled = false;
      isSending = false;
      appendMessage('bot', "⚠️ **Network Error:** Unable to connect to Stadia AI backend. Please check your connection.");
    }
  };

  // --- PDF Export ---
  function exportChatToPdf() {
    if (!window.jspdf) {
      if (window.showAppToast) window.showAppToast("PDF Error", "PDF plugin loading...");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(59, 130, 246);
    doc.text("FIFA World Cup 2026 - Smart Stadium AI (Stadia)", 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Conversation Transcript Log - Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.line(14, 32, 196, 32);

    let yPos = 40;
    chatHistory.forEach((msg) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setTextColor(msg.sender === 'user' ? 37 : 16, msg.sender === 'user' ? 99 : 185, msg.sender === 'user' ? 235 : 129);
      doc.text(`[${msg.timestamp}] ${msg.sender.toUpperCase()}:`, 14, yPos);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(50);

      const splitText = doc.splitTextToSize(msg.text, 175);
      doc.text(splitText, 14, yPos + 6);
      yPos += 8 + (splitText.length * 5);
    });

    doc.save(`StadiaAI_Transcript_${Date.now()}.pdf`);
    if (window.showAppToast) window.showAppToast("PDF Exported", "Conversation saved as PDF document!");
  }

  document.addEventListener('DOMContentLoaded', () => {
    initSpeechRecognition();

    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendChatMessage(userInput.value);
      });
    }

    if (voiceMicBtn) voiceMicBtn.addEventListener('click', toggleSpeechRecognition);

    if (clearChatBtn) {
      clearChatBtn.addEventListener('click', () => {
        if (chatBox) chatBox.innerHTML = '';
        chatHistory = [];
        if (followUpContainer) followUpContainer.classList.add('d-none');
        if (window.showAppToast) window.showAppToast("Chat Cleared", "Conversation history cleared.");
      });
    }

    if (copyChatBtn) {
      copyChatBtn.addEventListener('click', () => {
        const text = chatHistory.map(m => `[${m.sender.toUpperCase()}]: ${m.text}`).join('\n\n');
        navigator.clipboard.writeText(text);
        if (window.showAppToast) window.showAppToast("Copied", "Full transcript copied to clipboard.");
      });
    }

    if (downloadPdfBtn) downloadPdfBtn.addEventListener('click', exportChatToPdf);

    document.querySelectorAll('.btn-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        sendChatMessage(chip.getAttribute('data-prompt'));
      });
    });
  });

})();
