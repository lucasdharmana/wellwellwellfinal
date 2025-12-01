// Character Animation Script - Surprise Jump Effect
// FIXED VERSION - All PDF changes applied

(function() {
    'use strict';

    const characterImages = {
        jew: 'images/wellwell12347_jew.png',
        africa: 'images/wellwell12347_africa.png'
    };

    const config = {
        initialDelay: 1500,
        sequenceDelay: 600,
        animationDuration: 1400,
        characterSize: 450,
        mobileScale: 0.5,
        // FIX 1: Individual character scaling (adjust jew value until heights match visually)
        scales: {
            jew: 0.85,
            africa: 1.0
        },
        // FIX 2: Characters further apart
        positions: {
            jew: 0.15,
            africa: 0.85
        },
        // FIX 3: Characters higher up (lower number = higher position)
        heightOffset: 0.55,
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
            
            // FIX 1: Apply individual character scaling
            const baseSize = isMobile ? config.characterSize * config.mobileScale : config.characterSize;
            const startSize = 5;
            const finalSize = baseSize * (config.scales[characterType] || 1.0);

            // FIX 4: Characters emerge from bubble edges, not center
            const bubbleEdgeOffset = logoRect.width * 0.35;
            const logoCenterX = characterType === 'jew' 
                ? logoRect.left + (logoRect.width / 2) - bubbleEdgeOffset + window.pageXOffset
                : logoRect.left + (logoRect.width / 2) + bubbleEdgeOffset + window.pageXOffset;
            const logoCenterY = logoRect.top + (logoRect.height * 0.65) + window.pageYOffset;

            // Final positions
            const finalX = screenWidth * config.positions[characterType];
            const dividerTop = dividerRect.top + window.pageYOffset;
            const finalY = dividerTop - (finalSize * config.heightOffset);
            
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
                // FIX 5: Create keyframe animation with natural bobbing
                const animationName = `jumpOut_${characterType}_${Date.now()}`;
                const jumpAngle = characterType === 'jew' ? -15 : 15;
                
                const keyframes = `
                    @keyframes ${animationName} {
                        0% {
                            left: ${logoCenterX}px;
                            top: ${logoCenterY}px;
                            width: ${startSize}px;
                            height: ${startSize}px;
                            opacity: 1;
                            transform: translate(-50%, -50%) rotate(0deg);
                        }
                        15% {
                            left: ${logoCenterX + (characterType === 'jew' ? -50 : 50)}px;
                            top: ${logoCenterY + 30}px;
                            width: ${finalSize * 0.3}px;
                            height: ${finalSize * 0.3}px;
                            transform: translate(-50%, -50%) rotate(${jumpAngle * 0.5}deg) translateY(-4px);
                        }
                        30% {
                            left: ${logoCenterX + (characterType === 'jew' ? -120 : 120)}px;
                            top: ${logoCenterY + 80}px;
                            width: ${finalSize * 0.55}px;
                            height: ${finalSize * 0.55}px;
                            transform: translate(-50%, -50%) rotate(${jumpAngle * -0.3}deg) translateY(5px);
                        }
                        50% {
                            left: ${finalX * 0.65 + logoCenterX * 0.35}px;
                            top: ${finalY * 0.6 + logoCenterY * 0.4}px;
                            width: ${finalSize * 0.8}px;
                            height: ${finalSize * 0.8}px;
                            transform: translate(-50%, -50%) rotate(${jumpAngle * 0.2}deg) translateY(-6px);
                        }
                        70% {
                            left: ${finalX * 0.9 + logoCenterX * 0.1}px;
                            top: ${finalY - 20}px;
                            width: ${finalSize * 0.95}px;
                            height: ${finalSize * 0.95}px;
                            transform: translate(-50%, -50%) rotate(${jumpAngle * -0.1}deg) translateY(4px);
                        }
                        85% {
                            left: ${finalX}px;
                            top: ${finalY + 10}px;
                            width: ${finalSize * 1.02}px;
                            height: ${finalSize * 1.02}px;
                            transform: translate(-50%, -50%) rotate(0deg) translateY(-3px);
                        }
                        100% {
                            left: ${finalX}px;
                            top: ${finalY}px;
                            width: ${finalSize}px;
                            height: ${finalSize}px;
                            transform: translate(-50%, -50%) rotate(0deg) translateY(0);
                        }
                    }
                `;
                
                const styleSheet = document.createElement('style');
                styleSheet.textContent = keyframes;
                document.head.appendChild(styleSheet);

                // Phase 1: Fade in while still small
                setTimeout(() => {
                    wrapper.style.opacity = '1';
                }, 50);

                // Phase 2: Run the jump animation
                setTimeout(() => {
                    // FIX 8: z-index 45 so characters go UNDER navigation (nav is z-index 100)
                    wrapper.style.zIndex = '45';
                    wrapper.style.animation = `${animationName} ${config.animationDuration}ms cubic-bezier(0.34, 1.15, 0.64, 1) forwards`;
                }, 150);

                // Phase 3: Lock in place with hover effects
                setTimeout(() => {
                    wrapper.style.animation = '';
                    wrapper.style.left = finalX + 'px';
                    wrapper.style.top = finalY + 'px';
                    wrapper.style.width = finalSize + 'px';
                    wrapper.style.height = finalSize + 'px';
                    wrapper.style.transform = 'translate(-50%, -50%)';
                    wrapper.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    wrapper.style.pointerEvents = 'auto';
                    // FIX 8: Ensure z-index stays at 45
                    wrapper.style.zIndex = '45';
                    
                    wrapper.addEventListener('mouseenter', () => {
                        wrapper.style.transform = 'translate(-50%, -50%) scale(1.08) translateY(-8px)';
                    });
                    
                    wrapper.addEventListener('mouseleave', () => {
                        wrapper.style.transform = 'translate(-50%, -50%) scale(1)';
                    });
                    
                    // Subtle breathing animation
                    wrapper.style.animation = 'characterBreathe 3s ease-in-out infinite';
                }, config.animationDuration + 200);
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

    // Expose API for testing/adjustment
    window.CharacterAnimation = {
        config: config,
        restart: function() {
            document.querySelectorAll('.character-wrapper').forEach(el => el.remove());
            startSequence();
        },
        setScale: function(character, scale) {
            config.scales[character] = scale;
            this.restart();
        },
        setPositions: function(jewPos, africaPos) {
            config.positions.jew = jewPos;
            config.positions.africa = africaPos;
            this.restart();
        },
        setHeightOffset: function(offset) {
            config.heightOffset = offset;
            this.restart();
        }
    };

})();
