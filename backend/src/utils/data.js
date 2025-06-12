function addTotal(array) {
  let total = 0;

  if (!Array.isArray(array) || array.length === 0) {
    return { data: [], total: 0 };
  }

  const data = array.map((item) => {
    total = item.total;

    delete item.total;

    return item;
  });

  return { data, total };
}

module.exports = { addTotal };