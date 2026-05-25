import { useEffect, useState } from "react";
import api from "../services/api";

export function useResults() {
  const [results, setResults] = useState([]);
 
  const getResults = useCallback(async () => {
    const res = await api.get("/results");
    setResults(res.data);
  }, []);
 
  useEffect(() => { getResults(); }, [getResults]);
  return { results, getResults };
}