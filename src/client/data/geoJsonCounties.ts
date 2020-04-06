import untypedCounties from "../../data/geojson-counties-fips.json";
import { FeatureCollection } from "geojson";

const featureCollection = untypedCounties as FeatureCollection;

export default featureCollection;
