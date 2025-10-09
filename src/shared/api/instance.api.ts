import { FetchClient } from "@/shared/utils";
import { env } from "@/env";

export const api = new FetchClient({
  baseUrl: env.SERVER_URL,
  options: {
    credentials: "include",
  },
});
