// Character Animation Script - Surprise Jump Effect
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
        characterSize: 450,        // Desktop size
        mobileScale: 0.5,          // Mobile 25% bigger (was 0.4)
        positions: {
            jew: 0.30,
            africa: 0.70
        },
        heightOffset: 0.75,        // Position below logo
        enableMobileFixed: true
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
            
            // Size calculations
            // Size calculations
const startSize = 3;
const finalSize = isMobile ? config.characterSize * 0.625 : config.characterSize; // Mobile 25% bigger

// Logo center - where they hide
const logoCenterX = logoRect.left + logoRect.width / 2 + window.pageXOffset;
const logoCenterY = logoRect.top + logoRect.height / 2 + window.pageYOffset;

// Final positions - different for mobile vs desktop
const finalX = screenWidth * config.positions[characterType];
const dividerTop = dividerRect.top + window.pageYOffset;

// Desktop: closer to black line (inside circles), Mobile: current position
const finalY = isMobile 
    ? dividerTop - (finalSize * 0.85)  // Mobile stays where it is
    : dividerTop - (finalSize * 0.35); // Desktop - CHANGE 0.35 to move them up/down
            
            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = `character-wrapper wrapper-${characterType}`;
            wrapper.style.cssText = `
                position: absolute;
                left: ${logoCenterX}px;
                top: ${logoCenterY}px;
                width: ${startSize}px;
                height: ${startSize}px;
                transform: translate(-50%, -50%);
                z-index: 5;
                opacity: 0;
                will-change: transform, left, top, width, height, opacity;
                pointer-events: none;
            `;

            // Create character container
            const character = document.createElement('div');
            character.className = `character character-${characterType}`;
            character.style.cssText = `
                width: 100%;
                height: 100%;
                position: relative;
            `;

            // Create image
            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = characterType;
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
            `;

            character.appendChild(img);
            wrapper.appendChild(character);
            document.body.appendChild(wrapper);

            // Animation starts when image loads
            img.onload = () => {
                // Phase 1: Pop into visibility (still behind logo)
                setTimeout(() => {
                    wrapper.style.transition = 'opacity 150ms ease-out';
                    wrapper.style.opacity = '1';
                }, 50);

                // Phase 2: JUMP OUT - emerge from behind logo at 45° angle
                setTimeout(() => {
                    wrapper.style.zIndex = '51';
                    wrapper.style.transition = `
                        left ${config.animationDuration}ms cubic-bezier(0.34, 1.2, 0.64, 1),
                        top ${config.animationDuration}ms cubic-bezier(0.34, 1.2, 0.64, 1),
                        width ${config.animationDuration}ms cubic-bezier(0.22, 1, 0.36, 1),
                        height ${config.animationDuration}ms cubic-bezier(0.22, 1, 0.36, 1),
                        opacity 200ms ease-out
                    `;
                    
                    // Jump to final position
                    wrapper.style.left = finalX + 'px';
                    wrapper.style.top = finalY + 'px';
                    wrapper.style.width = finalSize + 'px';
                    wrapper.style.height = finalSize + 'px';
                    wrapper.style.opacity = '1';
                }, 200);

                // Phase 3: Lock in place with hover effects
                setTimeout(() => {
                    wrapper.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    wrapper.style.pointerEvents = 'auto';
                    
                    wrapper.addEventListener('mouseenter', () => {
                        wrapper.style.transform = 'translate(-50%, -50%) scale(1.08) translateY(-8px)';
                    });
                    
                    wrapper.addEventListener('mouseleave', () => {
                        wrapper.style.transform = 'translate(-50%, -50%) scale(1)';
                    });
                    
                    wrapper.style.animation = 'characterBreathe 3s ease-in-out infinite';
                }, config.animationDuration + 300);
            };

            img.onerror = () => {
                console.error(`Failed to load character image: ${imagePath}`);
            };

        }, delay);
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes characterBreathe {
                0%, 100% { 
                    transform: translate(-50%, -50%) scale(1);
                }
                50% { 
                    transform: translate(-50%, -50%) scale(1.02);
                }
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

    window.CharacterAnimation = {
        config: config,
        restart: function() {
            document.querySelectorAll('.character-wrapper').forEach(el => el.remove());
            document.querySelectorAll('style').forEach(s => {
                if (s.textContent.includes('characterBreathe')) s.remove();
            });
            startSequence();
        }
    };

})();
