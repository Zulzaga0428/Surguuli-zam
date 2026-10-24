import { getSite } from "@/lib/site";
import { listPosts, upcomingEvents } from "@/lib/queries";
import { Hub } from "@/components/hub";
import { SchoolPageBody } from "@/components/school-page-body";

export const dynamic = "force-dynamic";

export default async function Home() {
  const site = await getSite();
  if (site.school) return <SchoolPageBody slug={site.school.slug} />;
  const [posts, events] = await Promise.all([listPosts(site, { limit: 12 }), upcomingEvents(site, { limit: 8 })]);
  return <Hub site={site} posts={posts} events={events} />;
}
