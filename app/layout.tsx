import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider"

export const metadata: Metadata = {
  title: "Next App + Chakra UI",
  description: "Next App 15 + Chakra UI 3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          <Provider>
            {children}
          </Provider>
      </body>
    </html>
  );
  }
