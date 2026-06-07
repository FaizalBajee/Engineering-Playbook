# How Virtualization Fixes Large DOM Issues

## Scenario

Assume a table contains **10,000 records**, but only **20 rows** can be displayed on the screen at a time.

---

## Without Virtualization

### Data Loaded

10,000 rows loaded

### DOM Rendered

10,000 rows rendered

### Result

* Large DOM size
* Higher memory consumption
* Slower rendering
* Potential scrolling lag
* More work for React during updates

---

## With Virtualization

### Data Loaded

10,000 rows loaded

### DOM Rendered

20 rows rendered

Only the rows visible in the viewport are rendered.

---

## During Scrolling

As the user scrolls:

Row 1 disappears
Row 21 appears

Row 2 disappears
Row 22 appears

...

The visible rows are continuously replaced with new ones.

---

## DOM Size

### Without Virtualization


10,000 DOM rows


### With Virtualization

20-30 DOM rows

The DOM size remains nearly constant regardless of how many records exist.

---

## Benefits

* Reduced memory usage
* Faster rendering
* Smoother scrolling
* Better browser performance
* Improved user experience for large datasets

---

## Summary

Virtualization does not reduce the amount of data loaded. Instead, it reduces the number of DOM elements rendered by displaying only the items currently visible on the screen.
