"use client";

import { MarkerProps } from "./marker";
import Marker from "./marker";
import IconMarker from "@/components/icons/icon-marker";

export default function MarkerDefault(props: Omit<MarkerProps, "element">) {
  return <Marker {...props} element={<IconMarker />} />;
}
