const fs = require("fs").promises;
const path = require("path");
const { addLogData } = require("../state/logData");

const LOG_FILE = "process_log.log";

// Function to log messages selectively
async function logMessage(message, isError = false) {
  const logType = isError ? "ERROR" : "INFO";
  const logEntry = `[${logType}] ${message}\n`;
  addLogData(logType, message);
  await fs.appendFile(LOG_FILE, logEntry);
}

async function processDataset(dataset) {
  for (const item of dataset) {
    if (item.p_id === "N/A") {
      await logMessage(
        `Skipping item with id="N/A" (no valid ID provided) -- from: ${
          ("/", item.from.split("input\\")[1])
        }`
      );
      continue;
    }

    const absolutePath = path.resolve(__dirname, item.conref);
    const relativePath = "./source/" + absolutePath.replace(/^([A-Z]:\\)/i, "");
    let conrefID = relativePath.split("#")[1];
    conrefID =
      conrefID && conrefID.includes("\\") ? conrefID.split("\\")[1] : conrefID;

    const cleanPath = relativePath.split("#")[0];
    console.log("👉 [processDataset.js:45]: cleanPath: ", cleanPath);
  }
}

module.exports = processDataset;
