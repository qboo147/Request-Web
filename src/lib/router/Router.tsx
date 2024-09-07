import { RouteObject, useRoutes } from 'react-router-dom';

export type CustomRouteObject = RouteObject & {
  role?: string;
}

export default function Router({ routes }: { routes: CustomRouteObject[] }) {
  return useRoutes([...routes]);
}
