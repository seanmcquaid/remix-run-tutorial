import { Link } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { requireAdminUser } from "~/session.server";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUser(request);
  return json({});
};

export default function AdminIndexRoute() {
  return <Link to="new">Create new post</Link>;
}
