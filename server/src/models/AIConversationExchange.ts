import mongoose from "mongoose";
const { Schema } = mongoose;

const AIConversationExchange = new Schema({
    query: {  type: String, required: true },
    response: { type: String, default:"" },
    context: { type: String, default:"" },

}, { timestamps: true });



export {AIConversationExchange}