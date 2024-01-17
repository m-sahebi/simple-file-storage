import { MainLayout } from "#src/views/layouts/main/main.layout";
import { fileListCache } from "#src/routes/files.route";

export function HomePage() {
  const fileList = Array.from(fileListCache);

  return (
    <div class={"flex flex-col p-6 prose dark:prose-invert"}>
      <h1>Simple File Storage</h1>
      <form
        class={"rounded-xl border-dashed border-2 p-3 self-start"}
        action="/api/v1/files"
        encType="multipart/form-data"
        method="POST"
      >
        <input type="file" name="files" multiple />
        <input type="submit" class="btn-blue" />
      </form>
      <h2>Files</h2>
      <div class="flex flex-col gap-1 font-mono">
        {fileList.map((f) => (
          <a key={f} href={`/api/v1/files/${f}`}>
            {f}
          </a>
        ))}
      </div>
    </div>
  );
}

HomePage.layout = MainLayout;
