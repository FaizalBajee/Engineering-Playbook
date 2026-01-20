// Scenario: Chart library processing large datasets

function SalesDashboard({ rawData, dateRange, viewType }) {
  // ✅ Process data for charts only when inputs change
  const chartData = useMemo(() => {
    console.log('Processing chart data...');
    
    // Filter by date range
    const filtered = rawData.filter(item => 
      item.date >= dateRange.start && 
      item.date <= dateRange.end
    );
    
    // Aggregate based on view type
    if (viewType === 'daily') {
      return aggregateByDay(filtered);
    } else if (viewType === 'weekly') {
      return aggregateByWeek(filtered);
    } else {
      return aggregateByMonth(filtered);
    }
  }, [rawData, dateRange, viewType]);

  // ✅ Formatting options
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `$${value.toLocaleString()}`
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => `Sales: $${ctx.raw.toLocaleString()}`
        }
      }
    }
  }), []); // Static options - never recalc

  return (
    <div>
      <LineChart data={chartData} options={chartOptions} />
      <BarChart data={chartData} options={chartOptions} />
    </div>
  );
}

// Why useMemo: Processing 10,000+ data points for charts; memoization prevents UI freezing on filter changes.



