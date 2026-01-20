// User: t...ty...typ...typing... (rapid keystrokes)
function SearchInput() {
  const [query, setQuery] = useState('');
  
  // ✅ DEBOUNCE - Search only after user stops typing
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      console.log('Searching for:', searchTerm);
      // API call happens here
      fetchResults(searchTerm);
    }, 500), // Wait 500ms after last keystroke
    []
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value); // Will only fire after 500ms pause
  };

  return <input value={query} onChange={handleChange} />;
}


// Button Clicks - DEBOUNCE (Prevent Double Submission)

function OrderButton() {
  const [loading, setLoading] = useState(false);
  
  // ✅ DEBOUNCE - Prevent accidental double-clicks
  const handleOrder = useCallback(
    debounce(() => {
      setLoading(true);
      processOrder().finally(() => setLoading(false));
    }, 1000), // Ignore clicks within 1 second
    []
  );

  return (
    <button onClick={handleOrder} disabled={loading}>
      {loading ? 'Processing...' : 'Place Order'}
    </button>
  );
}

//Throttling------------------------------------------------------------------------------

// Window Scroll - THROTTLE (Performance)

// User scrolling rapidly - fires events every few ms
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  
  // ✅ THROTTLE - Update at most every 100ms during scroll
  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrollY(window.scrollY);
      // Update UI or track analytics
    }, 100); // Max once every 100ms

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div>Scroll position: {scrollY}px</div>;
}


import { debounce, throttle } from 'lodash';

// 1. Search with debounce
const searchAPI = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 300);

// 2. Scroll with throttle
const trackScroll = throttle(() => {
  analytics.track('scroll', window.scrollY);
}, 1000);

// 3. Resize with throttle
const handleResize = throttle(() => {
  updateLayout(window.innerWidth);
}, 200);