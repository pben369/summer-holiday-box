import { useEffect } from 'react';

const useSpatialNavigation = () => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isNavKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key);
            if (!isNavKey) return;

            const focusableElements = Array.from(document.querySelectorAll('.focusable:not([disabled])'));
            if (focusableElements.length === 0) return;

            const currentFocused = document.activeElement;
            const isFocused = focusableElements.includes(currentFocused);

            // Initialize focus
            if (!isFocused && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                focusableElements[0].focus();
                e.preventDefault();
                return;
            }

            // Enter action
            if (e.key === 'Enter') {
                if (isFocused) currentFocused.click();
                e.preventDefault();
                return;
            }

            // Spatial calculation
            const currentRect = currentFocused.getBoundingClientRect();
            const currentCenter = {
                x: currentRect.left + currentRect.width / 2,
                y: currentRect.top + currentRect.height / 2
            };

            let bestCandidate = null;
            let minDistance = Infinity;

            focusableElements.forEach((el) => {
                if (el === currentFocused) return;

                const rect = el.getBoundingClientRect();
                const center = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                };

                let isValidDirection = false;

                // Ensure there is some strict directional movement to prevent jumping everywhere
                if (e.key === 'ArrowUp' && center.y < currentCenter.y) isValidDirection = true;
                if (e.key === 'ArrowDown' && center.y > currentCenter.y) isValidDirection = true;
                if (e.key === 'ArrowLeft' && center.x < currentCenter.x) isValidDirection = true;
                if (e.key === 'ArrowRight' && center.x > currentCenter.x) isValidDirection = true;

                if (isValidDirection) {
                    // Calculate euclidean distance
                    const distance = Math.pow(center.x - currentCenter.x, 2) + Math.pow(center.y - currentCenter.y, 2);

                    // Apply a penalty to perpendicular distance to favor straight lines
                    let penalty = 0;
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        penalty = Math.abs(center.x - currentCenter.x) * 2;
                    } else {
                        penalty = Math.abs(center.y - currentCenter.y) * 2;
                    }

                    const weightedDistance = distance + penalty * penalty;

                    if (weightedDistance < minDistance) {
                        minDistance = weightedDistance;
                        bestCandidate = el;
                    }
                }
            });

            if (bestCandidate) {
                bestCandidate.focus();
                bestCandidate.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Auto-focus first element slightly after mount
        setTimeout(() => {
            const firstFocusable = document.querySelector('.focusable');
            if (firstFocusable && document.activeElement === document.body) {
                firstFocusable.focus();
            }
        }, 500);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
};

export default useSpatialNavigation;
