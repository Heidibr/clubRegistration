import Form from "./form/Form";

function getClubId(): string {
  const fromUrl = new URLSearchParams(globalThis.location.search).get("clubId");
  return fromUrl ?? import.meta.env.VITE_CLUB_ID ?? "britsport";
}

export default function Main() {
  return (
    <main className="min-h-screen w-full bg-cream">
      <Form clubId={getClubId()} />
    </main>
  );
}
