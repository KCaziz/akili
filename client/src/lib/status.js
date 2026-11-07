export function filterByStatus(items, filter) {
  return filter === "ALL" ? items : items.filter((item) => item.status === filter);
}
