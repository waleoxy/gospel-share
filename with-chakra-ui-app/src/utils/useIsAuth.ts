import { useMeQuery } from "../generated/graphql";
import { useEffect } from "react";
import { useRouter } from "next/router";

const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [data, fetching, router]);
};
export default useIsAuth;
