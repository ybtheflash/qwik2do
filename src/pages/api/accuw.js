export default function handler(req, res) {
  res.status(200).json({ accuweatherApiKey: process.env.ACCUWEATHER_API_KEY });
}
