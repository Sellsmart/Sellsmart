import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'



const modelsToRecommend = "Link to our chatbot:  $§|-Our-Chatbot-The-Best-$§|, Nike dunk low black: $§|-Nike-Dunk-Low-Panda-$§|";

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

    const prompt = req.body.prompt;
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
    let first = "You are a customer supporter on a website. Answer as short as possible. If you don't know, don't say (only use information provided). Act kind, be nice. This is his question: " + prompt + " Answer it using this data about the business:"
    first ="Your are a customer supporter on a website answer this question: " + prompt + " using this data, as short as possible: ";
    let information = "";

    const sectionCheck = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "user", content: "Sort this request " + prompt + " into one of these categories: Adv. Features, Staff Costs, Competitive Advantages, Recommendation, Models, Website, Product, Integration, Customer Support, Analytics, Language Support, Security, Customization, Scalability, Lead Generation, Contact, Discounts, Shipment, wheretobuy. Respond with only the section name"},
    ] 
    });
    allTheTokens += sectionCheck.data.usage.total_tokens;
    const minimumDelay = 100;



    const answer = sectionCheck.data.choices[0].message.content;
    if (answer.includes("Advanced Features")) {
      information = "Advanced features, super functional, converts customers faster, easy implementation, adapts to website design, works 24/7.";
  } else if (answer.includes("Staff costs")) {
      information = "No extra staff needed, reduces costs.";
  } else if (answer.includes("Competitive Advantages")) {
      information = "Faster and smarter than others, increases conversions.";
  } else if (answer.includes("Recommendation")) {
      information = "Recommended for most businesses (1-50 employees): $§|-PRO-$§| MODEL.";
  } else if (answer.includes("Models")) {
      information = "1 model, fully customizable, converts more customers, 95% cheaper than hiring, implemented in 3 clicks, personal design, no coding required. Visit '$§|-Custom-|$§'.";
  } else if (answer.includes("Website")) {
      information = "Visit homepage: https://sellsmart.github.io/chatbot/ .";
  } else if (answer.includes("Product")) {
      information = "1 model, fully customizable, converts more customers, 95% cheaper than hiring, implemented in 3 clicks, personal design, no coding required. Visit '$§|-Custom-|$§'.";
  } else if (answer.includes("Integration")) {
      information = "Seamless integration with popular platforms like WordPress, Shopify, and more.";
  } else if (answer.includes("Customer Support")) {
      information = "24/7 customer support available.";
  } else if (answer.includes("Analytics")) {
      information = "Comprehensive analytics dashboard for insights.";
  } else if (answer.includes("Language Support")) {
      information = "Supports multiple languages for a global customer base.";
  } else if (answer.includes("Security")) {
      information = "Data security and encryption measures.";
  } else if (answer.includes("Customization")) {
      information = "Customizable colors, fonts, and chatbot avatar.";
  } else if (answer.includes("Scalability")) {
      information = "Scales for businesses of any size.";
  } else if (answer.includes("Lead Generation")) {
      information = "Captures leads and customer information.";
  }
  else if (answer.includes("wheretobuy")) {
    information = "You can buy the chatbot right at this website!";
}
  
    else if(answer.includes("Contact")){
      information = " Email: getreadyforweb@gmx.de, phone: none, website: https://sellsmart.github.io/chatbot/support .";
    }
    else if(answer.includes("Shipment")){
      information = " Product shipment: around 2-3 days.";
    }
    else if(answer.includes("Discount")){
      information=" If you contact we can talk about discounts.";
    }

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
