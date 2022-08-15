import { json } from "@remix-run/node";
import { marked } from "marked";
import type { LoaderFunction } from "@remix-run/node";
import { getPost } from "~/models/post.server";
import { useCatch, useLoaderData, useParams } from "@remix-run/react";
import invariant from "tiny-invariant";

type LoaderData = {
  title: string;
  html: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  invariant(slug, "slug is required");
  const post = await getPost(slug);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  const html = marked(post.markdown);
  return json<LoaderData>({ title: post.title, html });
};

export default function PostRoute() {
  const { title, html } = useLoaderData() as LoaderData;
  return (
    <main>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}

export function CatchBoundary() {
  const error = useCatch();
  const params = useParams();
  if (error.status === 404) {
    return <div>Uh oh! This post with slug {params.slug} doesn't exist</div>;
  }
  throw new Error(`Unsupported thrown response status code`);
}
