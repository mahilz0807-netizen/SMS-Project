import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

export default function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getStudents();
  }, [getStudents]);

  return { students, loading, error, getStudents };
}