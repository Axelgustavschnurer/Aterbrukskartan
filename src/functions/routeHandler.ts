import { useRouter } from "next/router";

export default useRouteHandler;

/**
 * Redirects to a new URL, optionally keeping the queries in the current URL.
 * @param targetUrl The URL to redirect to.
 * @param keepQueries Whether to keep the queries currently in the URL or not.
 */
export function useRouteHandler(targetUrl: string, keepQueries: boolean = true) {
  const router = useRouter();

  let path = targetUrl;

  if (keepQueries) {
    path += window.location.search;
  }

  router.push(path);
}