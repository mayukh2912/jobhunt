import { Router } from "express";
import Job from "../models/Job.js";
import { memoryStore } from "../memoryStore.js";

const router = Router();

// Whether a real MongoDB connection is active (set in index.js)
const usingMongo = () => process.env.MONGO_URI && global.__mongoConnected;

// GET /api/jobs?search=react  -> list all jobs, optionally filtered
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    if (usingMongo()) {
      const filter = search
        ? {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { company: { $regex: search, $options: "i" } },
              { location: { $regex: search, $options: "i" } },
            ],
          }
        : {};
      const jobs = await Job.find(filter).sort({ createdAt: -1 });
      return res.json(jobs);
    }
    return res.json(memoryStore.list(search));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
});

// POST /api/jobs -> create a job post
router.post("/", async (req, res) => {
  try {
    if (usingMongo()) {
      const job = await Job.create(req.body);
      return res.status(201).json(job);
    }
    return res.status(201).json(memoryStore.create(req.body));
  } catch (err) {
    res.status(400).json({ message: "Failed to create job", error: err.message });
  }
});

// PUT /api/jobs/:id -> edit a job post
router.put("/:id", async (req, res) => {
  try {
    if (usingMongo()) {
      const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!job) return res.status(404).json({ message: "Job not found" });
      return res.json(job);
    }
    const job = memoryStore.update(req.params.id, req.body);
    if (!job) return res.status(404).json({ message: "Job not found" });
    return res.json(job);
  } catch (err) {
    res.status(400).json({ message: "Failed to update job", error: err.message });
  }
});

// PATCH /api/jobs/:id/toggle -> activate/deactivate a job post
router.patch("/:id/toggle", async (req, res) => {
  try {
    if (usingMongo()) {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });
      job.isActive = !job.isActive;
      await job.save();
      return res.json(job);
    }
    const job = memoryStore.toggleActive(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    return res.json(job);
  } catch (err) {
    res.status(400).json({ message: "Failed to toggle job", error: err.message });
  }
});

// DELETE /api/jobs/:id -> remove a job post
router.delete("/:id", async (req, res) => {
  try {
    if (usingMongo()) {
      const job = await Job.findByIdAndDelete(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });
      return res.json({ message: "Deleted" });
    }
    const ok = memoryStore.remove(req.params.id);
    if (!ok) return res.status(404).json({ message: "Job not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete job", error: err.message });
  }
});

export default router;
