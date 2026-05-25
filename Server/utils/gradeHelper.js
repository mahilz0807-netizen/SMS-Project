const getGrade = (marks) => {
  if (marks >= 75) return "A";
  if (marks >= 65) return "B";
  if (marks >= 50) return "C";
  if (marks >= 35) return "S";
  return "F";
};

module.exports = getGrade;