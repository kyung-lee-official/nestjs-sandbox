import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";
import { locales } from "@/i18n/routing";

/* https://nextjs.org/docs/app/api-reference/functions/generate-static-params */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: any): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "HomePage" });

  return {
    metadataBase: new URL("https://manual.chitubox.com"),
    icons: {
      icon: "/logo.png",
    },
    title: {
      template: `%s | ${t("title")}`,
      default: t("title"),
    },
    description: t("description"),
    openGraph: {
      title: {
        template: `%s | ${t("title")}`,
        default: t("title"),
      },
      description: t("description"),
      images: "https://manual.chitubox.com/images/docs/og_logo.png",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  setRequestLocale("en-US");

  const messages = useMessages();

  return (
    <html lang="en-US">
      <body className="font-[NotoSansCJKsc-Regular]">
        <NextIntlClientProvider messages={messages}>
          <div id="root-portal"></div>
          <Header />
          <main
            className="flex min-h-svh
			text-neutral-900 dark:text-neutral-200
			dark:bg-black"
          >
            <div className="w-full min-w-0 max-w-[900px] p-4 mx-auto">
              {children}
            </div>
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
