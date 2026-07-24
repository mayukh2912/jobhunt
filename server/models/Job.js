import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    designation: { type: String, default: "" },
    company: { type: String, required: true, trim: true },
    salary: { type: String, default: "" },
    category: { type: String, default: "" },
    jobType: { type: String, default: "Full-Time" },
    location: { type: String, default: "" },
    deadline: { type: String, default: "" },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
