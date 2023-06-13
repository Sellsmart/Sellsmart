import bot from "./assets/bot.svg";
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
let lastInput ="Hi";
let containsOffer = false;
let offerName = "";
let isReadyForNewRequest = true;

let isOnPhone = true;
let el = document.getElementById("app");

let loadInterval;
let isFirstQuestion = true;


//check()
openChatbot()
spawnHelloMessage("Hi 👋, I am your personal shopping assistant. Nice to meet you 🤩")

spawnHelloMessage("What product are you searching for?")
isFirstQuestion = false;

function spawnHelloMessage(helloMessage){
  const uniqueId = generateUniqueId();

  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  typeText(messageDiv, helloMessage);
}
function check(){
  if(screen.width < 600){
    isOnPhone = true;
    var wrappers = document.getElementsByClassName("wrapper");
    for (var i = 0; i < wrappers.length; i++) {
      wrappers[i].style.display = "block";
    }
    document.getElementById("app").style.width = "auto";
  }
  else{
    isOnPhone = false;
  }
}

document.addEventListener('click', function(event) {
  var clickedElement = event.target;
  var clickedElementId = clickedElement.id;

  console.log('Clicked element ID: ' + clickedElementId);
  if(clickedElementId == ""){
    collapseChatbot();
  }
  else {
    openChatbot();
  }
});


window.addEventListener('scroll', setChatbotPosition);

function setChatbotPosition(){
  el.style.bottom = "0vh";
  el.style.right = "0vw";
}
function openChatbot(){

  if(isOnPhone){
    
    console.log("IS ON PHONE");
    document.getElementById("app").style.width = "auto";
    document.getElementById("app").style.marginLeft = "40px";
    return; 
  }
  else{
    var wrappers = document.getElementsByClassName("wrapper");
    for (var i = 0; i < wrappers.length; i++) {
      wrappers[i].style.display = "block";
    }
    document.getElementById("app").style.width = "300px";
  }
  
}
function collapseChatbot(){

  
  if(isOnPhone){
    
    return;
  }
  console.log(screen.width);
  document.getElementById("app").style.width = "100px";
  var wrappers = document.getElementsByClassName("wrapper");
  for (var i = 0; i < wrappers.length; i++) {
    wrappers[i].style.display = "none";
  }
}

function loader(element){
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if(element.textContent === '...'){
      element.textContent = '';
    }
  }, 300);
}
function setAllToParent(){
  console.log("Trying to set");
  var links = document.getElementsByTagName('a');
            for (var i = 0; i < links.length; i++) {
              console.log("Setting to parent");
                links[i].target = '_parent';
            }
}
function checkAndReplace(textInput) {

  var text = textInput;
  var words = text.split(" ");
console.log("Is checking and replacing");
  for (var i = 0; i < words.length; i++) {
    var word = words[i];

    if (word.startsWith("$§|")) {
      var replacedWord = ""; // Remove the "$§|" prefix at front and bottom
      containsOffer = true;
      words[i] = replacedWord;
      offerName = word.substring(4, word.length -4);
    }
  }

  return words.join(" ");
}

function checkForOffer() {
  // Your function logic here
  console.log("IS CHECKING FOR OFFER");
  if(containsOffer){
    var originalString = offerName;
    offerName = originalString.replace(/-/g, ' ');
    //Convert to readable string
    console.log("This is the offername " + offerName);
    containsOffer = false;
    if(offerName.toLowerCase().includes("nike") && offerName.toLowerCase().includes("dunk") && offerName.toLowerCase().includes("red")){
      chatContainer.innerHTML += chatStripe(true, offerName  + "\n" + `<div style="background-image: url(/assets/recimg/TeamRed.jpg);"class="imgForRecommend"></div><a class="buybutton" href="https://www.google.com" target="_parent">Check it out</a>`, "salestext"); 
    }
    else if(offerName.toLowerCase().includes("nike") && offerName.toLowerCase().includes("dunk") && offerName.toLowerCase().includes("gold")){ 
      chatContainer.innerHTML += chatStripe(true, offerName  + "\n" + `<div style="background-image: url(/assets/recimg/TeamGold.jpg);"class="imgForRecommend"></div><a class="buybutton" href="https://www.google.com" target="_parent">Check it out</a>`, "salestext"); 

    }
    else if(offerName.toLowerCase().includes("nike") && offerName.toLowerCase().includes("dunk") && offerName.toLowerCase().includes("orange")){
      chatContainer.innerHTML += chatStripe(true, offerName  + "\n" + `<div style="background-image: url(/assets/recimg/TeamOrange.jpg);"class="imgForRecommend"></div><a class="buybutton" href="https://www.google.com" target="_parent">Check it out</a>`, "salestext"); 

    }
   
}
chatContainer.scrollTop = chatContainer.scrollHeight;
  console.log("Triggered function!");
}


