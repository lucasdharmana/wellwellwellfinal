// Character Animation Script - Jump from Logo with Correct Positioning
// Positioning based on original working code, animation jumps from speech bubble

(function() {
    'use strict';

    const characterImages = {
        jew: 'images/wellwell12347_jew.png',
        africa: 'images/wellwell12347_africa.png'
    };

    const config = {
        initialDelay: 1500,
        sequenceDelay: 600,
        animationDuration: 1200,
        characterSize: 300,           // Same as original
        mobileScale: 0.4,             // Same as original
        scales: {
            jew: 0.85,                // PDF fix: scale down to match Africa's height
            africa: 1.0
        },
        positions: {
            jew: 0.15,                // PDF fix: further apart (was 0.30)
            africa: 0.85              // PDF fix: further apart (was 0.70)
        },
        heightOffset: 0.55            // PDF fix: higher position (was 0.85, lower = higher)
    };

    function createCharacter(imagePath, characterType, delay) {
        setTimeout(() => {
            const divider = document.querySelector('.section-divider');
            const logo = document.querySelector('.speech-bubble');
            
            if (!divider || !logo) {
                console.error('Required elements not found');
                return;
            }

            const dividerRect = divider.getBoundingClientRect();
            const logoRect = logo.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const isMobile = screenWidth < 768;
            
            // Calculate sizes (same logic as original)
            const baseSize = isMobile ? config.characterSize * config.mobileScale : config.characterSize;
            const finalSize = baseSize * (config.scales[characterType] || 1.0);
            const startSize = 5;

            // START position: emerge from bubble edges (PDF fix)
            const bubbleEdgeOffset = logoRect.width * 0.35;
            const startX = characterType === 'jew' 
                ? logoRect.left + (logoRect.width / 2) - bubbleEdgeOffset
                : logoRect.left + (logoRect.width / 2) + bubbleEdgeOffset;
            const startY = logoRect.top + (logoRect.height * 0.65);

            // END position: use original positioning logic exactly
            const finalX = screenWidth * config.positions[characterType];
            const finalY = dividerRect.top + window.pageYOffset - (finalSize * config.heightOffset);
            
            const wrapper = document.createElement('div');
            wrapper.className = `character-wrapper wrapper-${characterType}`;
            wrapper.style.cssText = `
                position: absolute;
                left: ${startX}px;
                top: ${startY + window.pageYOffset}px;
                width: ${startSize}px;
                height: ${startSize}px;
                transform: translate(-50%, -50%);
                z-index: 5;
                opacity: 0;
                pointer-events: none;
            `;

            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = characterType;
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: contain;
            `;

            wrapper.appendChild(img);
            document.body.appendChild(wrapper);

            img.onload = () => {
                // Fade in
                setTimeout(() => {
                    wrapper.style.transition = 'opacity 150ms ease-out';
                    wrapper.style.opacity = '1';
                }, 50);

                // Animate to final position
                setTimeout(() => {
                    wrapper.style.zIndex = '45';  // PDF fix: under nav (z-index 100)
                    wrapper.style.transition = `
                        left ${config.animationDuration}ms cubic-bezier(0.34, 1.2, 0.64, 1),
                        top ${config.animationDuration}ms cubic-bezier(0.34, 1.2, 0.64, 1),
                        width ${config.animationDuration}ms cubic-bezier(0.22, 1, 0.36, 1),
                        height ${config.animationDuration}ms cubic-bezier(0.22, 1, 0.36, 1)
                    `;
                    
                    wrapper.style.left = finalX + 'px';
                    wrapper.style.top = finalY + 'px';
                    wrapper.style.width = finalSize + 'px';
                    wrapper.style.height = finalSize + 'px';
                }, 200);

                // After animation completes
                setTimeout(() => {
                    wrapper.style.pointerEvents = 'auto';
                    wrapper.style.animation = 'characterBreathe 3s ease-in-out infinite';
                }, config.animationDuration + 300);
            };
        }, delay);
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes characterBreathe {
                0%, 100% { transform: translate(-50%, -50%) scale(1); }
                50% { transform: translate(-50%, -50%) scale(1.02); }
            }
        `;
        document.head.appendChild(style);
    }

    function startSequence() {
        injectStyles();
        createCharacter(characterImages.jew, 'jew', config.initialDelay);
        createCharacter(characterImages.africa, 'africa', config.initialDelay + config.sequenceDelay);
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startSequence);
        } else {
            startSequence();
        }
    }

    init();

    // Testing API
    window.CharacterAnimation = {
        config: config,
        restart: function() {
            document.querySelectorAll('.character-wrapper').forEach(el => el.remove());
            startSequence();
        },
        setHeightOffset: function(offset) {
            config.heightOffset = offset;
            this.restart();
        },
        setPositions: function(jewPos, africaPos) {
            config.positions.jew = jewPos;
            config.positions.africa = africaPos;
            this.restart();
        }
    };

})();
