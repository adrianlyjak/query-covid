import usCounties from "../../data/us-counties.json";

const baseData = Object.freeze(
  (usCounties as CountyDatum[]).map((x) => Object.freeze(x))
);

export interface CountyDatum {
  state: string;
  county: string;
  deaths: number;
  cases: number;
  date: string;
  fips: string;
}

const cached = <T>(fn: () => T): (() => T) => {
  let value: T | undefined;
  let run = false;
  return () => {
    if (run) {
      return value as T;
    } else {
      run = true;
      value = fn();
      return value as T;
    }
  };
};

export const groupedByFips = cached(() => {
  const byFips: Record<string, CountyDatum[]> = {};
  for (const datum of baseData) {
    const fips = datum.fips;
    (byFips[fips] = byFips[fips] || []).push(datum);
  }
  for (const arr of Object.values(byFips)) {
    arr.sort((a, b) => a.date.localeCompare(b.date));
    Object.freeze(arr);
  }
  return Object.freeze(byFips);
});
