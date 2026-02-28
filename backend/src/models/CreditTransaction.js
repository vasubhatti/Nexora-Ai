import mongoose from "mongoose";

const creditTransactionSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    type: {
      type: String,
      enum: ["deduction", "topup", "reset", "bonus"],
      required: true,
    },
    amount:{
        type:Number,
        required: true
    },
    balanceAfter:{
        type:Number,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    action:{
        type:String
    }

},{timestamps:true})

const CreditTransaction = mongoose.model("CreditTransaction",creditTransactionSchema);

export default CreditTransaction;