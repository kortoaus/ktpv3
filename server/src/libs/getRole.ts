type StaffRole = {
  [key: string]: boolean;
};

type Key =
  | "isOpen"
  | "isDirector"
  | "isTable"
  | "isProduct"
  | "isBuffet"
  | "isStaff";
// {"isOpen":true}
const getRole = (role: string, key: Key) => {
  try {
    const parsed: StaffRole = JSON.parse(role);
    if (parsed["isDirector"]) {
      return true;
    }
    return Boolean(parsed[key]);
  } catch (e) {
    console.log(e);
    return false;
  }
};

export default getRole;
