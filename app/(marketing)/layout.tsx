import { Footer } from "@/components/footer";
import Header from "@/components/header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header>
        <Header />
      </header>
      <div className="grid min-h-[calc(100dvh-4rem-3rem)]">{children}</div>
      <Footer />
    </>
  );
}
