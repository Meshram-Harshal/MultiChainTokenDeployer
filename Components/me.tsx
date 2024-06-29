"use client";

import { useTma } from "./tma/hook";

export function Me() {
  const { user } = useTma();

  return (
    <div className="">
      <pre>Name : {user.firstName}</pre>
      <pre>Username : @{user.username}</pre>
    </div>
  );
}
