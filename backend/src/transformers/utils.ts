export const formatDate = (date: Date | string) => {
  if (!date) {
    return new Date().toISOString().split('T')[0];
  }
  
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  
  return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
};
