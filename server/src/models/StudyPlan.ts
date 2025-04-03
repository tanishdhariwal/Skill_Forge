import mongoose from 'mongoose';
const { Schema } = mongoose;

const StudyPlanNodeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, required: true, enum: ['Mandatory', 'Optional'] },
    link: { type: String, default: "" },
    progress: { type: Number, default: 0 }
});

const StudyPlanEdgeSchema = new Schema({
    from: { type: Schema.Types.ObjectId, ref: 'StudyPlanNode', required: true },
    to: { type: Schema.Types.ObjectId, ref: 'StudyPlanNode', required: true },
    label: { type: String, enum: ['Prerequisite', 'Corequisite', 'Optional', ''], default: ''}
});

const StudyPlanSchema = new Schema({
    title: { type: String, required: true },
    nodes: [{ type: Schema.Types.ObjectId, ref: 'StudyPlanNode' }],
    edges: [StudyPlanEdgeSchema],
    public: { type: Boolean, default: false },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    custom: {type:Boolean, default: false}

}, { timestamps: true });


const StudyPlanNode = mongoose.model("StudyPlanNode", StudyPlanNodeSchema);
const StudyPlan = mongoose.model('StudyPlan', StudyPlanSchema);

export { StudyPlanNode, StudyPlan };
  