export const MatchMake = (user, otherUsers, interest) => {
  let array = [];

  if (otherUsers.length === 0) {
    return;
  }

  const userInterests = user.interests[interest];

  for (let other of otherUsers) {
    const otherInterest = other.interests[interest];
    const similarity = jaccardSimilarity(userInterests, otherInterest);
    array.push({ user: other, percent: similarity });
  }

  const sortedArray = array.sort((a, b) => b.percent - a.percent);

  return sortedArray;
};

function jaccardSimilarity(set1, set2) {
  if (!Array.isArray(set1) || !Array.isArray(set2)) {
    throw new Error("Input sets must be arrays");
  }

  const intersection = new Set(
    [...set1].filter((element) => set2.includes(element))
  );
  const union = new Set([...set1, ...set2]);

  const similarity = intersection.size / union.size;
  return similarity * 100;
}
