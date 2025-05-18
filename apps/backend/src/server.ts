import app from "./app";
import { connectDB } from "./config/db";

const PORT = 5000;

(async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    // Graceful shutdown handlers
    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}, shutting down...`);
      server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
})();
