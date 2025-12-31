import React, { ReactNode } from 'react';
import { motion, PanInfo, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { Trash2, CheckCircle } from 'lucide-react';

interface SwipeableItemProps {
    children: ReactNode;
    onSwipeLeft?: () => void; // Usually Delete
    onSwipeRight?: () => void; // Usually Complete or Archive
    threshold?: number;
}

export const SwipeableItem: React.FC<SwipeableItemProps> = ({
    children,
    onSwipeLeft,
    onSwipeRight,
    threshold = 80 // Reduced threshold for easier deletion
}) => {
    const controls = useAnimation();
    const x = useMotionValue(0);

    // Transform background opacity: hidden at 0, rapidly fades in as you drag
    const bgOpacity = useTransform(x, [-50, 0, 50], [1, 0, 1]);

    // Transform color/icon visibility for Left vs Right
    const leftActionOpacity = useTransform(x, [0, 50], [0, 1]);
    const rightActionOpacity = useTransform(x, [-50, 0], [1, 0]);

    const handleDragEnd = async (_: any, info: PanInfo) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (onSwipeRight && (offset > threshold || velocity > 400)) {
            await controls.start({ x: 500, opacity: 0 });
            onSwipeRight();
        } else if (onSwipeLeft && (offset < -threshold || velocity < -400)) {
            await controls.start({ x: -500, opacity: 0 });
            onSwipeLeft();
        } else {
            controls.start({ x: 0, opacity: 1 });
        }
    };

    return (
        <div style={{ position: 'relative', overflow: 'hidden', touchAction: 'pan-y' }}>

            {/* Background Actions Layer - Controlled by bgOpacity */}
            <motion.div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)', // solid background
                opacity: bgOpacity
            }}>
                {/* Left Action (Swipe Right to reveal) - Complete */}
                <motion.div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    color: '#10b981', fontWeight: 'bold',
                    opacity: leftActionOpacity
                }}>
                    <CheckCircle size={24} />
                    <span>Complete</span>
                </motion.div>

                {/* Right Action (Swipe Left to reveal) - Delete */}
                <motion.div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    color: '#ef4444', fontWeight: 'bold',
                    opacity: rightActionOpacity
                }}>
                    <span>Delete</span>
                    <Trash2 size={24} />
                </motion.div>
            </motion.div>

            {/* Foreground Content Layer */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{
                    x, // Link motion value
                    position: 'relative',
                    zIndex: 10,
                    // Use a more opaque background to prevent bleed-through
                    // 'var(--color-surface)' is solid, 'var(--glass-bg)' is transparent
                    // We need solid here, or at least very blurry/sem-opaque.
                    // Given the design, let's use the surface light color which is common for cards.
                    background: 'var(--color-surface-light)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 'var(--radius-md)',
                    userSelect: 'none'
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};
