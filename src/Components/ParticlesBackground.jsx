import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesBackground = ({ backgroundColor = "white", particleCount = 100 }) => {
    // Initialize particles engine
    const particlesInit = useCallback(async (engine) => {
        try {
            await loadFull(engine);
        } catch (error) {
            console.error("Error initializing particles:", error);
        }
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                background: { color: backgroundColor },
                particles: {
                    number: { value: particleCount },
                    move: { enable: true, speed: 6, direction: "none", straight: false },
                    shape: { type: "circle" },
                    opacity: { value: 0.7 },
                    size: { value: 1 },
                    links: {
                        enable: true,
                        color: "#052880",
                        distance: 150,
                        opacity: 0.8,
                        width: 1,
                    },
                },
            }}
        />
    );
};

export default ParticlesBackground;
