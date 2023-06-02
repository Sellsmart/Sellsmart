import bot from "./assets/bot.svg";
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;
collapseChatbot()
/*document.getElementById('area').addEventListener('input', function() {

  openChatbot();
});

document.getElementById('area').addEventListener('focusout', function(event) {
  // Check if the blur event was triggered by clicking on the chat area
  console.log("Tries blur");
  

  collapseChatbot();
});
var textarea = document.getElementById('area');*/
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

// Add a click event listener
/*textarea.addEventListener('click', function() {
  // Increase the height of the textarea to 300px
  openChatbot()
});*/
function openChatbot(){
  var wrappers = document.getElementsByClassName("wrapper");
  for (var i = 0; i < wrappers.length; i++) {
    wrappers[i].style.display = "block";
  }
  document.getElementById("app").style.width = "300px";
}
function collapseChatbot(){

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

function typeText(element, text) {
  let index = 0;
  let previousWord = '';
  let currentWord = '';

  let interval = setInterval(() => {
    if (index < text.length) {
      const currentChar = text.charAt(index);
console.log(currentWord);
      // Check if the current character is a whitespace character or a punctuation mark
      if (/\s|[^\w/.:]/u.test(currentChar)) {
        
        // Check if the previous word is a link
        if (previousWord.startsWith('https://') || previousWord.startsWith('http://')) {
          // Convert the previous word into a clickable link
          const link = `<a href="${previousWord}">${previousWord}</a>`;
          element.innerHTML = element.innerHTML.replace(previousWord, link);
        }

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
          const link = `<a href="${currentWord}">${currentWord}</a>`;
          element.innerHTML = element.innerHTML.replace(currentWord, link);
        }
      clearInterval(interval);
    }
  }, 20);
}


 

 



function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
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
  e.preventDefault();

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


  //users stripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  //Loader 

  form.reset();

  const uniqueId = generateUniqueId();

  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  // fetch data from server
  const response = await fetch('http://localhost:5102', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const responseData = await response.json();
    console.log(responseData);
    const parsedData = responseData.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";
    alert(err);
  }
};



form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})
