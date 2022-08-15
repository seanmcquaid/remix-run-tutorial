import { Form, useActionData, useTransition } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { createPost } from "~/models/post.server";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";

type ActionData =
  | { title: null | string; slug?: null | string; markdown?: null | string }
  | undefined;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");

  const errors = {
    title: title ? null : "Title is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);

  if (hasErrors) {
    return json<ActionData>(errors);
  }

  invariant(typeof title === "string", "Title must be a string");

  await createPost({ title, markdown: "HELLLLO", slug: "new-post" });

  return redirect("/posts/admin");
};

export default function NewPostRoute() {
  const errors = useActionData() as ActionData;
  const transition = useTransition();
  const isCreating = Boolean(transition.submission);

  return (
    <Form method="post">
      <p>
        <label>
          Post Title: {errors?.title ? <em>{errors.title}</em> : null}
          <input type="text" name="title" />
        </label>
      </p>
      <button type="submit" disabled={isCreating}>
        {isCreating ? "Creating..." : "Add Post"}
      </button>
    </Form>
  );
}
