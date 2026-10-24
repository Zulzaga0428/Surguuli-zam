import { redirect } from "next/navigation";
import { getSite } from "@/lib/site";

export default async function About() {
  const site = await getSite();
  redirect(site.school ? "/#tuhai" : "/surguuli");
}
