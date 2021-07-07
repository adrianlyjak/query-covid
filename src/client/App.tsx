import React from "react";
import CountyMap from "./widgets/CountyMap";
import "leaflet/dist/leaflet.css";
import {
  CountyExplorerStoreProvider,
  DateAnimator,
} from "./stores/AppStateProvider";
import CountyDetails from "./widgets/CountyDetails";

function App(props: any) {
  return (
    <CountyExplorerStoreProvider>
      {/* <DateAnimator millis={100} /> */}
      <div style={{ display: "flex", height: "100%", flexDirection: "row" }}>
        <div style={{ flex: 2 }}>
          <CountyMap />
        </div>
        <div style={{ flex: 1 }}>
          <CountyDetails />
        </div>
      </div>
    </CountyExplorerStoreProvider>
  );
}

export default App;
