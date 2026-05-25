export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};