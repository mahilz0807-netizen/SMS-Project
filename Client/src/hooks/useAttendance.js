import { useEffect, useState } from "react";
import api from "../services/api";

export function useAttendance() {
  const [attendance, setAttendance] = useState([]);
 
  const getAttendance = useCallback(async () => {
    const res = await api.get("/attendance");
    setAttendance(res.data);
  }, []);
 
  useEffect(() => { getAttendance(); }, [getAttendance]);
  return { attendance, getAttendance };
}