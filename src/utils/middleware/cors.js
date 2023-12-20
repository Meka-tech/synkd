import nextConnect from "next-connect";

const cors = nextConnect();

cors.use((req, res, next) => {
  // Allow requests from your React app's origin (replace with your actual React app's URL)
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Continue to the next middleware
  next();
});

export default cors;
