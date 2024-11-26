import { Router } from 'express';
import { uploadThingFileRouter } from '../../config/uploadthing.js';
import { Project } from '../../models/project.js';
import { Team } from '../../models/team.js';
import { News } from '../../models/news.js';
import { Award } from '../../models/award.js';

const router = Router();

// Projects routes
router.get('/project', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/project', async (req, res) => {
  try {
    const imageFiles = await uploadThingFileRouter.imageUploader.upload(req.files.images);
    const imageUrls = imageFiles.map(file => file.url);

    let brochureUrl;
    if (req.files.brochure) {
      const brochureFile = await uploadThingFileRouter.imageUploader.upload(req.files.brochure[0]);
      brochureUrl = brochureFile.url;
    }

    const project = await Project.create({
      ...req.body,
      images: imageUrls,
      brochureUrl
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Team routes
router.get('/team', async (req, res) => {
  try {
    const teams = await Team.find().sort({ name: 1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/team', async (req, res) => {
  try {
    const file = await uploadThingFileRouter.imageUploader.upload(req.files.picture[0]);
    const team = await Team.create({
      ...req.body,
      picture: file.url
    });
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// News routes
router.get('/news', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/news', async (req, res) => {
  try {
    const file = await uploadThingFileRouter.imageUploader.upload(req.files.image[0]);
    const news = await News.create({
      ...req.body,
      image: file.url
    });
    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Awards routes
router.get('/awards', async (req, res) => {
  try {
    const awards = await Award.find().sort({ createdAt: -1 });
    res.json(awards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/awards', async (req, res) => {
  try {
    const file = await uploadThingFileRouter.imageUploader.upload(req.files.image[0]);
    const award = await Award.create({
      ...req.body,
      image: file.url
    });
    res.status(201).json(award);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;