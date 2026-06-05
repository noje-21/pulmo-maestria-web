import { useCallback, useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsIOS } from "@/hooks/useIsIOS";
import { useDeferredMount } from "@/hooks/useDeferredMount";
import { flyerVideos, ROTATION_INTERVAL, PRELOAD_AHEAD, shouldSkipPreload } from "./types";

/**
 * Drives the HeroFlyer carousel: rotation timer, preloading of the next
 * clip, hover-pause behavior, deferred mount of the heavy video on
 * mobile/iOS, and "reservar" popup state.
 */
export function useFlyer() {
  const [idx, setIdx] = useState(0);
  const preloadedSet = useRef<Set<number>>(new Set([0]));
  const hoveringRef = useRef(false);
  const isMobile = useIsMobile();
  const isIOSDevice = useIsIOS();
  // Defer the heavy <VideoPlayer> on mobile/iOS so the first paint contains
  // only the static poster, navbar, headline and CTA. Desktop mounts immediately.
  const deferred = useDeferredMount(700);
  const heavyReady = !isMobile && !isIOSDevice ? true : deferred;

  const currentVideo = flyerVideos[idx];

  const [showReservar, setShowReservar] = useState(false);
  const openReservar = useCallback(() => setShowReservar(true), []);
  const closeReservar = useCallback(() => setShowReservar(false), []);

  const goTo = useCallback((i: number) => setIdx(i), []);

  const handleHoverStart = useCallback(() => {
    hoveringRef.current = true;
  }, []);
  const handleHoverEnd = useCallback(() => {
    hoveringRef.current = false;
  }, []);

  useEffect(() => {
    const next = (idx + 1) % flyerVideos.length;

    const preloadTimer = setTimeout(() => {
      if (!preloadedSet.current.has(next) && !shouldSkipPreload()) {
        preloadedSet.current.add(next);
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "video";
        link.setAttribute("crossorigin", "anonymous");
        link.href = isMobile ? flyerVideos[next].srcMobile : flyerVideos[next].srcDesktop;
        document.head.appendChild(link);
      }
    }, ROTATION_INTERVAL - PRELOAD_AHEAD);

    const rotateTimer = setTimeout(() => {
      if (!hoveringRef.current) {
        setIdx((prev) => (prev + 1) % flyerVideos.length);
      }
    }, ROTATION_INTERVAL);

    return () => {
      clearTimeout(preloadTimer);
      clearTimeout(rotateTimer);
    };
  }, [idx, isMobile]);

  return {
    idx,
    currentVideo,
    isMobile,
    isIOSDevice,
    heavyReady,
    showReservar,
    openReservar,
    closeReservar,
    goTo,
    handleHoverStart,
    handleHoverEnd,
    total: flyerVideos.length,
  };
}