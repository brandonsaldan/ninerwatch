import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const SkeletonBox = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-500/5 to-gray-500/10 ${className}`}
  />
);

export default function IncidentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden bg-gradient-to-r from-gray-500/5 to-gray-500/10 p-6 backdrop-blur-sm shadow-md">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <SkeletonBox className="flex-shrink-0 h-24 w-24 rounded-xl" />
          <div className="flex-grow space-y-2">
            <div className="flex items-center gap-3">
              <SkeletonBox className="px-6 py-2 rounded-full w-24 h-6" />
              <SkeletonBox className="px-6 py-2 rounded-full w-20 h-6" />
            </div>
            <SkeletonBox className="h-8 w-2/3 rounded" />
            <SkeletonBox className="h-4 w-1/2 rounded" />
            <SkeletonBox className="pt-2 h-16 w-full rounded" />
          </div>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="flex">
          <SkeletonBox className="px-4 py-2 w-40 h-10 rounded-md" />
          <SkeletonBox className="px-4 py-2 w-40 h-10 rounded-md ml-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <SkeletonBox className="h-[400px] w-full" />
          </Card>
          <Card>
            <CardHeader>
              <SkeletonBox className="h-6 w-48 rounded" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <SkeletonBox className="h-4 w-32" />
                    <SkeletonBox className="h-6 w-40" />
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-border space-y-2">
                <SkeletonBox className="h-4 w-32" />
                <SkeletonBox className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <SkeletonBox className="h-6 w-48 rounded" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <SkeletonBox className="h-10 w-10 rounded-full" />
                <div>
                  <SkeletonBox className="h-4 w-32" />
                  <SkeletonBox className="h-3 w-24" />
                </div>
              </div>
              <SkeletonBox className="h-16 w-full rounded" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <SkeletonBox className="h-6 w-48 rounded" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <SkeletonBox className="h-4 w-32" />
                  <SkeletonBox className="h-6 w-48" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
