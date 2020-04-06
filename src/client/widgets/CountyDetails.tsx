import React, {
  useContext,
  useRef,
  createRef,
  useEffect,
  useState,
} from "react";
import { CountyExplorerContext, CountyHistory } from "../stores/AppState";
import * as Highcharts from "highcharts";
import { CountyDatum } from "../data/nyt";
import CountyMap from "./CountyMap";

export default function CountyDetails(props: any) {
  const countyStore = useContext(CountyExplorerContext);
  return (
    <pre>
      {countyStore.state.selectedCountyData && (
        <CountyChart county={countyStore.state.selectedCountyData} />
      )}
      {/* {JSON.stringify(countyStore.state.selectedCountyData, undefined, 2)} */}
    </pre>
  );
}

const createId = () =>
  Math.round(Math.random() * Number.MAX_SAFE_INTEGER).toString();

type ChartType = "cases" | "deaths" | "dailycases" | "dailydeaths";
export function CountyChart(props: {
  county: CountyHistory;
}): React.ReactElement {
  const container = useRef<HTMLDivElement>(null);
  const [id, setId] = useState(createId);
  const [logarithmic, setLogorithmic] = useState(true);
  const [chartType, setChartType] = useState<ChartType>("cases");
  useEffect(() => {
    const div = container.current;
    if (div) {
      createChart(div, props.county, logarithmic, chartType);
    }
  }, [props.county.county, logarithmic, chartType]);
  return (
    <div>
      <select
        value={chartType}
        onChange={(e) => setChartType(e.target.value as ChartType)}
      >
        <option value={"cases"}>Cases</option>
        <option value={"deaths"}>Deaths</option>
        <option value={"dailycases"}>Daily Cases</option>
        <option value={"dailydeaths"}>Daily Deaths</option>
      </select>
      <input
        type="checkbox"
        name="is-logarithmic"
        checked={logarithmic}
        onChange={(e) => setLogorithmic(e.target.checked)}
      />
      <label htmlFor="is-logarithmic">Logarithmic</label>
      <div id={id} ref={container}></div>
    </div>
  );
}

function createChart(
  div: HTMLElement,
  county: CountyHistory,
  logarithmic: boolean,
  chartType: ChartType
) {
  let series: any | undefined;
  if (chartType === "deaths") {
    series = {
      name: "Deaths",
      data: county.data.map((x) => [new Date(x.date).valueOf(), x.deaths]),
    };
  } else if (chartType === "cases") {
    series = {
      name: "Cases",
      data: county.data.map((x) => [new Date(x.date).valueOf(), x.cases]),
    };
  } else if (chartType === "dailycases") {
    series = {
      name: "Daily Cases",
      data: dailyChange(county.data, (x) => x.cases),
    };
  } else if (chartType === "dailydeaths") {
    series = {
      name: "Daily Deaths",
      data: dailyChange(county.data, (x) => x.deaths),
    };
  }
  return Highcharts.chart(div, {
    xAxis: {
      type: "datetime",
      //   zoomEnabled: true,
    },
    yAxis: {
      type: logarithmic ? "logarithmic" : "linear",
    },
    title: {
      text: county.county,
    },
    chart: {
      animation: false,
      zoomType: "x",
    },
    series: [series],
  });
}

function dailyChange(
  data: CountyDatum[],
  getValue: (d: CountyDatum) => number
): [number, number][] {
  let current: number | undefined;
  let results: [number, number][] = [];
  for (const day of data) {
    const daysValue = getValue(day);
    if (current === undefined) {
      current = daysValue;
    } else {
      results.push([new Date(day.date).valueOf(), daysValue - current]);
      current = daysValue;
    }
  }
  return results;
}
