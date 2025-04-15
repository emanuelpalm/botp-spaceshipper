import crypto from "node:crypto";

function createId(): string {
  return crypto.randomBytes(12).toString('base64');
}

export default {
  createId
};