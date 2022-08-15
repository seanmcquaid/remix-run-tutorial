import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getPostListings } from "~/models/post.server";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireAdminUser } from "~/session.server";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPostListings>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminUser(request);
  return json<LoaderData>({ posts: await getPostListings() });
};

export default function AdminRoute() {
  const { posts } = useLoaderData() as unknown as LoaderData;
  return (
    <main>
      <h1>Posts</h1>
      <Link to="admin">Admin</Link>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link to={post.slug}>{post.title}</Link>
        </li>
      ))}
      <div>
        <Outlet />
      </div>
    </main>
  );
}
