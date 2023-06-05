export const isMobile = (val: string | number) => {
  const input = val + "";
  const isValid =
    input.startsWith("4") ||
    input.startsWith("04") ||
    input.startsWith("+614") ||
    input.startsWith("614");

  const replaced = input.replace("+61", "");

  if (!isValid || input.length < 9 || isNaN(Number(replaced))) {
    return false;
  }

  return true;
};

export const signOut = () => {
  if (typeof window === "undefined") {
    return;
  }
  const msg = "Do you really want to sign out?";
  if (!window.confirm(msg)) {
    return;
  }

  fetch("/api/auth/signout");
};
