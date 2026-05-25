import { useEffect, useState } from "react";
import api from "../services/api";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const getCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses");
      setCourses(res.data);
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => { getCourses(); }, [getCourses]);
  return { courses, loading, getCourses };
}
