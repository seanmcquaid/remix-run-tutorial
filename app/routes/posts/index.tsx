import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getPosts } from "~/models/post.server";

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
};

export const loader: LoaderFunction = async () => {
  const posts = await getPosts();
  return json<LoaderData>({ posts });
};

export default function PostsRoute() {
  const { posts } = useLoaderData() as unknown as LoaderData;
  return (
    <main>
      <h1>Posts</h1>
      <Link to="admin">Admin</Link>
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
