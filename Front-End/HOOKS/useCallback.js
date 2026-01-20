function Dashboard() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // ❌ Without useCallback - recreates on every state change
  const fetchProducts = async () => {
    const response = await fetch(`/api/products?category=${selectedCategory}`);
    const data = await response.json();
    setProducts(data);
  };
  
  // ✅ With useCallback - only recreates when selectedCategory changes
  const fetchProductsMemoized = useCallback(async () => {
    const response = await fetch(`/api/products?category=${selectedCategory}`);
    const data = await response.json();
    setProducts(data);
  }, [selectedCategory]); // Only recreate if selectedCategory changes
  
  return (
    <div>
      <CategoryFilter onChange={setSelectedCategory} />
      <SearchBar onSearch={fetchProductsMemoized} />
      <RefreshButton onRefresh={fetchProductsMemoized} />
      <ProductGrid products={products} />
    </div>
  );
}