function typeText(element, text) {
  let index = 0;
  let previousWord = '';
  let currentWord = '';
  text = checkAndReplace(text);
  let interval = setInterval(() => {
    if (index < text.length) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
      const currentChar = text.charAt(index);
console.log(currentWord);
      // Check if the current character is a whitespace character or a punctuation mark
      if (/\s|[^\w/.:]/u.test(currentChar)) {
        
        // Check if the previous word is a link
        if (previousWord.startsWith('https://') || previousWord.startsWith('http://')) {
          // Convert the previous word into a clickable link
          const link = `<a class="inChatLink" href="${previousWord}">${previousWord}</a>`;
          element.innerHTML = element.innerHTML.replace(previousWord, link);
          
        }
        console.log("Runss");
        setAllToParent();
        previousWord = currentWord;
        currentWord = '';
      } else {
        currentWord += currentChar;
      }

      // Append the current character
      element.innerHTML += currentChar;
      index++;
    } else {
      if (currentWord.startsWith('https://') || currentWord.startsWith('http://')) {
          // Convert the previous word into a clickable link
          const link = `<a class="inChatLink" href="${currentWord}">${currentWord}</a>`;
          element.innerHTML = element.innerHTML.replace(currentWord, link);
          
        }
        checkForOffer();
        console.log("Runs");
        setAllToParent();
        
      clearInterval(interval);
    }
  }, 20);
  
}


 

 

function openLinkInParent() {
  window.parent.location.href = 'https://sellsmart.github.io/chatbot/'; // Replace with the desired URL
}

function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}
function WaitAndTryAgain(divForMg){
  console.log("WE THREW AN 429 error. retrying last request");
  typeText(divForMg, "Hi 👋, we are currently on high demand. Please stand by for 20 seconds. Thank you 😀");
  setTimeout(() => {
    // Retry the API call or perform any other necessary actions
    // Call the function that makes the API request again
    document.getElementById("area").value = lastInput;
  handleSubmit();
  }, 20000);
  
}
function chatStripe (isAi, value, uniqueId){
  return(
    `
    <div id="wrap" class="wrapper ${isAi && 'ai'}">
    <div id="chatbox" class="chat">
    <div id="profileId" class="profile">
    <img id="imagepic"
    src="${isAi ? bot : user}"
    alt="${isAi ? 'bot':user}"
    />
    </div>
    <div class="message" id=${uniqueId}>${value}</div>
    </div>
    </div>
    `

  )
}
// Function to convert plain text links into clickable links

const handleSubmit = async (e) => {
  
  if(isReadyForNewRequest == false){
    form.reset();
    console.log("Just one at a time");
    return;
  }
  isReadyForNewRequest = false;
  containsOffer = false;
  if(e != null){
    e.preventDefault();
  }

  const data = new FormData(form);
  /*if(data.get('prompt').trim() == "x"){
    collapseChatbot();
    form.reset();
    return;
  }*/
  // Check if the input is "x" and call the collapseChatbot() function
  
  if(data.get('prompt').trim() == ""){
    console.log("Nope");
    form.reset();
    return;
  }

  console.log("We are sending an API request with text: " + data.get('prompt'));
  //users stripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
lastInput = data.get('prompt');
  //Loader 

  form.reset();

  const uniqueId = generateUniqueId();

  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  // fetch data from server
  let promptToSend = "";
  if(isFirstQuestion){
    promptToSend = data.get('prompt') + "??%&!";
  }
  else{
    promptToSend = data.get('prompt');
  }
  const response = await fetch('https://sellsmart.onrender.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: promptToSend
    })
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    isReadyForNewRequest = true;
    const responseData = await response.json();
    console.log(responseData);
    const parsedData = responseData.bot.trim();

    typeText(messageDiv, parsedData);
    
    
  } else {
    isReadyForNewRequest = true;
    console.log("Response status: " + response.status);
    if (response.status === 429) {
      // Handle 429 error (Too Many Requests)
      console.log("Bro man 429 is in da hood");
      console.log("We are retrying");
      WaitAndTryAgain(messageDiv);
    } else {
      const err = await response.text();
      
      messageDiv.innerHTML = "Something went wrong";
   
    }
  }
};



form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})
