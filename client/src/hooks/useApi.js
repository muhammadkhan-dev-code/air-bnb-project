import { useCallback, useEffect, useState } from "react";
import { request } from "../services/api";
export function useApi(path) {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({
    key: "",
    data: null,
    error: null,
    loading: true,
  });
  useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({
      ...previous,
      key: path,
      loading: true,
      error: null,
    }));
    request(path, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted)
          setState({ key: path, data, error: null, loading: false });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({ key: path, data: null, error, loading: false });
      });
    return () => controller.abort();
  }, [path, version]);
  const reload = useCallback(() => setVersion((value) => value + 1), []);
  return { ...state, loading: state.key !== path || state.loading, reload };
}
