import { Staff } from "@/types/model";
import moment, { MomentInput } from "moment-timezone";

export const time = (input: MomentInput) =>
  moment(input).tz("Australia/Sydney");

export const isMobile = (val: string | number) => {
  const input = val + "";
  const isValid =
    input.startsWith("4") ||
    input.startsWith("04") ||
    input.startsWith("+614") ||
    input.startsWith("614");

  const replaced = input.replace("+61", "");

  if (
    !isValid ||
    input.length < 9 ||
    isNaN(Number(replaced)) ||
    Number(replaced) > 500000000
  ) {
    return false;
  }

  return true;
};

export function isIP(ipaddress: string) {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ipaddress
    )
  ) {
    return true;
  }
  return false;
}

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

export const uploadFile = async (file: Blob) => {
  if (!file) {
    return null;
  }

  const form = new FormData();
  form.append("file", file);

  const result = await fetch("/api/file", {
    method: "POST",
    body: form,
  }).then((res) => res.json());

  return result;
};

export const urlToFile = async (url: string) => {
  const image = await fetch(url).then((res) => res.blob());
  if (image) {
    return new File([image], image.name, { type: image.type });
  }
  return null;
};

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

export const getRole = (staff: Staff | undefined = undefined, key: Key) => {
  if (!staff) {
    return false;
  }
  try {
    const parsed: StaffRole = JSON.parse(staff.permission);
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
