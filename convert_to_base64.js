const fs = require('fs').promises;
const { basename, dirname, join, extname } = require('path');

const MAX_FILE_SIZE = 1 * 1024 * 1024; // Maximum file size in bytes (1 MB)

async function convertToBase64(inputFilePath) {
  try {
    const data = await fs.readFile(inputFilePath);

    // Convert the file data to Base64
    const base64Data = data.toString('base64');

    const inputFileName = basename(inputFilePath);
    const fileExtension = extname(inputFilePath);
    const outputFolderName = `${inputFileName}-base`;
    const outputFolderPath = join(dirname(inputFilePath), outputFolderName);

    // Create the output folder if it doesn't exist
    await fs.mkdir(outputFolderPath, { recursive: true });

    const numChunks = Math.ceil(base64Data.length / MAX_FILE_SIZE);

    for (let i = 0; i < numChunks; i++) {
      const start = i * MAX_FILE_SIZE;
      const end = start + MAX_FILE_SIZE;
      const chunkData = base64Data.slice(start, end);
      const chunkFileName = `${inputFileName}.base.${i + 1}.txt`;
      const chunkFilePath = join(outputFolderPath, chunkFileName);
      await fs.writeFile(chunkFilePath, chunkData);
      console.log(`Chunk ${i + 1}: ${chunkFileName}`);
    }
  } catch (err) {
    console.error(err);
  }
}

// Retrieve the input file path from command-line arguments
const inputFilePath = process.argv[2];

// Validate if input file path is provided
if (!inputFilePath) {
  console.error('Please provide the input file path as a command-line argument.');
  process.exit(1);
}

// Convert the file to Base64 and split into chunks
convertToBase64(inputFilePath);

// how to run
// node convert_to_base64.js <your_file_name>