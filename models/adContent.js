import mongoose from "mongoose";

const AdContentSchema = new mongoose.Schema({
  // Product 1 Fields
  product1Title: {
    type: String,
    default: ""
  },
  product1Image: {
    type: String,
    default: ""
  },
  product1Price: {
    type: String,
    default: ""
  },
  product1Description: {
    type: String,
    default: ""
  },
  product1Link: {
    type: String,
    default: ""
  },

  // Product 2 Fields
  product2Title: {
    type: String,
    default: ""
  },
  product2Image: {
    type: String,
    default: ""
  },
  product2Price: {
    type: String,
    default: ""
  },
  product2Description: {
    type: String,
    default: ""
  },
  product2Link: {
    type: String,
    default: ""
  },
  
  // Quick Tips & Notifications Fields
  tipsTitle: {
    type: String,
    default: "Quick Tips & Notifications"
  },
  tipsText: {
    type: String,
    default: "Practice regularly to improve your accuracy"
  },
  quickTip1: {
    type: String,
    default: ""
  },
  quickTip2: {
    type: String,
    default: ""
  },
  quickTip3: {
    type: String,
    default: ""
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const AdContent = mongoose.model("AdContent", AdContentSchema);
export default AdContent;
