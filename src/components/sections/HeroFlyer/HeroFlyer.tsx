import { motion } from "framer-motion";
import { ReservarPopup } from "../ReservarPopup";
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

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="lg:col-span-5 h-full flex flex-col items-center justify-center"
            style={{ willChange: "auto" }}
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
          </motion.div>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            style={{ willChange: "auto" }}
          >
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
          </motion.div>

          <div className="text-center px-2">
            <FlyerControls onReservar={openReservar} />
          </div>
        </div>

      </div>

      <ReservarPopup isOpen={showReservar} onClose={closeReservar} />
    </section>
  );
};