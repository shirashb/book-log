document.addEventListener("DOMContentLoaded", function () {
  const sendButton = document.getElementById("send-button");
  const userInput = document.getElementById("user-input");
  const messagesDiv = document.getElementById("messages");
  const closeChatbot = document.getElementById("close-chatbot");
  const chatbot = document.getElementById("chatbot");
  const showChatbotButton = document.getElementById("show-chatbot");
  const chatbotHeader = document.getElementById("chatbot-header");
  const chatWindow = document.getElementById("chat-window");

  const API_KEY =
    "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";
  const API_URL = "https://openrouter.ai/api/v1/chat/completions";

  chatbot.style.display = "none";
  showChatbotButton.style.display = "block";

  sendButton.addEventListener("click", async () => {
    const userMessage = userInput.value.trim();

    if (userMessage) {
      appendMessage("You", userMessage);
      userInput.value = "";

      const generatingMessageDiv = appendMessage("Bot", "Generating...");

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "google/gemini-2.0-flash-lite-preview-02-05:free",
            messages: [{ role: "user", content: userMessage }],
          }),
        });

        const data = await response.json();
        const botMessage = data.choices[0].message.content;

        generatingMessageDiv.textContent = `Bot: ${botMessage}`;
      } catch (error) {
        console.error("Error fetching chatbot response:", error);
        generatingMessageDiv.textContent =
          "Bot: Sorry, something went wrong. Please try again.";
      }
    }
  });

  function appendMessage(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(sender.toLowerCase());
    messageDiv.textContent = `${sender}: ${message}`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return messageDiv;
  }

  showChatbotButton.addEventListener("click", () => {
    chatbot.style.display = "flex";
    showChatbotButton.style.display = "none";
  });

  closeChatbot.addEventListener("click", () => {
    chatbot.style.display = "none";
    showChatbotButton.style.display = "block";
  });

  chatbotHeader.addEventListener("click", (e) => {
    if (e.target === closeChatbot) return;
    chatWindow.style.display =
      chatWindow.style.display === "none" ? "block" : "none";
  });
});
