function shuffleOptions(correct, wrongOptions) {
  const allOptions = [...wrongOptions, correct];

  // Fisher-Yates shuffle
  for (let i = allOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
  }

  const labels = ["A", "B", "C", "D"];
  const options = {};

  allOptions.forEach((opt, index) => {
    options[labels[index]] = opt;
  });

  return { options, correctAnswer: correct };
}

export default shuffleOptions;