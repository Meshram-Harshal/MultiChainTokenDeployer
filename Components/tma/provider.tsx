"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { SDKProvider, User, retrieveLaunchParams } from "@tma.js/sdk-react";
import { TmaContext } from "./context";
import { TmaLoader } from "./loader";
import { TmaErrorHandler } from "./error-handler";

export function TmaProvider(props: PropsWithChildren) {
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [telegramUser, setTelegramUser] = useState<User>({} as User);

  function fetchTelegramUser() {
    try {
      const launchParams = retrieveLaunchParams();
      const user = launchParams.initData?.user;
      if (!user) {
        throw new Error("User not found");
      }
      setTelegramUser(user);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(fetchTelegramUser, []);

  if (isLoading) return <TmaLoader />;
  if (isError) return <TmaErrorHandler />;

  return (
    <TmaContext.Provider
      value={{
        user: telegramUser,
      }}
    >
      <SDKProvider acceptCustomStyles debug>
        {props.children}
      </SDKProvider>
    </TmaContext.Provider>
  );
}
