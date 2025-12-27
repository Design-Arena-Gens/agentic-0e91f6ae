export const metadata = {
  title: "English ⇄ Myanmar Language Learner",
  description: "Learn Myanmar language with audio pronunciation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
