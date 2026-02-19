# AI Email Agent – Local LLM Powered

A simple, **privacy-focused** web app that lets you generate polite professional emails using a **local AI model** (no cloud API keys needed for generation) and send them via EmailJS (free tier).

You describe the topic, recipient, and extra details → the local LLM (via LM Studio / Ollama / GPT4All) writes a nice email → preview → send.

Fully runs in your browser + local machine. No data leaves your computer except the final email send.

https://github.com/yourusername/ai-email-agent  
*(replace with your actual repo URL after creating it)*

## Features
- 100% local AI generation (using LM Studio, Ollama, or GPT4All)
- Beautiful single-page interface (HTML + CSS + JS)
- Preview generated email before sending
- Sends real emails using EmailJS (free plan: 200/month)
- No cloud dependency for the LLM part → full privacy

## Demo (how it looks)

(You can add 2-3 screenshots here later – e.g. form filled, preview shown, success message)

## Requirements
- Modern browser (Chrome/Edge/Firefox recommended)
- LM Studio, Ollama, or GPT4All installed and running locally
- EmailJS account (free) with a connected service and template

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Eisaakber//ai-email-agent.git
   cd ai-email-agent

Set up EmailJS
Go to https://www.emailjs.com → sign up (free)
Add a service (e.g. connect Gmail)
Create a template with variables: {{subject}}, {{message_body}}, {{from_name}}, {{to_name}}
Copy your:
Public Key
Service ID
Template ID

Open script.js and replace these lines:JavaScriptconst EMAILJS_PUBLIC_KEY   = "YOUR_PUBLIC_KEY_HERE";
const EMAILJS_SERVICE_ID   = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID  = "YOUR_TEMPLATE_ID";

Set up a local LLM backend (choose one)Option A: LM Studio (recommended – easiest browser support)
Download: https://lmstudio.ai
Load a model (e.g. Llama 3.2 3B Instruct GGUF)
Go to Developer tab → enable CORS → start server (default port 1234)
Option B: Ollama
Install: https://ollama.com
Run in terminal:Bashollama pull llama3.2:3b
Server auto-starts on port 11434
Option C: GPT4All
Download: https://gpt4all.io
Enable Local API Server in settings (port 4891)

Update script.js for your chosen backend
Change these lines according to your choice:JavaScript// LM Studio (recommended)
const GPT4ALL_API_URL = "http://localhost:1234/v1/chat/completions";
const MODEL_NAME = "";  // usually blank – uses loaded model

// OR Ollama
// const GPT4ALL_API_URL = "http://localhost:11434/v1/chat/completions";
// const MODEL_NAME = "llama3.2:3b";

// OR GPT4All
// const GPT4ALL_API_URL = "http://localhost:4891/v1/chat/completions";
// const MODEL_NAME = "Llama 3.2 3B Instruct";

How to Run

Start your local LLM server (LM Studio / Ollama / GPT4All) and make sure a model is loaded.
Test: open browser → http://localhost:1234/v1/models (or your port) → should show JSON

Serve the web app locally (do NOT double-click index.html)
Option A (easiest – VS Code):
Install "Live Server" extension
Right-click index.html → Open with Live Server

Option B (Python built-in):Bashpython -m http.server 8000Then open: http://localhost:8000

Use the app
Fill in your name, recipient email/name, topic, extra details
Click "Generate Email with Local AI"
Preview → click "Send This Email via EmailJS"
Check your inbox/spam (and the recipient's)


Troubleshooting

"Failed to fetch" → make sure LLM server is running + use Live Server / Python server (not file://)
Email sent but not received → check spam/junk, test from EmailJS dashboard, reconnect service
OPTIONS / 'messages' error → enable CORS in LM Studio Developer tab
