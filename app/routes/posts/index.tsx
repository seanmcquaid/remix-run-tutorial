import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getPosts } from "~/models/post.server";
import { useOptionalAdminUser, useOptionalUser } from "~/utils";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
};

export const loader: LoaderFunction = async () => {
  const posts = await getPosts();
  return json<LoaderData>({ posts });
};

export default function PostsRoute() {
  const { posts } = useLoaderData() as unknown as LoaderData;
  const adminUser = useOptionalAdminUser();
  return (
    <main>
      <h1>Posts</h1>
      {adminUser ? <Link to="admin">Admin</Link> : null}
      {posts.map((post) => (
        <li key={post.slug}>
          <Link to={post.slug} prefetch="intent">
            {post.title}
          </Link>
        </li>
      ))}
    </main>
  );
}
