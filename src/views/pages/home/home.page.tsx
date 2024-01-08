import { MainLayout } from "#src/views/layouts/main/main.layout";

export function HomePage() {
  return (
    <>
      <h1>Simple File Storage</h1>
      <form action="/api/files" encType="multipart/form-data" method="POST" target="dummyframe">
        <iframe name="dummyframe" id="dummyframe" style="display: none;" />
        <input type="file" id="files" name="files" />
        <input type="submit" />
      </form>
    </>
  );
}

HomePage.layout = MainLayout;
