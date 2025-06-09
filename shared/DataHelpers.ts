
export const getCurrentWeekBounds = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + (6 - dayOfWeek));
  const format = (date: Date) => date.toISOString().slice(0, 10);
  return {
    sunday: format(sunday),
    saturday: format(saturday),
  };
} 
