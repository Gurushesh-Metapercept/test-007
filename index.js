const fs = require("fs").promises;
const path = require("path");
const cheerio = require("cheerio");

require("dotenv").config({ path: "./.env" });
const { clearLogData } = require("./state/logData");
const processDataset = require("./utils/processDataset");
const outputFilePath = "dataset.json";

let results = [];

async function readDitaFilesAndExtractData(directory) {
  try {
    const files = await fs.readdir(directory);

    for (const file of files) {
      const fullPath = path.join(directory, file);
      const stats = await fs.stat(fullPath);

      if (stats.isDirectory()) {
        await readDitaFilesAndExtractData(fullPath);
      } else if (stats.isFile() && path.extname(fullPath) === ".dita") {
        const data = await fs.readFile(fullPath, "utf-8");
        const $ = cheerio.load(data, { xmlMode: true });

        // Find all <p> tags inside <body>
        $("body > p").each((index, element) => {
          const pTag = $(element);

          if (pTag.attr("conaction") === "mark" && pTag.attr("conref")) {
            const conref = pTag.attr("conref");
            const conaction = pTag.attr("conaction");

            const id = pTag.attr("id") || "N/A";
            const nextSibling = pTag[0].nextSibling;

            if (nextSibling && nextSibling.tagName === "p") {
              const nextPTag = $(nextSibling);

              // Check if next <p> has conaction="pushafter"
              const nextPTagData =
                nextPTag.attr("conaction") === "pushafter" ||
                nextPTag.attr("conaction") === "pushbefore" ||
                nextPTag.attr("conaction") === "mark"
                  ? nextPTag.toString()
                  : null;

              // Push data into the results array
              results.push({
                p_id: id,
                conaction: conaction,
                conref: conref,
                nextPTag: nextPTagData || "N/A",
                nextPTag_id: nextPTag.attr("id") || "N/A",
                from: fullPath,
              });
            }
          }
        });
      }
    }
  } catch (err) {
    console.error("Error processing directory:", err);
  }
}

// function start processing
async function processDitaFiles(directory) {
  try {
    await fs.writeFile(outputFilePath, "[]", "utf-8");
    results = [];

    await readDitaFilesAndExtractData(directory);

    if (results.length > 0) {
      await fs.writeFile(
        outputFilePath,
        JSON.stringify(results, null, 2),
        "utf-8"
      );

      console.log(`✅ Data successfully written to ${outputFilePath}`);

      await processDataset(results);
    } else {
      console.log("⚠ No matching <p> tags found.");
    }
  } catch (err) {
    console.error("❌ Error processing files:", err);
  }
}

// ✅ Wrap everything inside an async IIFE
(async () => {
  try {
    await processDitaFiles("./input/audit_2024 UK/topic_edits"); // update/adjust your path here
  } catch (error) {
    console.error("❌ Error during execution:", error);
  } finally {
    clearLogData();
  }
})();
