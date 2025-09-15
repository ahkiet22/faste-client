export const setLocalUserData = (accessToken: string) => {
  localStorage.setItem('accessToken', JSON.stringify(accessToken));
};
