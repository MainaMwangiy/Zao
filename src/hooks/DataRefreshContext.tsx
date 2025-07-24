import { createContext, useContext } from "react";
interface DataRefreshContextType {
    refreshData: () => void;
}

const DataRefreshContext = createContext<DataRefreshContextType>({
    refreshData: () => { },
});

export const useDataRefresh = () => useContext(DataRefreshContext);

export default DataRefreshContext;