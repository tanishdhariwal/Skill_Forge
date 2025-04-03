import mongoose from "mongoose";
const { Schema } = mongoose;

const ExchangeSchema = new Schema({
    question: { 
        questionText: { type: String, required: true }, 
        code: { type: String }
    },
    answer: { type: String, default:"" },
    exchangeFeedback: { type: String },
    marks: { type: Number, required: true, default: 0 },
}, { timestamps: true });
  
const InterviewSchema = new Schema({
    title: { type: String, required: true },
    userRef: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true,default:"practice", enum: ['practice', 'ranked'] },
    jobDescribtion: { type: String },
    resumeData: { type: String },
    exchanges: [ExchangeSchema],
    experience: { type: Number, required: true, default: 0 },
    jobRole: { type: String },
    score: { type: Number, required: true, default: 0 },
    interviewfeedback: { type: String },
    strengths: [String],
    weaknesses: [
        {
            weakness: { type: String},
            link: { type: String, default: "" }
        }
    ],
    status: { type: String, required: true, default: "incomplete" }
}, { timestamps: true });

// Virtual property to compute the average of exchange marks
InterviewSchema.virtual("calculatedScore").get(function() {
    if (this.exchanges && this.exchanges.length > 0) {
        const total = this.exchanges.reduce((sum: number, exchange: any) => sum + exchange.marks, 0);
        return total / this.exchanges.length;
    }
    return 0;
});

// Pre-save hook to update the score field using the virtual property
InterviewSchema.pre("save", function(next) {
    this.score = (this as any).calculatedScore;
    next();
});

const Interview = mongoose.model("Interview", InterviewSchema);
export { Interview };