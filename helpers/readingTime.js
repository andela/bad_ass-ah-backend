
const readingTime = (body) => {
  const numberOfWords = body.split(' ').length;
  const x = (numberOfWords / 265);
  const initialMinutes = Math.floor(x);
  const seconds = Math.floor((x - Math.floor(x)) * 60);
  let finalMinutes;
  if (initialMinutes > 0 && seconds >= 30) {
    finalMinutes = initialMinutes + 1;
  }
  if (initialMinutes > 0 && seconds < 30) {
    finalMinutes = initialMinutes;
  }
  const time = initialMinutes > 0 ? `${finalMinutes} min` : `${seconds} sec`;

  return time;
};

export default readingTime;
