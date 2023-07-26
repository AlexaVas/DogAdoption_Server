/** @format */
const router = require("express").Router();
const axios = require("axios");

const options = {
  method: "POST",
  url: "",
  headers: {
    "content-type": "application/json",
    "X-RapidAPI-Key": process.env.RapidAPI,
    "X-RapidAPI-Host": "chatgpt-api8.p.rapidapi.com",
  },
  data: [
    {
      content: "",
      role: "user",
    },
  ],
};

router.post("/", (req, res, next) => {
  const { breed, apartment, exp, active } = req.body;
  return Promise.resolve({ breed, apartment, exp, active })
    .then((data) => {
      console.log(data.breed, data.apartment, data.exp, data.active);

      const userInfo = `I live in an ${data.apartment} and I am ${data.active}. Would I make a good potential owner for a ${data.breed} from a shelter? Level of my experience with dogs: ${exp}. Please, give me 550 characters long answer.`;

      options.data[0].content = userInfo;
      options.url = "https://chatgpt-api8.p.rapidapi.com/";

      return userInfo;
    })

    .then((i) => {
      console.log(options.data[0].content);

      (async () => {
        try {
          const response = await axios.request(options);
          const answer = response.data;
          console.log(answer);
          res.status(200).json(answer);
          
        } catch (error) {
          console.error(error);
        }
      })();
    })

    .catch((err) => res.status(400).json(err));
});

module.exports = router;
