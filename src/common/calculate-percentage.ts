export function calculatePercentage(reviws) {
  let reviwsArr = [];
  for (let i = 0; i < reviws.length; i++) {
    reviwsArr.push(reviws[i]['rating']);
  }

  const sumOfRatings = reviwsArr.reduce(
    (previous, current) => previous + current,
    0,
  );

  const ratingsPersentage =
    ((sumOfRatings / (reviwsArr.length * 5)) * 100).toFixed(0) + '%';

  return ratingsPersentage;
}
