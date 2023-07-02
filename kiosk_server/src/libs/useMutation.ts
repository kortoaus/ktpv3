import { useState } from "react";

interface UseMutationState<T> {
  loading: boolean;
  result?: T;
  error?: object;
}
type UseMutationResult<T> = [(data: any) => void, UseMutationState<T>];

export default function useMutation<T = any>(
  url: string,
  method: "POST" | "GET" | "DELETE" | "PUT" = "POST"
): UseMutationResult<T> {
  const [state, setSate] = useState<UseMutationState<T>>({
    loading: false,
    result: undefined,
    error: undefined,
  });
  function mutation(data: any) {
    setSate((prev) => ({ ...prev, loading: true }));

    let token: null | string = null;

    if (typeof window !== undefined) {
      token = window.localStorage.getItem("accessToken") || null;
    }

    let headers = {};
    if (token !== null) {
      headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    } else {
      headers = {
        "Content-Type": "application/json",
      };
    }

    fetch(`${url}`, {
      method: method,
      headers,
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json().catch(() => {});
      })
      .then((data) => setSate((prev) => ({ ...prev, result: data })))
      .catch((error) => setSate((prev) => ({ ...prev, error })))
      .finally(() => setSate((prev) => ({ ...prev, loading: false })));
  }

  return [mutation, { ...state }];
}
