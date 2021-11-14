const Parent: selector = (
  { A, B, C, D },
  { isUserLogged = observe.user.data, isErrorInUser }
) => {
  if (isUserLogged) {
    return A;
  } else if (isErrorInUser) {
    return B;
  }
};
