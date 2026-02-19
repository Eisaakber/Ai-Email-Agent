// ── CHANGE THESE VALUES ────────────────────────────────────────
// EmailJS credentials (from https://dashboard.emailjs.com)
const EMAILJS_PUBLIC_KEY   = "YOUR_PUBLIC_KEY_HERE";     // e.g. user_abc123xyz
const EMAILJS_SERVICE_ID   = "YOUR_SERVICE_ID";           // e.g. service_xyz789
const EMAILJS_TEMPLATE_ID  = "YOUR_TEMPLATE_ID";          // e.g. template_contact

// Local LLM server URL (change based on what you're using)
const LLM_API_URL = "http://localhost:1234/v1/chat/completions";   // LM Studio default
// const LLM_API_URL = "http://localhost:11434/v1/chat/completions";   // Ollama
// const LLM_API_URL = "http://localhost:4891/v1/chat/completions";    // GPT4All

const MODEL_NAME = "";  // For LM Studio usually leave blank
// For Ollama: "llama3.2:3b"
// For GPT4All: "Llama 3.2 3B Instruct"

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

const form = document.getElementById("emailForm");
const previewDiv = document.getElementById("preview");
const emailContent = document.getElementById("emailContent");
const sendBtn = document.getElementById("sendBtn");
const editBtn = document.getElementById("editBtn");
const status = document.getElementById("status");

let currentEmailData = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "Generating email with local AI... (ensure server is running)";

  const fromName = document.getElementById("fromName").value.trim();
  const toEmail  = document.getElementById("toEmail").value.trim();
  const toName   = document.getElementById("toName").value.trim() || "there";
  const topic    = document.getElementById("topic").value.trim();
  const extra    = document.getElementById("extra").value.trim();

  const prompt = `
You are a polite professional email writer.
Write a short, clear, courteous email (4–8 sentences maximum).

Subject: clear and related to "${topic}"

Body:
- Greet ${toName},
- Introduce briefly (from ${fromName})
- Explain purpose: ${topic}
${extra ? "Include these points: " + extra : ""}
- Clearly ask the person to reply / send / attach / confirm something
- Polite closing with ${fromName}

Return ONLY in this format:
Subject: [your subject here]

[full email body here – no extra text]
  `.trim();

  try {
    const res = await fetch(LLM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: "You are a helpful and professional email assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.65,
        max_tokens: 450,
        stream: false
      })
    });

    if (!res.ok) {
      throw new Error(`Local AI server error – status ${res.status}. Check if server is running and CORS is enabled.`);
    }

    const data = await res.json();
    const generated = data.choices?.[0]?.message?.content?.trim() || "Error: no response from AI";

    currentEmailData = { generated, toEmail, toName, fromName, topic };

    emailContent.textContent = generated;
    previewDiv.classList.remove("hidden");
    form.classList.add("hidden");
    status.textContent = "";
  } catch (err) {
    status.textContent = "Error: " + err.message + "\nMake sure your local AI server is running and CORS is enabled.";
    console.error(err);
  }
});

sendBtn.addEventListener("click", () => {
  if (!currentEmailData) return;

  if (!confirm("Send this email now?")) return;

  status.textContent = "Sending email...";

  const lines = currentEmailData.generated.split("\n\n", 2);
  let subject = "";
  let body = currentEmailData.generated;

  if (lines.length >= 2) {
    subject = lines[0].replace(/^Subject:\s*/i, "").trim();
    body = lines[1].trim();
  } else if (currentEmailData.generated.toLowerCase().startsWith("subject:")) {
    const parts = currentEmailData.generated.split("\n", 2);
    subject = parts[0].replace(/^Subject:\s*/i, "").trim();
    body = (parts[1] || "").trim();
  }

  const templateParams = {
    from_name: currentEmailData.fromName,
    to_name: currentEmailData.toName,
    subject: subject || currentEmailData.topic,
    message_body: body,
    to_email: currentEmailData.toEmail
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      status.textContent = "Email sent successfully! ✓ Check inbox/spam.";
      previewDiv.classList.add("hidden");
      form.classList.remove("hidden");
      form.reset();
      currentEmailData = null;
    })
    .catch((err) => {
      status.textContent = "Send failed: " + (err.text || err.message);
      console.error(err);
    });
});

editBtn.addEventListener("click", () => {
  previewDiv.classList.add("hidden");
  form.classList.remove("hidden");
  status.textContent = "";
});
