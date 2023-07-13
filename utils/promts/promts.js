export const memoryPrompt = (data) => {
  let { quantity, description } = data;
  const text =
    description.length != 0
      ? description
      : "Top 5 movies of 2022 by IDMB rating";
  const prompt = `Generate a JSON object only with one entry point called data. This object should have ${quantity} titles (ONLY titles) of movies based on the information in the next sentence. ${text}
    NOTE: Please provide accurate and relevant movie titles based on the provided information. Ensure that each title corresponds to a real movie title, and omit any additional information such as years or ratings. Sceleton below
      { "data": {
        "titles": [
          ""
        ]
      }}`;
  return prompt;
};

export const moodPrompt = (data) => {
  const { quantity, description } = data;
  const prompt = `Generate a JSON object containing a single entry point called "data". This object should have ${quantity} movie titles based on my current mood: ${description}. NOTE: Please provide accurate and relevant movie titles based on the provided information. Make sure each title corresponds to a real movie title and omit any additional information such as years or ratings. The JSON object should follow the structure below: { "data": { "titles": [ "" ] } }`;
  return prompt;
};

export const filterPrompt = (data) => {
  const {
    quantity,
    minYear,
    maxYear,
    maxRating,
    minRating,
    countries,
    genres,
    description,
  } = data;

  const prompt = `Hi ChatGpt, I need your assistance as a movie guide. Your task is to help me find the best movies to watch based on strict filters. Please generate a JSON object containing the movie titles that meet the following criteria, without any additional greetings or information:

  Format:
  {
    "data": {
      "titles": [
        ""
      ]
    }
  }
  
  Filters:
  Quantity: ${quantity} (Please prioritize the filters below over the quantity. If you can't find enough movies that match the filters, provide the available number but ensure strict adherence to the filters.)
  
  Year range: ${minYear} - ${maxYear} (Please strictly include movies released within this range only.)
  
  IMDB rating range: ${minRating} - ${maxRating} (Strictly adhere to this range.)
  
  Countries: ${countries} (Strictly adhere to the specified countries.)
  
  Genres: ${genres} (You can consider this as a reference, but it's not mandatory.)
  
  Description: ${description} (This is for additional context only.)
  
  Please ensure that each title corresponds to a real movie and exclude any extra information such as years or ratings.`;
  return prompt;
};

//''
