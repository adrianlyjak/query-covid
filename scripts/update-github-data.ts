import fs from "fs";
import path from "path";
import https from "https";
import axios from "axios";
import papaparse from "papaparse";
import { promisify } from "util";

const mkdir = promisify(fs.mkdir);

const writeFile = promisify(fs.writeFile);

interface RemoteCSV {
  filename: string;
  type: "US" | "global";
}

async function downloadAll() {
  const items: RemoteCSV[] = [
    { filename: "time_series_covid19_confirmed_US.csv", type: "US" },
    { filename: "time_series_covid19_confirmed_global.csv", type: "global" },
    { filename: "time_series_covid19_deaths_US.csv", type: "US" },
    { filename: "time_series_covid19_deaths_global.csv", type: "global" }
  ];

  await mkdir(path.join(__dirname, "../src/data"), {
    recursive: true
  });

  for (const item of items) {
    const resp = await axios.get(
      `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/${item.filename}`
    );

    const csv = papaparse.parse(resp.data);

    const resultJson = csv.data.slice(1).map(row => {
      if (item.type === "US") {
        return {
          country: row[1],
          addressLocality: row[5],
          addressRegion: row[6],
          series: row.slice(12)
        };
      } else {
        return {
          country: row[1],
          series: row.slice(4)
        };
      }
    });
    await writeFile(
      path.join(
        __dirname,
        "../src/data",
        path.parse(item.filename).name + ".json"
      ),
      JSON.stringify(resultJson)
    );

    // const writeStream = fs.createWriteStream(
    //   path.join(__dirname, "../src/data")
    // );
  }
}

downloadAll();
