// Fallback in-memory data store.
// Lets the app run instantly for a demo/review without requiring a MongoDB
// instance. Set MONGO_URI in .env to use real MongoDB via the Job model instead.

const rawJobs = [
  { title: "Sr. Graphic Designer", designation: "Sr. Graphic Designer", location: "Kolkata, India", category: "Design", jobType: "Full-Time", salary: "15,000", deadline: "12/11/25", isActive: true },
  { title: "Hotel Udaan Team Lead", designation: "Team Lead", location: "Remote", category: "Hospitality", jobType: "Full-Time", salary: "22,000", deadline: "15/11/25", isActive: true },
  { title: "MERN Stack Developer", designation: "Software Engineer", location: "Remote", category: "Engineering", jobType: "Full-Time", salary: "35,000", deadline: "20/11/25", isActive: true },
  { title: "Frontend Engineer (React)", designation: "Software Engineer", location: "Bengaluru, India", category: "Engineering", jobType: "Full-Time", salary: "32,000", deadline: "20/11/25", isActive: true },
  { title: "Backend Engineer (Node.js)", designation: "Software Engineer", location: "Remote", category: "Engineering", jobType: "Full-Time", salary: "34,000", deadline: "22/11/25", isActive: false },
  { title: "QA / SDET", designation: "QA Engineer", location: "Kolkata, India", category: "Engineering", jobType: "Full-Time", salary: "25,000", deadline: "25/11/25", isActive: true },
  { title: "Content Marketing Associate", designation: "Marketing Associate", location: "Remote", category: "Marketing", jobType: "Part-Time", salary: "12,000", deadline: "28/11/25", isActive: true },
  { title: "HR Executive", designation: "HR Executive", location: "Siliguri, India", category: "HR", jobType: "Full-Time", salary: "18,000", deadline: "30/11/25", isActive: true },
];

let jobs = rawJobs.map((j, i) => ({
  _id: String(i + 1),
  company: "Reboot AI",
  description: "",
  createdAt: new Date(2026, 5, i + 1),
  ...j,
}));

let nextId = jobs.length + 1;

export const memoryStore = {
  list(search) {
    let result = jobs;
    if (search) {
      const q = search.toLowerCase();
      result = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.designation.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => b.createdAt - a.createdAt);
  },
  getById(id) {
    return jobs.find((j) => j._id === id) || null;
  },
  create(data) {
    const job = {
      _id: String(nextId++),
      title: data.title,
      designation: data.designation || "",
      company: data.company || "Reboot AI",
      salary: data.salary || "",
      category: data.category || "",
      jobType: data.jobType || "Full-Time",
      location: data.location || "",
      deadline: data.deadline || "",
      description: data.description || "",
      isActive: data.isActive ?? true,
      createdAt: new Date(),
    };
    jobs.unshift(job);
    return job;
  },
  update(id, data) {
    const job = jobs.find((j) => j._id === id);
    if (!job) return null;
    Object.assign(job, data);
    return job;
  },
  toggleActive(id) {
    const job = jobs.find((j) => j._id === id);
    if (!job) return null;
    job.isActive = !job.isActive;
    return job;
  },
  remove(id) {
    const before = jobs.length;
    jobs = jobs.filter((j) => j._id !== id);
    return jobs.length < before;
  },
};
