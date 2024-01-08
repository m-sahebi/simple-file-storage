import { css } from "hono/css";
import { MainLayout } from "#src/views/layouts/main/main.layout";
import { fileListCache } from "#src/routes/files.route";

const fileListClass = css`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: monospace;
`;

export function HomePage() {
  const fileList = Array.from(fileListCache);

  return (
    <>
      <h1>Simple File Storage</h1>
      <form action="/api/files" encType="multipart/form-data" method="POST">
        <input type="file" id="files" name="files" />
        <input type="submit" />
      </form>
      <h2>Files</h2>
      <div class={fileListClass}>
        {fileList.map((f) => (
          <a key={f} href={`/api/files/${f}`}>
            {f}
          </a>
        ))}
      </div>
    </>
  );
}

HomePage.layout = MainLayout;
