export function calculatePercentage(reviews) {
  let reviewsArr = [];
  for (let i = 0; i < reviews.length; i++) {
    reviewsArr.push(reviews[i]['rating']);
  }
  const sumOfRatings = reviewsArr.reduce(
    (previous, current) => previous + current,
    0,
  );
  const ratingsPersentage = +(
    (sumOfRatings / (reviewsArr.length * 5)) *
    100
  ).toFixed(0);
  return ratingsPersentage;
}
