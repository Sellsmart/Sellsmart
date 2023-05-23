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
    const first = "Act like a chatbot on a website that helps the customer buy something from that specific website. Dont mention yourself. Answer as short as possible. Dont ever provide information you dont know about, instead tell the customer that you dont know and offer alternatives. Act kind and try (if gently possible) to convert the customer into a buying one. This is his question: " + prompt + " Answer it using this data about the busines: Our Chatbot is one of the most advanced AI Chatbots out there. Super functional chatbot that help converts customer much faster and with much better experience. Easy to use, don't need anymore staff + no extra staff cost. works 24/7 + extremely good because it knows you're website very well. Easy to impliment + adapt to your design of your website. Compared to other website, this chatbot is: faster, can answer questions that other chatbot can't. It is also trained to be nice to increase conversion. 3 models/ prices: Start: Fully working chatbot, Easy implementation, Chatbot trained on website, 550$. Pro: Same as start but with Custom chatbot design, 800$. Same as Starter but with Custom Chatbot design and extra features., 3200$. If they contact we can talk about discounts. Product shipment: around 2-3 days. No accessoires needed. Fully personalized. Infinite lifespan. Contact: Email: felixwolny1@gmail.com, phone: none";
    console.log("Is starting");
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "user", content: first},
    ] 
      
  
     
      /*frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    */});
    console.log("Answer: " + completion.data.choices[0].message.content);
    res.status(200).send({
      bot: completion.data.choices[0].message.content
    });
    

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})


app.listen(5102, () => console.log('AI server started on http://localhost:5102'))
