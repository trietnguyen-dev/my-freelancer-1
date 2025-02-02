export default async function handler(req, res) {
    const { service, lookback, limit, tags } = req.query;

    // Construct the Jaeger API URL
    const jaegerUrl = `http://localhost:16686/api/traces?service=${service}&lookback=${lookback}&limit=${limit}&tags=${tags}`;

    try {
      // Forward the request to the Jaeger API
      const response = await fetch(jaegerUrl);
      const data = await response.json();
        console.log(data+ "23");
      // Return the response to the client
      res.status(200).json(data );
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ error: "Failed to fetch traces" });
    }
  }