import { ComponentType } from "react";

import { QueryKey, UseInfiniteQueryOptions } from "@tanstack/react-query";

import { useViewItems } from "./_hooks/use-view-items";

export interface ObjectWithId {
   id: string;
}

export type TListItemComponent<T> = ComponentType<{
   data: T;
   useTrackViewing: (id: string) => (node?: Element | null) => void;
}>;

export type TViewItemsFn = (ids: string[]) => Promise<void>;

export type TQueryOptions<T> = UseInfiniteQueryOptions<
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   any,
   Error,
   { items: Array<T>; count: number },
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   any,
   QueryKey,
   string | null
>;

export type TUseTrackViewing = ReturnType<typeof useViewItems>["useTrackViewing"];
