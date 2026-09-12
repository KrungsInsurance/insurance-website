import type { AnchorHTMLAttributes, ReactNode } from "react";
type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string; children: ReactNode; prefetch?: boolean };
export default function NativeLink({ href, children, prefetch: _prefetch, ...props }: Props) { void _prefetch; return <a href={href} {...props}>{children}</a>; }
