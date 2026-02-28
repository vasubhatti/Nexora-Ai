import mongoose from "mongoose";

const generationSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
      type: String,
      enum: [
        // Text
        "CHAT", "CONTENT_GENERATION", "SUMMARIZATION",
        "TRANSLATION", "GRAMMAR_CHECK",
        // Code
        "CODE_EXPLANATION", "CODE_GENERATION", "CODE_DEBUGGING",
        "CODE_REVIEW", "CODE_REFACTORING", "CODE_DOCUMENTATION",
        "UNIT_TEST_GENERATION", "CODE_CONVERSION",
        // Image
        "IMAGE_GENERATION", "LOGO_CREATION", "SOCIAL_MEDIA_GRAPHIC",
        // Image to Text
        "OCR", "IMAGE_DESCRIPTION", "OBJECT_DETECTION",
        "HANDWRITING_RECOGNITION", "DOCUMENT_SCANNING",
        // Document
        "PDF_EXTRACTION", "DOCUMENT_QA", "KEY_POINTS_EXTRACTION", "DOCUMENT_SUMMARIZATION",
      ],
      required: true,
    },
    resultUrl: {
      type: String, // stores image URL
    },
    prompt:{
        type:String,
        required: true
    },
    result:{
        type:String,
        required: true
    },
    creditsUsed: {
      type: Number,
      required: true,
    },
    model: {
      type: String, // gpt-4, claude-3 etc
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // extra info like language, tone etc
    },
},{timestamps: true});

// Index for fast search
generationSchema.index({ user: 1, type: 1, createdAt: -1 });

const Generation = mongoose.model("Generation",generationSchema);

export default Generation;