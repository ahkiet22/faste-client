export const createUrlQuery = (name: string, value: any) => {
  const params = new URLSearchParams();
  params.set(name, value);

  return params.toString();
};
