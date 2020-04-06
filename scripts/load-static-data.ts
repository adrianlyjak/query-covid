import fs from "fs";
import path from "path";
import axios from "axios";
import { promisify } from "util";

const mkdir = promisify(fs.mkdir);

const writeFile = promisify(fs.writeFile);

async function downloadAll() {
  await mkdir(path.join(__dirname, "../src/data"), {
    recursive: true,
  });

  const resp = await axios.get(
    `https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json`,
    {
      responseType: "arraybuffer",
    }
  );

  await writeFile(
    path.join(__dirname, "../src/data", "geojson-counties-fips.json"),
    resp.data
  );
}

downloadAll();
