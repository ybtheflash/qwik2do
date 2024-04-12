import axios from "axios";

export default async function handler(req, res) {
  const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=landscape&orientation=horizontal&image_type=photo`
    );
    const hits = response.data.hits;

    // Randomize the position of the hits array
    hits.sort(() => Math.random() - 0.5);

    const imageData = hits[0];
    res.status(200).json({ imageUrl: imageData.largeImageURL });
  } catch (error) {
    console.error("Error fetching background image from Pixabay:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
