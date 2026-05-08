"use client";

import { useRouter } from "next/navigation";

interface Props {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export default function NavCardLink({ href, className, style, children }: Props) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    if (!("startViewTransition" in document)) return;
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (document as any).startViewTransition(() => router.push(href));
  }

  return (
    <a href={href} onClick={handleClick} className={className} style={style}>
      {children}
    </a>
  );
}
