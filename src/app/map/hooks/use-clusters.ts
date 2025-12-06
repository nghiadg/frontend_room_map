"use client";

import Supercluster, { ClusterProperties } from "supercluster";
import { useMemo } from "react";
import { PostMapMarker } from "@/services/client/posts";
import { Coordinates } from "@/types/location";
import { MAP_CONFIG } from "../constants";

// Properties for individual post markers
type PostPointProperties = PostMapMarker & { cluster: false };

// GeoJSON Point feature for individual posts
export type PostPointFeature = GeoJSON.Feature<
  GeoJSON.Point,
  PostPointProperties
>;

// Cluster feature with proper cluster properties
export type ClusterFeature = GeoJSON.Feature<
  GeoJSON.Point,
  ClusterProperties & { cluster: true }
>;

// Combined type for both clusters and individual points
export type ClusterOrPoint = ClusterFeature | PostPointFeature;

// Type guard to check if a feature is a cluster
export function isCluster(item: ClusterOrPoint): item is ClusterFeature {
  return "cluster" in item.properties && item.properties.cluster === true;
}

type UseClustersParams = {
  posts: PostMapMarker[];
  bounds: [Coordinates | null, Coordinates | null];
  zoom: number;
};

type UseClustersResult = {
  clusters: ClusterOrPoint[];
  supercluster: Supercluster<PostPointProperties> | null;
};

/**
 * Hook to cluster posts using supercluster library
 * Automatically clusters nearby markers based on zoom level
 */
export function useClusters({
  posts,
  bounds,
  zoom,
}: UseClustersParams): UseClustersResult {
  // Create supercluster index from posts
  const supercluster = useMemo(() => {
    if (!posts.length) return null;

    try {
      const cluster = new Supercluster<PostPointProperties>({
        radius: MAP_CONFIG.CLUSTER_RADIUS,
        maxZoom: MAP_CONFIG.CLUSTER_MAX_ZOOM,
      });

      // Convert posts to GeoJSON points
      const points: PostPointFeature[] = posts.map((post) => ({
        type: "Feature" as const,
        properties: { ...post, cluster: false as const },
        geometry: {
          type: "Point" as const,
          coordinates: [post.lng, post.lat],
        },
      }));

      cluster.load(points);
      return cluster;
    } catch (error) {
      console.error("Error creating supercluster:", error);
      return null;
    }
  }, [posts]);

  // Get clusters for current viewport
  const clusters = useMemo((): ClusterOrPoint[] => {
    if (!supercluster || !bounds[0] || !bounds[1]) {
      return [];
    }

    try {
      const [ne, sw] = bounds;
      // Supercluster expects [westLng, southLat, eastLng, northLat]
      const bbox: GeoJSON.BBox = [sw.lng, sw.lat, ne.lng, ne.lat];

      return supercluster.getClusters(
        bbox,
        Math.floor(zoom)
      ) as ClusterOrPoint[];
    } catch (error) {
      console.error("Error getting clusters:", error);
      return [];
    }
  }, [supercluster, bounds, zoom]);

  return { clusters, supercluster };
}
