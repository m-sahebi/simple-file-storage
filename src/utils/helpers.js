import * as CONFIGS from "../configs/app.config.js";
import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";

// change it to desired value
const FILE_UPLOAD_SECRET = "";
const DEFAULT_MAX_AGE = 5 * 60;

export const generateId = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  20,
);

export function fileNameExtSplit(fullName = "") {
  const idx = fullName.lastIndexOf(".");
  if (idx === -1) return [fullName, ""];
  const name = fullName.slice(0, idx);
  // if file name is like `.example`
  if (!name) return [fullName, ""];
  return [name, fullName.slice(idx + 1)];
}

export async function signJwt(token = {}, secret = "", opt = {}) {
  return new Promise((resolve, reject) =>
    jwt.sign(token, secret, opt, (err, encoded) => {
      if (err) return reject(err);
      resolve(encoded);
    }),
  );
}

export async function verifyJwt(string = "", secret = "", opt = {}) {
  return new Promise((resolve, reject) =>
    jwt.verify(string, secret, opt, (err, decoded) => {
      if (err) return reject(err);
      return resolve(decoded);
    }),
  );
}

export async function decodeJwt(string = "") {
  return verifyJwt(string, FILE_UPLOAD_SECRET);
}

export async function encodeJwt(token = {}, maxAge = DEFAULT_MAX_AGE) {
  return signJwt(token, FILE_UPLOAD_SECRET, { expiresIn: maxAge });
}

export function logConfigs() {
  console.log("App started with configs:\n", { ...CONFIGS });
}
