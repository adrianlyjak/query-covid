import fs from "fs";
import path from "path";
import axios from "axios";
import papaparse from "papaparse";
import { promisify } from "util";

const mkdir = promisify(fs.mkdir);

const writeFile = promisify(fs.writeFile);

async function downloadAll() {
  await mkdir(path.join(__dirname, "../src/data"), {
    recursive: true,
  });

  const filename = "us-counties.csv";
  const resp = await axios.get(
    `https://raw.githubusercontent.com/nytimes/covid-19-data/master/${filename}`
  );

  const csv = papaparse.parse(resp.data);

  const resultJson = csv.data.slice(1).map((row) => {
    return {
      date: row[0],
      county: row[1],
      state: row[2],
      fips: Number.parseInt(row[3]),
      cases: Number.parseInt(row[4]),
      deaths: Number.parseInt(row[5]),
    };
  });
  await writeFile(
    path.join(__dirname, "../src/data", path.parse(filename).name + ".json"),
    JSON.stringify(resultJson, undefined, 2)
  );
}

downloadAll();
