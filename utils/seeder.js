import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

import mongoose from 'mongoose'

import { School } from '../models/School.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.MONGODB_URI)

const schools = JSON.parse(
  fs.readFileSync(`${__dirname}/../seedData/schools.json`, 'utf-8')
)

// Seed database
const importData = async () => {
  try {
    await School.create(schools);
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await School.deleteMany();
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}