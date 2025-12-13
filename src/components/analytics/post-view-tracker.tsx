"use client";

import { useEffect } from "react";
import { trackViewItem } from "@/lib/analytics";

type PostViewTrackerProps = {
  postId: number;
  title: string;
  propertyType?: string;
  price: number;
};

/**
 * Client component to track post view event
 * Place this in server-rendered post detail page
 */
export function PostViewTracker({
  postId,
  title,
  propertyType,
  price,
}: PostViewTrackerProps) {
  useEffect(() => {
    trackViewItem({
      itemId: postId,
      itemName: title,
      propertyType,
      price,
    });
  }, [postId, title, propertyType, price]);

  // This component renders nothing
  return null;
}
