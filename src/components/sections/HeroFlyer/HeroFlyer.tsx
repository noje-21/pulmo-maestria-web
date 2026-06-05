import { lazy, Suspense } from "react";
// Lazy: ReservarPopup pulls in framer-motion. Loading it on demand keeps
// framer-motion out of the landing's critical bundle.
const ReservarPopup = lazy(() =>
  import("../ReservarPopup").then((m) => ({ default: m.ReservarPopup })),
);
import { AmbientGlows, FlyerVideo, FlyerPoster } from "./FlyerVideo";
import { FlyerControls } from "./FlyerControls";
import { FlyerIndicators } from "./FlyerIndicators";
import { useFlyer } from "./useFlyer";

/* ─── Main component ─── */
export const HeroFlyer = () => {
  const {
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
    total,
  } = useFlyer();

  return (
    <section
      id="hero-flyer"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(229,80%,8%)] via-[hsl(229,60%,12%)] to-[hsl(229,50%,6%)]"
      aria-label="Presentación de la Maestría en Circulación Pulmonar"
      style={{ contain: "layout style" }}
    >
      <AmbientGlows light={isMobile || isIOSDevice} />

      <div className="relative z-10 w-full mx-auto px-2 sm:px-4 lg:px-6 py-8 sm:py-10 lg:py-12">

        {/* Desktop layout */}
        <div className="hidden lg:grid lg:grid-cols-7 lg:gap-8 lg:items-center">
          <div className="lg:col-span-2 lg:pt-8 flex flex-col justify-start">
            <FlyerControls onReservar={openReservar} />
          </div>

          <div
            className="lg:col-span-5 h-full flex flex-col items-center justify-center animate-slide-in-right"
            style={{ animationDelay: "150ms", animationDuration: "500ms" }}
          >
            <FlyerVideo
              currentSrc={currentVideo.srcDesktop}
              poster={currentVideo.poster}
              currentLabel={currentVideo.label}
              isMobile={false}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
            />
            <FlyerIndicators total={total} current={idx} onSelect={goTo} />
          </div>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden flex flex-col gap-6">
          <div className="animate-fade-in-up" style={{ animationDuration: "450ms" }}>
            {heavyReady ? (
              <FlyerVideo
                currentSrc={currentVideo.srcMobile}
                poster={currentVideo.poster}
                currentLabel={currentVideo.label}
                isMobile={true}
                isIOS={isIOSDevice}
              />
            ) : (
              /* Hero-lite placeholder: identical box, just the poster. No
                 <video>, no IntersectionObserver, no Framer Motion children.
                 Mounts in <16 ms so iOS WebKit paints the first frame instantly. */
              <FlyerPoster poster={currentVideo.poster} label={currentVideo.label} />
            )}
            <FlyerIndicators total={total} current={idx} onSelect={goTo} />
          </div>

          <div className="text-center px-2">
            <FlyerControls onReservar={openReservar} />
          </div>
        </div>

      </div>

      {showReservar && (
        <Suspense fallback={null}>
          <ReservarPopup isOpen={showReservar} onClose={closeReservar} />
        </Suspense>
      )}
    </section>
  );
};