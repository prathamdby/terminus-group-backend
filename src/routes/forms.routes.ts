import express from "express";

import Award from "../models/Award.model";
import News from "../models/News.model";
import Project from "../models/Project.model";
import Team from "../models/Team.model";

const router = express.Router();

const generateErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : "An unknown error occurred";
};

router.get("/project", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error: unknown) {
    res.status(500).json({ error: generateErrorMessage(error) });
  }
});

router.post("/project", async (req, res) => {
  try {
    // TODO: Implement file upload
    const imageUrls = ["placeholder-image-url"];
    let brochureUrl = "placeholder-brochure-url";

    const project = await Project.create({
      ...req.body,
      images: imageUrls,
      brochureUrl,
    });

    res.status(201).json(project);
  } catch (error: unknown) {
    res.status(400).json({ error: generateErrorMessage(error) });
  }
});

// Team routes
router.get("/team", async (req, res) => {
  try {
    const teams = await Team.find().sort({ name: 1 });
    res.json(teams);
  } catch (error: unknown) {
    res.status(500).json({ error: generateErrorMessage(error) });
  }
});

router.post("/team", async (req, res) => {
  try {
    // TODO: Implement file upload
    const pictureUrl = "placeholder-picture-url";
    const team = await Team.create({
      ...req.body,
      picture: pictureUrl,
    });
    res.status(201).json(team);
  } catch (error: unknown) {
    res.status(400).json({ error: generateErrorMessage(error) });
  }
});

// News routes
router.get("/news", async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error: unknown) {
    res.status(500).json({ error: generateErrorMessage(error) });
  }
});

router.post("/news", async (req, res) => {
  try {
    // TODO: Implement file upload
    const imageUrl = "placeholder-image-url";
    const news = await News.create({
      ...req.body,
      image: imageUrl,
    });
    res.status(201).json(news);
  } catch (error: unknown) {
    res.status(400).json({ error: generateErrorMessage(error) });
  }
});

// Awards routes
router.get("/awards", async (req, res) => {
  try {
    const awards = await Award.find().sort({ createdAt: -1 });
    res.json(awards);
  } catch (error: unknown) {
    res.status(500).json({ error: generateErrorMessage(error) });
  }
});

router.post("/awards", async (req, res) => {
  try {
    // TODO: Implement file upload
    const imageUrl = "placeholder-image-url";
    const award = await Award.create({
      ...req.body,
      image: imageUrl,
    });
    res.status(201).json(award);
  } catch (error: unknown) {
    res.status(400).json({ error: generateErrorMessage(error) });
  }
});

export default router;
