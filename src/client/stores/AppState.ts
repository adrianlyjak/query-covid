import { FeatureCollection } from "geojson";
import { CountyDatum, groupedByFips } from "../data/nyt";
import React, { useContext, useState, Children } from "react";
import moment from "moment";

export interface CountyExplorerState {
  days: Date[];
  selectedDate: string | null;
  selectedCounty: string | null;
  selectedCountyData: CountyHistory | null;
  countyMapData: FeatureCollection | null;
  selections: Record<string, CountyHistory>;
}

export interface CountyHistory {
  data: CountyDatum[];
  county: string;
  state: string;
  fips: string;
  cases: number;
  deaths: number;
}

export const emptyState: CountyExplorerState = {
  days: [],
  selectedDate: null,
  selectedCounty: null,
  selectedCountyData: null,
  countyMapData: null,
  selections: deriveSelections(null),
};

function deriveSelections(selectedDate: string | null) {
  const byFips: Record<string, CountyHistory> = {};

  for (const [fips, data] of Object.entries(groupedByFips())) {
    const day = selectedDate
      ? data.find((x) => x.date == selectedDate)
      : data[data.length - 1];
    if (day) {
      byFips[fips] = {
        data,
        ...day,
      };
    }
  }
  return byFips;
}
// TODO
/**
 * - add type (country, state,)
 * - abstract id
 * - switch / aggregate data source, geo
 * - add day selector
 */

export class CountyExplorerStore {
  readonly setState: (update: Partial<CountyExplorerState>) => void;
  readonly getState: () => CountyExplorerState;

  constructor(
    setState: (update: Partial<CountyExplorerState>) => void = () => {},
    getState: () => CountyExplorerState = () => emptyState
  ) {
    this.setState = setState;
    this.getState = getState;
  }

  get state(): CountyExplorerState {
    return this.getState();
  }

  selectDate(date: string): void {
    const selections = deriveSelections(date);
    this.setState({
      selectedDate: date,
      selections: selections,
    });
  }

  selectCountyByFips(fips: string): void {
    const county = this.state.selections[fips]!;
    this.setState({
      selectedCounty: county.data[0].county,
      selectedCountyData: county,
    });
  }

  getCountyByFips(fips: string): CountyHistory | undefined {
    return this.state.selections[fips];
  }

  tickDate() {
    const start = moment("2020-03-10");
    let date = this.state.selectedDate
      ? moment(this.state.selectedDate)
      : start;
    const end = moment();
    date = date.add(1, "day");
    if (date.isAfter(end)) {
      date = moment(start);
    }
    this.selectDate(date.format("YYYY-MM-DD"));
  }
}

const noStore = new CountyExplorerStore(() => {
  throw new Error("this is a dummy store. Cannot set state");
});
export const CountyExplorerContext = React.createContext<CountyExplorerStore>(
  noStore
);
