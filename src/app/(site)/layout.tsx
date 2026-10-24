import { getSite } from "@/lib/site";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  return (
    <>
      <Header site={site} />
      <main>{children}</main>
      <Footer site={site} />
    </>
  );
}
