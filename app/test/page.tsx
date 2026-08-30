import { supabase } from "../../lib/supabase";

export default async function TestPage() {
  const { data, error } = await supabase
    .from("posts")
    .select("*");

  return (
    <div
      style={{
        padding: 40,
        fontFamily: "system-ui",
      }}
    >
      <h1>DOMIHOOD 数据库测试</h1>

      <pre>
        {JSON.stringify(
          {
            data,
            error,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}