import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

let alreadyRev = false;

const modelsToRecommend = "Link to our chatbot:  $§|-Our-Chatbot-The-Best-$§|";

//configure openai completion
dotenv.config()
let section = "";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.ORG,
  defaultHeaders: {},
  basePath: 'https://api.openai.com/v1',
  timeout: 60000,
  throwOnTimeout: true,
});

const openai = new OpenAIApi(configuration);

//Configure firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPzPjkRTuAX9IQVSra86STA2kxuJ9R-Ig",
  authDomain: "sellsmart-f3bd7.firebaseapp.com",
  projectId: "sellsmart-f3bd7",
  storageBucket: "sellsmart-f3bd7.appspot.com",
  messagingSenderId: "440691284374",
  appId: "1:440691284374:web:59ef9c57fe69855caaa5b7",
  measurementId: "G-8LEQLJB95L"
};

// Initialize Firebase
const app2 = initializeApp(firebaseConfig);

const db = getFirestore(app2);

// Function to save data to the cloud when its a good review
async function saveGoodReview(isGood) {
  try {
    const docRef = doc(db, "Reviews", "Good review"); // Replace "your-doc-id" with a unique identifier for the document

    // Fetch the existing data from the document
    const docSnap = await getDoc(docRef);
    const existingData = docSnap.data();

    // Increment the counter based on the "isGood" value
    const updatedData = {
      ...existingData,
      count: existingData.count ? existingData.count + (isGood ? 1 : 0) : (isGood ? 1 : 0),
    };

    // Update the document with the updated data
    await updateDoc(docRef, updatedData);
    console.log("Data saved successfully");
  } catch (error) {
    console.error("Error saving data: ", error);
  }
}
async function saveReview(prompt) {
  try {
    const reviewName = prompt.slice(0, -10);
    const docRef = doc(db, "Reviews", reviewName);

    // Create a new document with the given review name
    await setDoc(docRef, { name: reviewName });
    console.log("Data saved successfully");
  } catch (error) {
    console.error("Error saving data: ", error);
  }
}

async function saveBadReview(isGood) {
  try {
    const docRef = doc(db, "Reviews", "Bad review"); // Replace "your-doc-id" with a unique identifier for the document

    // Fetch the existing data from the document
    const docSnap = await getDoc(docRef);
    const existingData = docSnap.data();

    // Increment the counter based on the "isGood" value
    const updatedData = {
      ...existingData,
      count: existingData.count ? existingData.count + (isGood ? 1 : 0) : (isGood ? 1 : 0),
    };

    // Update the document with the updated data
    await updateDoc(docRef, updatedData);
    console.log("Data saved successfully");
  } catch (error) {
    console.error("Error saving data: ", error);
  }
}

if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.protocol !== "file:") {
  const analytics = getAnalytics(app2);
}
// Usage example



function deactivateButtons(){
  // Find the elements with IDs rev-good and rev-bad
  console.log("Deactivating buttons");



}

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})


