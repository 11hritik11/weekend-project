export const gridItems = Array.from({ length: 30 }, (_, index) => {
  const labelNumber = `#${index + 1}`;
  const title =
    index % 3 === 0 ? "HELIOS_UNIT_0" : index % 3 === 1 ? "PROMETHEUS-." : "SOL_ARCHIVE";

  return {
    id: index + 1,
    digit: (index % 9) + 1,
    labelNumber,
    title
  };
});
