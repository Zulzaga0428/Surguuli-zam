import { getSite } from "@/lib/site";
import { listDocs, listPosts, listStaff, upcomingEvents } from "@/lib/queries";
import { SchoolView } from "./school-view";

export async function SchoolPageBody({ slug }: { slug: string }) {
  const site = await getSite();
  const school = site.schools.find((s) => s.slug === slug);
  if (!school) return null;
  const [posts, events, staff, docs] = await Promise.all([
    listPosts(site, { schoolId: school.id, limit: 6 }),
    upcomingEvents(site, { schoolId: school.id, limit: 8 }),
    listStaff(site, school.id),
    listDocs(site, school.id),
  ]);
  return <SchoolView site={site} school={school} posts={posts} events={events} staff={staff.map((r) => r.s)} docs={docs.slice(0, 5)} />;
}
