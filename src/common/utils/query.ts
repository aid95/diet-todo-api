export const isExistsQuery = (query: string) =>
  `SELECT EXISTS(${query}) AS "exists"`;
