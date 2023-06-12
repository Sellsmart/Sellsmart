import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'



const modelsToRecommend = "Nike dunk low: red:  $§|-Nike-Dunk-Low-Team-Red-$§|, gold: $§|-Nike-Dunk-Low-Team-Gold-$§|, orange: $§|-Nike-Dunk-Low-Team-Orange-$§|";

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
        {role: "user", content: "Answer with one word. Is this question general or does he/she want a product" + prompt},
    ] 
    });

    let isSpecific = false;
    console.log("This is the answer for general check: " + generalCheck.data.choices[0].message.content);
    isSpecific = generalCheck.data.choices[0].message.content.trim().toLowerCase().includes("general");
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
        {role: "user", content: "Sort this request " + prompt + " into one of these categories: Recommendation, Advanced Features, Staff costs, Competitive Advantages, different Models, Products, Contact, Discounts, Shipment, Website instructions. Respond with only the section name"},
    ] 
    });
    allTheTokens += sectionCheck.data.usage.total_tokens;
    const minimumDelay = 100;



    const answer = sectionCheck.data.choices[0].message.content;
    if(answer.includes("Advanced Features")){
    information = "Our Chatbot is very advanced. Super functional, chatbot helps converts customer faster and with better experience. Easy to implement + adapts to the design of your website. Works 24/7. Good because it knows your website very well";
    }
    else if(answer.includes("Staff costs")){
      information = "Easy to use, you don't need any more staff + no extra staff costs"
    }
    else if (answer.includes("Competitive Advantages")){
      information = "Compared to other chatbots this one is faster, can answer questions others can't, is trained to be nice to increase conversion.";
    }
    else if(answer.includes("Recommendation")){
      information ="Model for small businesses (1-50 employess): $§|-START-$§| MODEL, Model for big businesses (50+ employees):  MODEL"
    }
    else if(answer.includes("Models")){
      information = " 3 models/ prices: Start : Fully working chatbot, Easy implementation, Chatbot trained on website, 550$. Pro: Same as start but with Custom chatbot design, 800$. Same as Starter but with Custom Chatbot design and extra features., 3200$. ";
    }
    else if(answer.includes("Website")){
      information = "Homepage link: https://sellsmart.github.io/chatbot/ . "
    }
    else if (answer.includes("Product")){
      information = " 3 models/ prices: Start : Fully working chatbot, Easy implementation, Chatbot trained on website, 550$. Pro: Same as start but with Custom chatbot design, 800$. Same as Starter but with Custom Chatbot design and extra features., 3200$.";

    }
    else if(answer.includes("Contact")){
      information = " Email: felixwolny1@gmail.com, phone: none, website: https://sellsmart.github.io/chatbot/support .";
    }
    else if(answer.includes("Shipment")){
      information = " Product shipment: around 5-6 days. More information here: https://www.google.com";
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
