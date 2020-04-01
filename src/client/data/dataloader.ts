import moment from "moment";
import axios from "axios";
import clientConfig from "../clientConfig";

const confirmedGlobalString = require("../../data/time_series_covid19_confirmed_global.csv");

function constructUrl(date: Date) {
  return `${
    clientConfig.apiUrl
  }/virginia-edu/covid-19/dashboard/data/nssac-ncov-sd-${moment(date).format(
    "MM-DD-YYYY"
  )}.csv`;
}

export function fetchDay(date: Date): Promise<any> {
  return axios.get(constructUrl(date)).then(r => r.data);
}

export function fetchTimeseriesDeaths(): Promise<any> {
  return Promise.resolve(confirmedGlobalString);
}
