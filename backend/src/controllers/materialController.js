const Material = require("../models/Material");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const cleanUpFile = require("../utils/cleanUpFiles");

// Create Material
exports.createMaterial = async (req, res) => {
  try {
    const { title } = req.body;
    const { courseId } = req.params;

    // Validasi sederhana
    if (!title) {
      cleanUpFile(req.file);
      return res.status(400).json({ message: "Title wajib diisi" });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "File content wajib diupload" });
    }

    // Store the file path/URL as content
    const fileUrl = `${process.env.APP_URL}/uploads/materials/${req.file.filename}`;

    const material = new Material({
      title,
      content: fileUrl,
      course: courseId,
      createdBy: req.user.userId,
    });
    await material.save();

    await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          materials: material._id,
        },
      },
      { new: true }
    );

    res.status(201).json({ message: "Materi berhasil dibuat", material });
  } catch (err) {
    cleanUpFile(req.file);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get All Materials in a Course
exports.getMaterials = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Proteksi: student hanya boleh lihat materi dari course yang sudah di-enroll
    if (req.user.role === "student") {
      const enrolled = await Enrollment.findOne({
        user: req.user.userId,
        course: courseId,
      });
      if (!enrolled) {
        return res.status(403).json({ message: "Kamu belum join course ini" });
      }
    }

    const materials = await Material.find({ course: courseId }).populate(
      "createdBy",
      "name email"
    );
    res.json({ materials });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Single Material (detail)
exports.getMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!material)
      return res.status(404).json({ message: "Materi tidak ditemukan" });

    // Proteksi: student hanya boleh lihat materi dari course yang sudah di-enroll
    if (req.user.role === "student") {
      const enrolled = await Enrollment.findOne({
        user: req.user.userId,
        course: material.course,
      });
      if (!enrolled) {
        return res.status(403).json({ message: "Kamu belum join course ini" });
      }
    }

    res.json({ material });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Material
exports.updateMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material)
      return res.status(404).json({ message: "Materi tidak ditemukan" });

    // Hanya creator yang boleh edit (opsional: bisa dibuat teacher course owner)
    if (material.createdBy.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Hanya creator yang boleh mengedit materi ini" });
    }

    // Validasi sederhana
    const { title, content } = req.body;
    if (!title && !content) {
      return res.status(400).json({
        message:
          "Minimal salah satu field (title/content) harus diisi untuk update",
      });
    }

    if (title) material.title = title;
    if (content) material.content = content;

    await material.save();
    res.json({ message: "Materi berhasil diupdate", material });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Material
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material)
      return res.status(404).json({ message: "Materi tidak ditemukan" });

    // Hanya creator yang boleh hapus
    if (material.createdBy.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Hanya creator yang boleh menghapus materi ini" });
    }

    await material.deleteOne();
    res.json({ message: "Materi berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