app.post('/', async (req, res) => {
  try {
    let allTheTokens = 0;
    let finalresponse = ""; 
    const minimumDelays = 100;
console.log("Already reviewd: " + alreadyRev);
    const prompt = req.body.prompt;
    if(prompt.toLowerCase().includes("prslsgo!24")){
      console.log("Saving data to firebase about what got buyed");
      saveReview(prompt);
      return;
    }
   
    if(prompt.toLowerCase().includes("it is a good review with this review given -.--.")){
      if(alreadyRev){
        return;
      }
      else{
        deactivateButtons();
        alreadyRev = true;
        saveGoodReview(true);
        
        return;
      }
    }
    if(prompt.toLowerCase().includes("it is a bad review with this review given -.--.") && !alreadyRev){
      if(alreadyRev){
        return;
      }
      else{
        deactivateButtons();
        alreadyRev = true;
        saveBadReview(true);
  
        return;
      }
    }
    
    const generalCheck = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "user", content: "Answer with one word. Match the prompt with either recommendation or information: " + prompt},
    ] 
    });

    let isSpecific = false;
    console.log("This is the answer for general check: " + generalCheck.data.choices[0].message.content);
    isSpecific = generalCheck.data.choices[0].message.content.trim().toLowerCase().includes("information");
    console.log("Is specific is: " + isSpecific);
    allTheTokens += generalCheck.data.usage.total_tokens;
    if(!isSpecific){
      let instruction = "You are a customer supporter on a website. Answer in 1 or 2 sentences. The user wants this product: " + prompt + ". Give him a recommendation out of these (always with link 'at this link..'): " + modelsToRecommend;
      
      const productCheck = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {role: "user", content: instruction},
      ] 
      });
      console.log("Tokens taken: " + productCheck.data.usage.total_tokens);
      allTheTokens += productCheck.data.usage.total_tokens;
  
      const minimumDelay = 100;

  
  
      finalresponse = productCheck.data.choices[0].message.content;
    }
    else{
    let first = "You are a customer supporter on a website. Answer short (use not 100% of the data). Only use information provided. The question is: " + prompt + " Answer it using this data about the chatbot you are trying to sell:"
    first ="Your are a customer supporter on a website answer this question: " + prompt + " using this data, as short as possible: ";
    let information = "";

    const sectionCheck = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "user", content: "Sort this request " + prompt + " into one of these categories: Costs, Adv. Features, payment, human support, Staff Costs, Competitive Advantages, Recommendation, Models, Website, Product, Integration, Customer Support, Analytics, Language Support, Security, newsletter, Customization, Scalability, Lead Generation, Contact, Discounts, Shipment, wheretobuy, order tracking, returns, reviews. Respond with 1-2 words"},
    ] 
    });
    allTheTokens += sectionCheck.data.usage.total_tokens;
    const minimumDelay = 100;



    const answer = sectionCheck.data.choices[0].message.content;
    console.log("Section of information: " + sectionCheck.data.choices[0].message.content);
    if (answer.includes("Advanced Features")) {
      information = "Advanced features, super functional, converts customers faster, easy implementation, adapts to website design, works 24/7.";
  } 
  else if(answer.toLowerCase().includes("costs")){
    information = "The cost depends on your usage in your 7 day free trial";
  }
  else if (answer.toLowerCase().includes("staff")) {
      information = "No extra staff needed, reduces costs.";
  } else if (answer.toLowerCase().includes("advantages")) {
      information = "Faster and smarter than others, increases conversions.";
  } else if (answer.toLowerCase().includes("recommendation")) {
      information = "Recommended for most businesses (1-50 employees): $§|-PRO-$§| MODEL.";
  } else if (answer.toLowerCase().includes("models")) {
      information = "1 model, fully customizable, converts more customers, 95% cheaper than hiring, implemented in 3 clicks, personal design, no coding required. ";
  } else if (answer.toLowerCase().includes("website")) {
      information = "Visit homepage: https://sellsmart.github.io/chatbot/.No newsletter";
  } else if (answer.toLowerCase().includes("product")) {
      information = "1 model, fully customizable, converts more customers, 95% cheaper than hiring, implemented in 3 clicks, personal design, no coding required. ";
  } else if (answer.toLowerCase().includes("integration")) {
      information = "Seamless integration with popular platforms like WordPress, Shopify, and more.";
  } else if (answer.toLowerCase().includes("customer support")) {
      information = "24/7 customer support available.";
  } else if (answer.toLowerCase().includes("analytics")) {
      information = "Comprehensive analytics dashboard for insights.";
  } else if (answer.toLowerCase().includes("language support")) {
      information = "Supports multiple languages for a global customer base.";
  } else if (answer.toLowerCase().includes("security")) {
      information = "Data security and encryption measures.";
  } else if (answer.toLowerCase().includes("customization")) {
      information = "Customizable colors, fonts, and chatbot avatar.";
  } else if (answer.toLowerCase().includes("scalability")) {
      information = "Scales for businesses of any size.";
  } else if (answer.toLowerCase().includes("lead")) {
      information = "Captures leads and customer information.";
  }
  else if (answer.toLowerCase().includes("wheretobuy")) {
    information = "You can buy the chatbot right at this website!";
}
else if(answer.toLowerCase().includes("support")){
information = "contact our support at this email: support@sellsmart.com.No newsletter available";
}
else if (answer.toLowerCase().includes("reviews")){
  information ="We currently don't display our reviews yet";
}
else if(answer.toLowerCase().includes("payment")){
  information = "We accept almost any payment method. We prefer bank card/credit card or paypal payments.";
}
else if(answer.toLowerCase().includes("newsletter")){
  information ="We currently do not have a newsletter";
}
  
    else if(answer.toLowerCase().includes("contact")){
      information = " Email: getreadyforweb@gmx.de, phone: none, website: https://sellsmart.github.io/chatbot/support .";
    }
    else if(answer.toLowerCase().includes("shipment")){
      information = " Product shipment: around 2-3 days. Its free.";
    }
    else if(answer.toLowerCase().includes("discount")){
      information=" If you contact we can talk about discounts.";
    }
    else if(answer.toLowerCase().includes("tracking")){
      information = "You can't track your order directly, but we'll keep you up to date.";
    }
    else if(answer.toLowerCase().includes("return")){
      information = "You can based on your subscription return your chatbot monthly or yearly. Return is free.";
    }
    console.log("This data is now getting used: " + information);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "user", content: first + information},
    ] 
      
  
     
      /*frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    */});
    allTheTokens += completion.data.usage.total_tokens;
    console.log("Answer: " + completion.data.choices[0].message.content);
  finalresponse = completion.data.choices[0].message.content
}
console.log("All the tokens: " + allTheTokens);
    res.status(200).send({
      bot: finalresponse
    });
    

  } catch (error) {
 
    
    if (error.response && error.response.status === 429) {
      // Handle 429 error here
     
      // Additional code for handling 429 error goes here
      res.status(429).send('Too Many Requests');
    } else {
      console.log(typeof error);
      res.status(500).send(error || 'Something went wrong');
    }
    

    
  }
})


app.listen(5102, () => console.log('AI server started on http://localhost:5102'))
