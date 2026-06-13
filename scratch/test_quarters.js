const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const getQuarterDateRange = (quarterNum, period) => {
  const startDate = new Date(period.start_date);
  if (isNaN(startDate.getTime())) return `Q${quarterNum}`;

  const qStart = addMonths(startDate, (quarterNum - 1) * 3);
  const nextQStart = addMonths(startDate, quarterNum * 3);
  const qEnd = new Date(nextQStart.getTime() - 24 * 60 * 60 * 1000);

  return `Q${quarterNum} (${formatDate(qStart)} - ${formatDate(qEnd)})`;
};

const period = { start_date: '2026-04-01', end_date: '2027-03-31' };
console.log('Q1:', getQuarterDateRange(1, period));
console.log('Q2:', getQuarterDateRange(2, period));
console.log('Q3:', getQuarterDateRange(3, period));
console.log('Q4:', getQuarterDateRange(4, period));
