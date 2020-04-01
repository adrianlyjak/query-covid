import React, { useState, useEffect } from "react";
import { fetchDay, fetchTimeseriesDeaths } from "./data/dataloader";

function App(props: any) {
  const [data, setData] = useState();
  useEffect(() => {
    const runAsync = async () => {
      setData(await fetchTimeseriesDeaths());
    };
    runAsync();
  }, []);
  console.log("I am data", data);
  return <span>I am app</span>;
}

export default App;
