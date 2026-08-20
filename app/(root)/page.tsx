import Image from "next/image";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default function Home() {
  return (
    <section>
      <h1>welcome to my deck editor</h1>
      <p>to use the application yo will need to connect it to a mongoDB database.</p>
    </section>
  );
}
