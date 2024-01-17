import { ErrorBoundary, type Child } from "hono/jsx";
import { Style } from "hono/css";
import { html } from "hono/html";

type Props = {
  children: Child;
};
export function MainLayout({ children }: Props) {
  return (
    <ErrorBoundary
      fallback={
        <div style={{ fontFamily: "sans-serif" }}>
          Something broke <button onClick={"window.location.reload()"}>Reload</button>
        </div>
      }
    >
      {html`<!doctype html>`}
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Simple File Uploader</title>
          <link href="/public/styles/tw.ignore.css" rel="stylesheet" />
          <Style />
        </head>
        <body id="app">{children}</body>
      </html>
    </ErrorBoundary>
  );
}
