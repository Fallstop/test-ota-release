import { Role } from "../../constants";
import { getMessages } from "../../db/dbClient";
import type { userDataType } from "../api/[user]/+server";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch, locals }) => {
  const session = await locals.auth();
  if (!session) {
    throw { status: 401, message: "Unauthorized" };
  }

  return {
    user: (await fetch(`/api/${session.user?.id}`).then((r) =>
      r.json()
    )) as userDataType,
    account: session.user,
    role: locals.role,
    appMode: locals.appMode,
    nextTime: locals.nextTime,
    ...(locals.role === Role.Admin
      ? {
          messages: await getMessages(undefined, new Date(0), new Date()),
        }
      : {}),
  };
};
