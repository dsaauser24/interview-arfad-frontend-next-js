import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession({ secret: process.env.NEXT_SECRET });
  if (session?.user) redirect("/");
  return <>{children}</>;
}
