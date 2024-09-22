"use client"
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
import { loadSlim } from "@tsparticles/slim";
import { useThemeContext } from "@/providers/ThemeProvider";

const ParticlesBackground = (props: any) => {
  const { theme } = useThemeContext();
  const [init, setInit] = useState(false);
  const [particlesOptions, setParticlesOptions] = useState(null);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  useEffect(() => {
    if (!init) return;

    const newOptions = {
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "repulse",
          },
          onHover: {
            enable: true,
            mode: 'grab',
          },
        },
        modes: {
          push: {
            distance: 200,
            duration: 15,
          },
          grab: {
            distance: 150,
          },
        },
      },
      particles: {
        color: {
          value: theme === "dark" ? "#FFFFFF" : "#F53939",
        },
        links: {
          color: theme === "dark" ? "#FFFFFF" : "#F53939",
          distance: 150,
          enable: true,
          opacity: 0.3,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 150,
        },
        opacity: {
          value: 1.0,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    };
    //@ts-ignore
    setParticlesOptions(newOptions);
  }, [init, theme]);

  const particlesLoaded = (container: any) => {
  };

  return (
    <div className="z-[-2]">
      {init && particlesOptions && (
        //@ts-ignore
        <Particles id={props.id} init={particlesLoaded} options={particlesOptions} />
      )}
    </div>
  );
};

export default ParticlesBackground;