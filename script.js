import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// CONFIGURATION
// Warning: Hardcoding API keys in frontend code is not secure for production.
const API_KEY = "AIzaSyCEIHgrIVLLtpDvsiHyDKtq3cvs7KiOER8"; 
const MODEL_NAME = "gemini-2.5-flash"; 

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function handleChat() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Append User Message
    appendMessage(text, 'user');
    userInput.value = '';
    
    // 2. Loading State
    const loadingId = addLoading();

    try {
        // 3. API Call
        const result = await model.generateContent(text);
        const response = await result.response;
        const aiText = response.text();

        // 4. Remove Loading and Append AI Response
        removeLoading(loadingId);
        appendMessage(aiText, 'ai');
    } catch (error) {
        removeLoading(loadingId);
        appendMessage("Error: " + error.message, 'ai');
    }
}

function appendMessage(content, sender) {
    const div = document.createElement('div');
    div.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
    
    const inner = document.createElement('div');
    inner.className = `p-4 max-w-[80%] shadow-sm ${sender === 'user' ? 'user-msg' : 'ai-msg'}`;
    
    // Render Markdown for AI responses
    if (sender === 'ai') {
        inner.innerHTML = marked.parse(content);
    } else {
        inner.textContent = content;
    }

    div.appendChild(inner);
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addLoading() {
    const id = 'loading-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'flex justify-start';
    div.innerHTML = `<div class="ai-msg p-4 italic text-gray-400">Thinking...</div>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
}

function removeLoading(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// Event Listeners
sendBtn.addEventListener('click', handleChat);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});

// Emoji Functions (Attached to window so HTML onclick can find them)
window.toggleEmoji = () => {
    const picker = document.getElementById('emoji-picker');
    picker.style.display = picker.style.display === 'grid' ? 'none' : 'grid';
};

window.addEmoji = (emoji) => {
    const input = document.getElementById('user-input');
    input.value += emoji;
    document.getElementById('emoji-picker').style.display = 'none';
    input.focus();
};