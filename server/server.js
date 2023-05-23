import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()
let section = "";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
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
    const prompt = req.body.prompt;

    const SectionResponse = await openai.createCompletion({
      model: "text-curie-001",
      prompt: `"Act like a chatbot on a website that helps the customer buy something from that specific website. Dont mention yourself. Answer as short as possible. Dont ever provide information you dont know about, instead tell the customer that you dont know and offer alternatives. Act kind and try (if gently possible) to convert the customer into a buying one. This is his question: " + ${prompt} + " Answer it using this data about the busines: Our Chatbot is one of the most advanced AI Chatbots out there. Super functional chatbot that help converts customer much faster and with much better experience. Easy to use, don't need anymore staff + no extra staff cost. works 24/7 + extremely good because it knows you're website very well. Easy to impliment + adapt to your design of your website. Compared to other website, this chatbot is: faster, can answer questions that other chatbot can't. It is also trained to be nice to increase conversion. 3 models/ prices: Start: Fully working chatbot, Easy implementation, Chatbot trained on website, 550$. Pro: Same as start but with Custom chatbot design, 800$. Same as Starter but with Custom Chatbot design and extra features., 3200$. If they contact we can talk about discounts. Product shipment: around 2-3 days. No accessoires needed. Fully personalized. Infinite lifespan. Contact: Email: felixwolny1@gmail.com, phone: none"` ,
      temperature: 0.5, // Higher values means the model will take more risks.
      max_tokens: 255, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
     
      /*frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    */});
    /*console.log(SectionResponse.data.choices[0].message);
    const sectionName = SectionResponse.data.choices[0].text.trim();
    let dataset = process.env.normal;
    console.log(sectionName);
    if(sectionName.includes("Contact")){
      console.log("Its a contact question");
      dataset = process.env.contact;
    }
    if(sectionName.includes("Website")){
      console.log("Its a site question");
      dataset = process.env.site;
    }
    if(sectionName.includes("General")){
      console.log("Its a site question");
      dataset = process.env.general;
    }
    if(sectionName.includes("feature")){
      console.log("Its a site question");
      dataset = process.env.features;
    }
    if(sectionName.includes("competition")){
      console.log("Its a site question");
      dataset = process.env.competition;
    }
    if(sectionName.includes("shipment")){
      console.log("Its a site question");
      dataset = process.env.shipment;
    }
    if(sectionName.includes("product")){
      console.log("Its a site question");
      dataset = process.env.products;
    }
    if(sectionName.includes("Normal")){
      const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `"Answer this prompt shortly. Be a small chatbot that has no personal live." + ${prompt}` ,
        temperature: 0.2, // Higher values means the model will take more risks.
        max_tokens: 63, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
       
        });
      console.log();
      res.status(200).send({
        bot: response.data.choices[0].text
      });
    }
    else{
      const response = await openai.createCompletion({
        model: "text-babbage-001",
        prompt: `"Answer in full sentences. You are a chatbot on a marketing website presenting yourself online. Answer this question: " + ${prompt} + "using these information from a manual: " + ${dataset}` ,
        temperature: 0.2, // Higher values means the model will take more risks.
        max_tokens: 100, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
       
        });
      console.log(response.data.choices[0].message);
      res.status(200).send({
        bot: response.data.choices[0].text
      }); 
    }*/

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})


app.listen(5102, () => console.log('AI server started on http://localhost:5102'))
