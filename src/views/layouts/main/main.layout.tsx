import type { Child } from "hono/jsx";
import { Style } from "hono/css";
import { html } from "hono/html";

type Props = {
  children: Child;
};
export function MainLayout({ children }: Props) {
  return (
    <>
      {html`<!doctype html>`}
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Simple File Uploader</title>
          <script
            src="https://unpkg.com/htmx.org@1.9.10"
            integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC"
            crossorigin="anonymous"
          />
          <link href="/public/styles/tw.ignore.css" rel="stylesheet" />
          <Style />
        </head>
        <body id="app">{children}</body>
      </html>
    </>
  );
}
