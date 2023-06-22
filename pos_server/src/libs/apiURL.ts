const apiURL = process.env.API_URL + "/v1/device" || "";

export default apiURL;

export const getData = async (
  url: string,
  key: string,
  method: "GET" | "POST" = "GET",
  body: string | undefined = undefined
) => {
  const data = await fetch(encodeURI(`${apiURL}${url}`), {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `BearerIP ${key}`,
    },
    body,
  })
    .then((res) => res.json())
    .catch((e) => {
      console.log(e);
      return { ok: false, msg: "Communication Failed! Please Check Server!" };
    });

  return data;
};
