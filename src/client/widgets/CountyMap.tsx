import * as geojson from "geojson";
import * as Leaflet from "leaflet";
import { PathOptions, StyleFunction } from "leaflet";
import React, { useContext, useEffect } from "react";
import { GeoJSON, Map, TileLayer } from "react-leaflet";
import geoJsonCounties from "../data/geoJsonCounties";
import { CountyExplorerContext } from "../stores/AppState";
import moment from "moment";

export default function CountyMap(props: {}): React.ReactElement {
  const store = useContext(CountyExplorerContext);

  useEffect(() => {
    const start = moment("2020-03-10");
    let date = moment(start);
    const end = moment();
    const timer = setInterval(() => {
      console.log("set stuff");
      store.selectDate(date.format("YYYY-MM-DD"));
      date = date.add(1, "day");
      if (date.isAfter(end)) {
        date = moment(start);
      }
    }, 500);
  }, []);

  const countyStyle: StyleFunction<GeoJSON.Feature> = (
    elem: GeoJSON.Feature | undefined
  ): PathOptions => {
    const countyId = elem?.properties && parseFips(elem?.properties);
    const county = countyId && store.getCountyByFips(countyId);
    let color: string;
    if (!county) {
      color = "gray";
    } else if (county.cases < 100) {
      color = "green";
    } else if (county.cases < 1000) {
      color = "yellow";
    } else if (county.cases < 10000) {
      color = "orange";
    } else {
      color = "red";
    }
    return {
      color,
    };
  };
  return (
    <Map
      center={[39.300365713073454, -95.80174581635467]}
      zoom={5}
      style={{ width: "100%", height: "100%" }}
      onViewportChanged={(e) => {
        console.log({ e });
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* county layers */}
      <GeoJSON
        data={geoJsonCounties}
        style={countyStyle}
        onEachFeature={(
          feature: geojson.Feature<geojson.GeometryObject, any>,
          layer: Leaflet.Layer
        ): void => {
          const fips = parseFips(feature.properties);
          if (fips) {
            layer.on("click", () => store.selectCountyByFips(fips));
          }
        }}
      />
    </Map>
  );
}

function parseFips(properties: Record<string, string>): string | null {
  if (!properties.GEO_ID) return null;
  const part = properties.GEO_ID.split("US")[1];
  return part || null;
}
