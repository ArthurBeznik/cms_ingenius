const paginate = <T>(
  data: T[],
  page: string | undefined,
  limit: string | undefined
): { page: number; limit: number; totalItems: number; data: T[] } => {
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = startIndex + limitNumber;

  const paginatedData = data.slice(startIndex, endIndex);

  return {
    page: pageNumber,
    limit: limitNumber,
    totalItems: data.length,
    data: paginatedData,
  };
};

export default paginate;
