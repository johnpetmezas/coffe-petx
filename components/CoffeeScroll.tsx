'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useScroll, useSpring, useTransform, motion } from 'framer-motion';

const FRAME_COUNT = 81; // 0 to 80
const IMAGES_DIR = '/coffee-sequence/';
const IMAGE_NAME_PREFIX = 'frame_';
const IMAGE_EXT = '.jpg';

export default function CoffeeScroll() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);

    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Fix: Move hook call out of conditional block to avoid React hook violation
    const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

    // Preload Images
    useEffect(() => {
        const loadImages = async () => {
            const loaded: HTMLImageElement[] = [];
            let loadedCount = 0;

            const promises = Array.from({ length: FRAME_COUNT }).map((_, i) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    img.src = `${IMAGES_DIR}${IMAGE_NAME_PREFIX}${i}${IMAGE_EXT}`;
                    img.onload = () => {
                        loaded[i] = img;
                        loadedCount++;
                        setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load frame_${i}`);
                        // Resolve anyway to avoid blocking
                        loaded[i] = new Image(); // Empty placeholder
                        resolve();
                    };
                });
            });

            await Promise.all(promises);
            // Filter empty slots if any failed badly, but indices matter.
            // We assume loaded array is sparse but filled at indices.

            setImages(loaded);
            setIsLoading(false);
        };

        loadImages();
    }, []);

    const render = useCallback((val: number) => {
        if (!canvasRef.current || images.length === 0) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        let frameIndex = Math.floor(val * (FRAME_COUNT - 1));
        if (frameIndex < 0) frameIndex = 0;
        if (frameIndex >= FRAME_COUNT) frameIndex = FRAME_COUNT - 1;

        const img = images[frameIndex];
        // Check if image is valid
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const canvas = canvasRef.current;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgWidth = img.width;
        const imgHeight = img.height;

        // Object-fit: cover logic
        const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
        const centerShift_x = (canvasWidth - imgWidth * ratio) / 2;
        const centerShift_y = (canvasHeight - imgHeight * ratio) / 2;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(
            img,
            0, 0, imgWidth, imgHeight,
            centerShift_x, centerShift_y, imgWidth * ratio, imgHeight * ratio
        );
    }, [images]);

    // Animation Loop / Scroll Listener
    useEffect(() => {
        if (isLoading) return;

        // Initial render
        render(smoothProgress.get());

        const unsubscribe = smoothProgress.on("change", (latest) => {
            render(latest); // requestAnimationFrame(render) might be better but direct is responsive enough
        });

        return () => unsubscribe();
    }, [isLoading, smoothProgress, render]);

    // Resize Handler
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                render(smoothProgress.get());
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [render, smoothProgress]);

    return (
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
            <canvas
                ref={canvasRef}
                className="block h-full w-full object-cover"
            />

            {isLoading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-[#ECE0D1]">
                    <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-[#333] border-t-[#D4A373]" />
                    <p className="font-mono text-sm tracking-[0.2em] animate-pulse">
                        FUCK YOU COFFEE... {loadProgress}%
                    </p>
                </div>
            )}

            {!isLoading && (
                <motion.div
                    style={{ opacity: hintOpacity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#ECE0D1]/50 text-xs font-mono tracking-[0.2em]"
                >
                    SCROLL TO EXTRACT
                </motion.div>
            )}
        </div>
    );
}
