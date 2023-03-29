import { useRouter } from "next/router";

export default useRouteHandler;

export function useRouteHandler(targetUrl: string, keepQueries: boolean = true) {
  const router = useRouter();

  let path = targetUrl;

  if (keepQueries) {
    path += window.location.search;
  }

  router.push(path);
}