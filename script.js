const msgInput = document.querySelector(".message-input");
const chatBody = document.querySelector(".chat-body");
const sendMsgBtn = document.querySelector("#send-message");
const userData = {
  message: null,
};
//API setup
const API_KEY = "AQ.Ab8RN6K16LVUd7qsVv71V2Br3q7TwlNqaaLlFIDna93x4nr2iQ";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`;
const genereteBotResponse = async () => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: userData.message }]
        }
      ]
    })
  };
  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
//taking user message into variable
msgInput.addEventListener("keydown", (e) => {
  const userMsg = e.target.value.trim();

  if (e.key === "Enter" && userMsg) {
    outgoingMessage(e);
  }
});

//saving message in element and appending that in page
function outgoingMessage(e) {
  e.preventDefault();
  userData.message = msgInput.value.trim();
  msgInput.value = "";
  const messageForElement = `
                <div class="message-text">
                   
                </div>`;

  const messageDiv = createMessageElement(messageForElement, "user-message");
  messageDiv.querySelector(".message-text").textContent = userData.message;
  chatBody.appendChild(messageDiv);

  //simulate bot response with thinking indicator after delay
  setTimeout(() => {
    const messageForElement = `
                 <div class="message bot-message">
                <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#fff"><path d="M160-120v-220q0-24.75 17.63-42.38Q195.25-400 220-400h520q24.75 0 42.38 17.62Q800-364.75 800-340v220H160Zm200-320q-83 0-141.5-58.5T160-640q0-83 58.5-141.5T360-840h240q83 0 141.5 58.5T800-640q0 83-58.5 141.5T600-440H360ZM220-180h520v-160H220v160Zm140-320h240q58.33 0 99.17-40.76 40.83-40.77 40.83-99Q740-698 699.17-739q-40.84-41-99.17-41H360q-58.33 0-99.17 40.76-40.83 40.77-40.83 99Q220-582 260.83-541q40.84 41 99.17 41Zm21.5-118.68q8.5-8.67 8.5-21.5 0-12.82-8.68-21.32-8.67-8.5-21.5-8.5-12.82 0-21.32 8.68-8.5 8.67-8.5 21.5 0 12.82 8.68 21.32 8.67 8.5 21.5 8.5 12.82 0 21.32-8.68Zm240 0q8.5-8.67 8.5-21.5 0-12.82-8.68-21.32-8.67-8.5-21.5-8.5-12.82 0-21.32 8.68-8.5 8.67-8.5 21.5 0 12.82 8.68 21.32 8.67 8.5 21.5 8.5 12.82 0 21.32-8.68ZM480-180Zm0-460Z"/>
                </svg>
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>
            </div>
            `;

    const messageDiv = createMessageElement(messageForElement, "bot-message");
    chatBody.appendChild(messageDiv);
    genereteBotResponse();
  }, 600);
}

//create message element with dynamic classes and return it
function createMessageElement(ele, classes) {
  let div = document.createElement("div");
  div.classList.add("message", classes);
  div.innerHTML = ele;
  return div;
}

sendMsgBtn.addEventListener("click", (e) => outgoingMessage(e));
