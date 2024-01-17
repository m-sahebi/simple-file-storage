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
        enctype="multipart/form-data"
        method="POST"
      >
        <input type="file" name="files" multiple="true" />
        <input type="submit" class="btn" />
      </form>
      <h2>Files</h2>
      <div class="flex flex-col gap-1 font-mono">
        {fileList.map((f) => {
          const divId = f.replace(".", "-");
          return (
            <div key={divId} id={divId} class="flex gap-2 items-end">
              <a href={`/api/v1/files/${f}`}>{f}</a>
              <button
                class="btn bg-red-500 text-white"
                hx-delete={`/api/v1/files/${f}`}
                hx-target={"closest div"}
                hx-swap={"delete"}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

HomePage.layout = MainLayout;
