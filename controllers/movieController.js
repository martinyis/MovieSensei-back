import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import {
  memoryPrompt,
  filterPrompt,
  moodPrompt,
} from "./../utils/promts/promts.js";
import axios from "axios";
dotenv.config({ path: "./.env.development.local" });
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const movieGenerator = async (req, res) => {
  const option = req.body.option;
  let prompt = "";
  if (option == "mood") {
    prompt = moodPrompt(req.body);
  } else if (option == "filter") {
    prompt = filterPrompt(req.body);
  } else if (option == "memory") {
    prompt = memoryPrompt(req.body);
  }
  try {
    const response = await generateJsonFromPrompt(prompt);
    const movies = await findMovies(
      JSON.parse(response.data.choices[0].message.content).data.titles
    );
    return res.status(200).json({
      movies,
      data: JSON.parse(response.data.choices[0].message.content),
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};
async function findMovies(names) {
  const movies = [];
  for (let i = 0; i < names.length; i++) {
    const formattedName = names[i].replace(/\s/g, "+"); // Replace spaces with '+'
    const response = await axios.get(
      `https://www.omdbapi.com/?t=${formattedName}&apikey=${process.env.MOVIE_DB_KEY}`
    );
    const movie = response.data; // Extract the movie data from the response
    movies.push(movie);
  }
  return movies;
}
async function generateJsonFromPrompt(prompt) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 1,
      max_tokens: 1920,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    return response;
  } catch (err) {
    throw new Error("Failed to generate JSON from prompt");
  }
}
