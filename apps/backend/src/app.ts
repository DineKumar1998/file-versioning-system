import express from "express";
import cors from "cors";

import authRoutes from "@routes/auth.routes";
import userRoutes from "@routes/user.routes";
import repositoryRoutes from "@routes/repository.routes";
import versionsRoutes from "@routes/version.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5001",
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/repository", repositoryRoutes);
app.use("/api/versions", versionsRoutes);

export default app;
