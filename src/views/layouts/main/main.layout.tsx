import { ErrorBoundary, type Child } from "hono/jsx";
import { css, Style } from "hono/css";

const bodyClass = css`
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  margin: 0;
  padding: 24px;
`;

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
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Simple File Uploader</title>
          <Style />
        </head>
        <body class={bodyClass}>
          <main>{children}</main>
        </body>
      </html>
    </ErrorBoundary>
  );
}
