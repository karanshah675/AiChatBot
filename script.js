// const { use } = require("react");

const msgInput = document.querySelector(".message-input");
const chatBody = document.querySelector(".chat-body");
const sendMsgBtn = document.querySelector("#send-message");
const fileInpt = document.querySelector("#file-input");
const imgUpload = document.querySelector("#image-upload");
const fileUploadWapper = document.querySelector(".file-upload-wrapper");
const fileCancelBtn = document.querySelector("#file-cancel")
const chatBotToggler = document.querySelector("#chatbot-toggler")
const userData = {
  message: null,
  file: {
    data: null,
    mime_type: null,
  },
};
//API setup

const API_KEY = "API_KEY";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`;
//! try and catch method for api
// const genereteBotResponse = async () => {
//   const requestOptions = {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [{ text: userData.message }]
//         }
//       ]
//     })
//   };
//   try {
//     const response = await fetch(API_URL, requestOptions);
//     const data = await response.json();
//     if (!response.ok) throw new Error(data.error.message);
//     console.log(data);
//   } catch (error) {
//     console.log(error);
//   }
// };
//! fetch api then catch method
const genereteBotResponseThroughFetch = (messageDiv) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: userData.message }, ...(userData.file.data ? [{inline_data : userData.file }] : [])],
        },
      ],
    }),
  };
  const getBotResponse = fetch(API_URL, requestOptions);
  getBotResponse
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const apiResponse = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      //  console.log(apiResponse);
      messageDiv.querySelector(".message-text").innerHTML = apiResponse;

      // botResponse.response = data.candidates[0].content.parts[0].text
      // chatBody.querySelector('.thinking-indicator').remove()
    })
    .catch((error) => {
      console.log(error);
      messageDiv.querySelector(".message-text").innerHTML = error;
      messageDiv.querySelector(".message-text").style.color = "#ff0000";
    })
    .finally((messageDiv) => {
      userData.file={};
      // msgInput.classList.remove("thinking")
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    });
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
                   
                </div>
                ${
                  userData.file.data ? `<img class="attatchment" id="previewImg" src = "data:${userData.file.mime_type};base64,${userData.file.data}"/>` : ""
                }
                `;

  const messageDiv = createMessageElement(messageForElement, "user-message");
  messageDiv.querySelector(".message-text").textContent = userData.message;
  chatBody.appendChild(messageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
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
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    //!generate gemini response
    // genereteBotResponse();
    genereteBotResponseThroughFetch(messageDiv);
  }, 600);
}

//create message element with dynamic classes and return it
function createMessageElement(ele, classes) {
  let div = document.createElement("div");
  div.classList.add("message", classes);
  div.innerHTML = ele;
  return div;
}

fileInpt.addEventListener("change", () => {
  const file = fileInpt.files[0];
  if (!file) return;
  

  const reader = new FileReader();
  reader.onload = (e) => {
    // console.log(e.target.result);
    fileUploadWapper.querySelector("img").src=e.target.result
    fileUploadWapper.querySelector("img").classList.add("file-uploaded")
    
    const base64String = e.target.result.split(",")[1];
    userData.file = {
      data: base64String,
      mime_type: file.type,
    };
    fileInpt.value=""
  };
  
  reader.readAsDataURL(file);
});

sendMsgBtn.addEventListener("click", (e) => outgoingMessage(e));
document
  .querySelector("#file-upload")
  .addEventListener("click", () => fileInpt.click());

fileCancelBtn.addEventListener("click",()=>{
  // document.querySelector("#previewImg").classList.toggle("file-uploaded")
  // alert("heelo")
  fileUploadWapper.querySelector("img").src=""
      fileUploadWapper.querySelector("img").classList.toggle("file-uploaded")
        userData.file.data = ""
        userData.file.mime_type = ""
        fileInpt.value=""
})

const picker = new EmojiMart.Picker({
  theme:"dark",
  skinTonePosition:"none",
  previewPosition:"none",
  onEmojiSelect:(emoji)=>{
    const {selectionStart : start,selectionEnd : end} = msgInput;
    msgInput.setRangeText(emoji.native,start ,end, "end");
    msgInput.focus();
  },
  onClickOutside: (e)=>{
    if(e.target.id === "emoji-picker"){
      document.querySelector("em-emoji-picker").classList.toggle("visible")
    }else{
      
      document.querySelector("em-emoji-picker").style.visibility = "hidden"
    }
    // console.log(e.target.id);
    
  }
})

document.querySelector(".chat-form").appendChild(picker)
let emojiBtn = document
  .querySelector("em-emoji-picker")
  .shadowRoot 
console.log(emojiBtn);

chatBotToggler.addEventListener("click",()=>
  document.body.classList.toggle("show-chatbot")
)
