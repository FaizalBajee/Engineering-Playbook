import { useState, useEffect, useRef, useCallback } from "react";

const useInfiniteScroll = (fetchFunction, hasMore) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchFunction(page);
      setLoading(false);
    };

    fetchData();
  }, [page, fetchFunction]);

  return {
    lastElementRef,
    loading,
    page
  };
};

export default useInfiniteScroll;
