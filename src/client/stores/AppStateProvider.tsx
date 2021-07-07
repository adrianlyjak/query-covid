import React, { useState, useContext, useEffect } from "react";
import {
  CountyExplorerStore,
  CountyExplorerContext,
  emptyState,
} from "./AppState";

export const CountyExplorerStoreProvider = (props: {
  children: any;
}): React.ReactElement => {
  const [state, setState] = useState(emptyState);
  const store = new CountyExplorerStore(
    (update) => {
      setState({ ...state, ...update });
    },
    () => state
  );
  const Provider = CountyExplorerContext.Provider;
  return <Provider value={store}>{props.children}</Provider>;
};

export const DateAnimator = ({ millis = 1000 }: { millis?: number } = {}) => {
  const store = useContext(CountyExplorerContext);
  useEffect(() => {
    setTimeout(() => {
      store.tickDate();
    }, millis);
  }, [store.state.selectedDate]);
  return null;
};
