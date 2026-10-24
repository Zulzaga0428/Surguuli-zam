import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSite } from "@/lib/site";
import { SchoolPageBody } from "@/components/school-page-body";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const school = (await getSite()).schools.find((x) => x.slug === slug);
  return school ? { title: school.name, description: school.tagline } : {};
}

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getSite();
  if (!site.schools.some((s) => s.slug === slug)) notFound();
  return <SchoolPageBody slug={slug} />;
}
