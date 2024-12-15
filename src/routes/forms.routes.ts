import express from "express";
import multer from "multer";
import { UTApi } from "uploadthing/server";

import Award from "../models/Award.model";
import News from "../models/News.model";
import Project from "../models/Project.model";
import Team from "../models/Team.model";

const router = express.Router();
const utapi = new UTApi();

// Configure Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

const generateErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : "An unknown error occurred";
};

// Utility function to convert Multer file to UploadThing compatible file
const convertToUploadThingFile = (file?: Express.Multer.File): File | null => {
  if (!file) return null;

  return new File([file.buffer], file.originalname, { type: file.mimetype });
};

// Utility function to upload a single file
const uploadSingleFile = async (
  file?: Express.Multer.File,
): Promise<string | null> => {
  const uploadFile = convertToUploadThingFile(file);
  if (!uploadFile) return null;

  try {
    const uploadResponse = await utapi.uploadFiles(uploadFile);
    return uploadResponse.data?.url || null;
  } catch (error) {
    console.error("File upload error:", error);
    return null;
  }
};

// Utility function to upload multiple files
const uploadMultipleFiles = async (
  files?: Express.Multer.File[],
): Promise<string[]> => {
  if (!files || files.length === 0) return [];

  try {
    const uploadFiles = files
      .map(convertToUploadThingFile)
      .filter((file): file is File => file !== null);
    const uploadResponses = await utapi.uploadFiles(uploadFiles);
    return uploadResponses
      .map((response) => response.data?.url)
      .filter((url): url is string => url !== undefined);
  } catch (error) {
    console.error("Multiple file upload error:", error);
    return [];
  }
};

// Project routes
router.get("/project", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error: unknown) {
    res.status(500).json({ error: generateErrorMessage(error) });
  }
});

router.get("/project/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.json(project);
  } catch (error: unknown) {
    res.status(500).json({ error: generateErrorMessage(error) });
  }
});

router.post(
  "/project",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "brochure", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const imageUrls = await uploadMultipleFiles(files?.images);
      if (!imageUrls) throw new Error("Failed to upload images.");

      const brochureUrl = await uploadSingleFile(files?.brochure?.[0]);
      if (!brochureUrl) throw new Error("Failed to upload brochure.");

      const project = await Project.create({
        ...req.body,
        images: imageUrls,
        brochureUrl,
        tags: req.body.tags.split(",").map((tag: String) => tag.trim()),
        consultants: req.body.consultants
          .split(",")
          .map((consultant: String) => consultant.trim()),
      });

      res.status(201).json(project);
    } catch (error: unknown) {
      res.status(400).json({ error: generateErrorMessage(error) });
    }
  },
);

// Team routes
router.get("/team", async (req, res) => {
  try {
    const teams = await Team.find().sort({ name: 1 });
    res.json(teams);
  } catch (error: unknown) {
    res.status(500).json({ error: generateErrorMessage(error) });
  }
});

router.post("/team", upload.single("picture"), async (req, res) => {
  try {
    const imageUrl = await uploadSingleFile(req.file);
    if (!imageUrl) throw new Error("Failed to upload image.");

    const team = await Team.create({
      ...req.body,
      image: imageUrl,
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

router.post("/news", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = await uploadSingleFile(req.file);
    if (!imageUrl) throw new Error("Failed to upload image.");

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

router.post("/awards", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = await uploadSingleFile(req.file);
    if (!imageUrl) throw new Error("Failed to upload image.");

    const award = await Award.create({
      ...req.body,
      image: imageUrl,
    });

    res.status(201).json(award);
  } catch (error: unknown) {
    res.status(400).json({ error: generateErrorMessage(error) });
  }
});

// Delete routes for each category
router.delete("/project/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(204).send(`Project with id ${req.params.id} deleted`);
  } catch (error: unknown) {
    res.status(500).json({ error: generateErrorMessage(error) });
  }
});

router.delete("/team/:id", async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.status(204).send(`Team with id ${req.params.id} deleted`);
  } catch (error: unknown) {
    res.status(500).json({ error: generateErrorMessage(error) });
  }
});

router.delete("/news/:id", async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.status(204).send(`News with id ${req.params.id} deleted`);
  } catch (error: unknown) {
    res.status(500).json({ error: generateErrorMessage(error) });
  }
});

router.delete("/awards/:id", async (req, res) => {
  try {
    await Award.findByIdAndDelete(req.params.id);
    res.status(204).send(`Award with id ${req.params.id} deleted`);
  } catch (error: unknown) {
    res.status(500).json({ error: generateErrorMessage(error) });
  }
});

// Edit routes for each category
router.put(
  "/project/:id",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "brochure", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const updateData = { ...req.body };

      if (files?.images) {
        const imageUrls = await uploadMultipleFiles(files.images);
        if (imageUrls.length > 0) updateData.images = imageUrls;
      }

      if (files?.brochure) {
        const brochureUrl = await uploadSingleFile(files.brochure[0]);
        if (brochureUrl) updateData.brochureUrl = brochureUrl;
      }

      if (req.body.tags) {
        updateData.tags = req.body.tags
          .split(",")
          .map((tag: string) => tag.trim());
      }

      if (req.body.consultants) {
        updateData.consultants = req.body.consultants
          .split(",")
          .map((consultant: string) => consultant.trim());
      }

      const project = await Project.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true },
      );
      res.json(project);
    } catch (error: unknown) {
      res.status(400).json({ error: generateErrorMessage(error) });
    }
  },
);

router.put("/team/:id", upload.single("picture"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      const imageUrl = await uploadSingleFile(req.file);
      if (imageUrl) updateData.image = imageUrl;
    }

    const team = await Team.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(team);
  } catch (error: unknown) {
    res.status(400).json({ error: generateErrorMessage(error) });
  }
});

router.put("/news/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      const imageUrl = await uploadSingleFile(req.file);
      if (imageUrl) updateData.image = imageUrl;
    }

    const news = await News.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(news);
  } catch (error: unknown) {
    res.status(400).json({ error: generateErrorMessage(error) });
  }
});

router.put("/awards/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      const imageUrl = await uploadSingleFile(req.file);
      if (imageUrl) updateData.image = imageUrl;
    }

    const award = await Award.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(award);
  } catch (error: unknown) {
    res.status(400).json({ error: generateErrorMessage(error) });
  }
});

export default router;
