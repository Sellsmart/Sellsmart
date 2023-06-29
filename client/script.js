import bot from "./assets/bot.svg";
import user from './assets/user.svg';


const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
let lastInput ="Hi";
let containsOffer = false;
let offerName = "";
let isReadyForNewRequest = true;
let ar = document.getElementById("area");
let isOnPhone = true;
let el = document.getElementById("app");

let loadInterval;
let isFirstQuestion = true;

let questionsAsked = 0;


check()



openChatbot()

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
async function askForFeeback(waitCount) {
  await delay(waitCount);
  chatContainer.innerHTML += chatStripe(
    true,
    "How was your experience so far? " +
      "\n" +
      `<a class="ratebutton" id="rev-good">Good 👍</a> <a class="ratebutton"  id="rev-bad">Bad 👎</a>`,
    "salestext"
  );

  document.getElementById("rev-good").addEventListener("click", gotGoodReview);
  document.getElementById("rev-bad").addEventListener("click", gotBadReview);

}

async function productRecommended(what){


console.log("Product got recommended");
  const promptSend = what + "prslsgo!24";
  const response = await fetch('http://localhost:5102', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: promptSend
    })
  });



  if (response.ok) {
    
    
    
  } else {
   
      const err = await response.text();
      
      messageDiv.innerHTML = "Something went wrong";
   
    
  }
}

async function gotBadReview(){
  document.getElementById("rev-good").style.opacity = 0.4;
document.getElementById("rev-bad").style.opacity = 0.4;
chatContainer.innerHTML += chatStripe(
  true,
  "It's sad to see you not liking it 🥲 We'll keep on developing to make it perfect for everyone to use."
);
  console.log("We got a bad review :-(");
  const promptSend = "it is a bad review with this review given -.--.";
  const response = await fetch('http://localhost:5102', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: promptSend
    })
  });



  if (response.ok) {
    
    
    
  } else {
   
      const err = await response.text();
      
      messageDiv.innerHTML = "Something went wrong";
   
    
  }

}
var timerId;

function startTimer() {
  timerId = setTimeout(triggerFunction, 45000); // Start the timer for 15 seconds (15,000 milliseconds)
}

function stopTimer() {
  clearTimeout(timerId); // Cancel the timer if needed
}

function triggerFunction() {
  collapseChatbot();
}
startTimer();
async function gotGoodReview(){
  document.getElementById("rev-good").style.opacity = 0.4;
document.getElementById("rev-bad").style.opacity = 0.4;
chatContainer.innerHTML += chatStripe(
  true,
  "Thank you for your good review. We are glad you liked it 🎉"
);
  console.log("We got a bad review :-(");
  const promptSend = "it is a good review with this review given -.--.";
  const response = await fetch('http://localhost:5102', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: promptSend
    })
  });



  if (response.ok) {
    
    
    
  } else {
   
      console.log("Review already given");
   
    
  }

}
function godGoodReview(){

}
async function spawnHelloMessages() {
  spawnHelloMessage("Hi 👋, I am your personal shopping assistant. Nice to meet you 🤩");
  await delay(2500); // Adjust the delay time as per your requirement (in milliseconds)
  spawnHelloMessage("Feel free to ask any question. Btw this message is fully customisable so you can great your customers the way you want (also with products) 😀");
}

spawnHelloMessages();

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
  if(clickedElementId == "myButton"){
    collapseChatbot();
  }
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
  startTimer();
  ar.placeholder = "Ask something...";
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

  console.log("IS COLLAPSING CHATBOT");
  if(isOnPhone){
    console.log("IS ON PHONE");
    return;
  }
  ar.placeholder = "Click";
  console.log(screen.width);
  document.getElementById("app").style.width = "100px";
  var wrappers = document.getElementsByClassName("wrapper");
  for (var i = 0; i < wrappers.length; i++) {
    wrappers[i].style.display = "none";
  }
  console.log("RAN THE ENTIRE FUNCTION");
}
function funcToCollapse(){
  console.log("Checking");
  collapseChatbot();
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
    if(offerName.toLowerCase().includes("our") && offerName.toLowerCase().includes("chatbot") && offerName.toLowerCase().includes("best")){
      productRecommended("Our chatbot");
      chatContainer.innerHTML += chatStripe(true, "Chatbot for business: "  + "\n" + `<div style="background-image: url(https://cdn.pixabay.com/photo/2019/03/21/15/51/chatbot-4071274_1280.jpg);"class="imgForRecommend"></div><a class="buybutton" href="https://sellsmart.github.io/chatbot#custom" target="_parent">Check it out</a>`, "salestext"); 
    }
    else if(offerName.toLowerCase().includes("custom")){
      productRecommended("Custom");
      chatContainer.innerHTML += chatStripe(true, "Chatbot for business: "  + "\n" + `<div style="background-image: url(https://cdn.pixabay.com/photo/2019/03/21/15/51/chatbot-4071274_1280.jpg);"class="imgForRecommend"></div><a class="buybutton" href="https://sellsmart.github.io/chatbot#custom" target="_parent">Check it out</a>`, "salestext");
    }
    else if(offerName.toLocaleLowerCase().includes("dunk") && offerName.toLocaleLowerCase().includes("low") && offerName.toLocaleLowerCase().includes("panda")){
      productRecommended("Nike dunk low panda");
      chatContainer.innerHTML += chatStripe(true, "Nike Dunk Low Panda "  + "\n" + `<div style="background-image: url(https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/56ff13a0-d2e6-49ed-bfd2-43dc2ba0922b/dunk-low-schuh-fur-altere-DDR7fb.png);"class="imgForRecommend"></div><a class="buybutton" href="#custom" target="_parent">Check it out</a>`, "salestext");

    }
    else if(offerName.toLocaleLowerCase().includes("startoffer")){
      productRecommended("startoffer");
      chatContainer.innerHTML += chatStripe(true, "Backpack DISCOUNTED!"  + "\n" + `<div style="background-image: url(https://images.pexels.com/photos/3731256/pexels-photo-3731256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2);"class="imgForRecommend"></div><a class="buybutton" href="#custom" target="_parent">Check it out</a>`, "salestext");

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
  }, 60000);
  
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
  stopTimer();
  
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
  const response = await fetch('http://localhost:5102', {
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
    startTimer();
    questionsAsked++;
    console.log("Currently " + questionsAsked + " questions have been asked");
    isReadyForNewRequest = true;
    const responseData = await response.json();
    console.log(responseData);
    const parsedData = responseData.bot.trim();
    if(questionsAsked > 3){
      askForFeeback(10000);
    }
    typeText(messageDiv, parsedData);
    
    
  } else {
    isReadyForNewRequest = true;
    console.log("Response status: " + response.status);
    if (response.status === 429) {
      // Handle 429 error (Too Many Requests)

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
