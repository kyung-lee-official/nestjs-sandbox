import type { ReactNode } from "react";

export const Table = (props: { children: ReactNode }) => {
  const { children } = props;
  return (
    <table
      className="w-full
			text-sm text-white/50"
    >
      {children}
    </table>
  );
};

export const Thead = (props: { children: ReactNode }) => {
  const { children } = props;
  return (
    <thead
      className="[&_>_tr_>_th]:sticky [&_>_tr_>_th]:top-0 
			[&_>_tr_>_th]:py-3 [&_>_tr_>_th]:px-6
			[&_>_tr_>_th]:text-left font-semibold
			[&_>_tr_>_th]:border-[1px] [&_>_tr_>_th]:border-white
			[&_>_tr_>_th]:shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.5)]"
    >
      {children}
    </thead>
  );
};

export const Tbody = (props: { children: ReactNode }) => {
  const { children } = props;
  return (
    <tbody
      className="[&_>_tr_>_td]:py-3 [&_>_tr_>_td]:px-6
			[&_>_tr_>_td]:border-t-[1px] [&_>_tr_>_td]:border-white/10
			[&_>_tr]:hover:bg-white/5"
    >
      {children}
    </tbody>
  );
};
