import React, { useState, useEffect } from "react";
import { ToastAndroid } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [networkDetails, setNetworkDetails] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!isConnected && state.isConnected) {
        ToastAndroid.show("Internet Connection Restored.", ToastAndroid.SHORT);

        setRefreshKey((prevKey) => prevKey + 1);
      } else if (isConnected && !state.isConnected) {
        ToastAndroid.show(
          "No Internet Connection. Please check your connection.",
          ToastAndroid.LONG
        );
      }
      setIsConnected(state.isConnected);
      setNetworkDetails(state);
    });

    return () => unsubscribe();
  }, [isConnected]);

  return (
    <>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, { refreshKey });
      })}
    </>
  );
};

export default NetworkProvider;
