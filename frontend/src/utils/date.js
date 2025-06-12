import { format } from 'date-fns';

export function formatDate(date, pattern = 'dd/MM/yyyy') {
  if (!date) {
    return '';
  }

  const dateObject = new Date(date);

  if (isNaN(dateObject.getTime())) {
    return '';
  }

  return format(dateObject, pattern);
}