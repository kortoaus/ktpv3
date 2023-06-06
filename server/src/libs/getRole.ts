type StaffRole = {
  [key: string]: boolean;
};

//  {"isOpen":true,"isDirector":true, "isTable":true, "isCategory":true}

type Key = "isOpen" | "isDirector" | "isTable" | "isCategory";
// {"isOpen":true}
const getRole = (role: string, key: Key) => {
  try {
    const parsed: StaffRole = JSON.parse(role);
    return Boolean(parsed[key]);
  } catch (e) {
    console.log(e);
    return false;
  }
};

export default getRole;
