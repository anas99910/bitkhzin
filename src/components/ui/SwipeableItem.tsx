import React, { ReactNode } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { Trash2, CheckCircle, Archive } from 'lucide-react';

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
    threshold = 100
}) => {
    const controls = useAnimation();

    const handleDragEnd = async (event: any, info: PanInfo) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (onSwipeRight && (offset > threshold || velocity > 500)) {
            await controls.start({ x: 500, opacity: 0 });
            onSwipeRight();
        } else if (onSwipeLeft && (offset < -threshold || velocity < -500)) {
            await controls.start({ x: -500, opacity: 0 });
            onSwipeLeft();
        } else {
            controls.start({ x: 0, opacity: 1 });
        }
    };

    return (
        <div style={{ position: 'relative', overflow: 'hidden', touchAction: 'pan-y' }}> {/* touchAction prevents scroll lock while swiping */}

            {/* Background Actions Layer */}
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 20px',
                borderRadius: 'var(--radius-md)'
            }}>
                {/* Left Action (Swipe Right to reveal) */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    color: '#10b981', fontWeight: 'bold', opacity: onSwipeRight ? 1 : 0
                }}>
                    <CheckCircle size={24} />
                    <span>Complete</span>
                </div>

                {/* Right Action (Swipe Left to reveal) */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    color: '#ef4444', fontWeight: 'bold', opacity: onSwipeLeft ? 1 : 0
                }}>
                    <span>Delete</span>
                    <Trash2 size={24} />
                </div>
            </div>

            {/* Foreground Content Layer */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }} // Elastic snap back
                dragElastic={0.7} // Resistance
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{
                    position: 'relative',
                    zIndex: 10,
                    background: 'var(--glass-bg)', // Needs solid background to cover actions
                    backdropFilter: 'blur(var(--glass-blur))',
                    borderRadius: 'var(--radius-md)',
                    // Ensure touch doesn't select text easily while dragging
                    userSelect: 'none'
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};
