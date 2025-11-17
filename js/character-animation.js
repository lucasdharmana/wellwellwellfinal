// Character Animation Script for WELL WELL Website
// Enhanced with jump-out-from-behind-logo effect

(function() {
    'use strict';

    const characterImages = {
        jew: 'images/wellwell12347_jew.png',
        africa: 'images/wellwell12347_africa.png'
    };

    const config = {
        initialDelay: 2000,        // Wait for logo to settle
        sequenceDelay: 400,        // Delay between characters
        animationDuration: 1500,   // Total animation time
        characterSize: 450,        // 50% bigger than current 300px
        mobileScale: 0.4,
        positions: {
            jew: 0.30,
            africa: 0.70
        },
        heightOffset: 0.75,        // Higher position above line
        enableMobileFixed: true
    };

    function createCharacter(imagePath, characterType, delay) {
        setTimeout(() => {
            const character = document.createElement('div');
            character.className = `character character-${characterType}`;
            
            const divider = document.querySelector('.section-divider');
            const logo = document.querySelector('.speech-bubble-container, .thought-bubble');
            
            if (!divider || !logo) return;

            const dividerRect = divider.getBoundingClientRect();
            const logoRect = logo.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const isMobile = screenWidth < 768;
            
            // Calculate sizes
            const startSize = 5; // Start almost invisible
            const finalSize = isMobile ? config.characterSize * config.mobileScale : config.characterSize;
            
            // Calculate positions
            const logoCenterX = logoRect.left + (logoRect.width / 2);
            const logoCenterY = logoRect.top + (logoRect.height / 2);
            
            // Final positions
            const finalX = screenWidth * config.positions[characterType];
            const finalY = dividerRect.top + window.pageYOffset - (finalSize * config.heightOffset);
            
            // Create wrapper for proper layering
            const wrapper = document.createElement('div');
            wrapper.className = `character-wrapper wrapper-${characterType}`;
            wrapper.style.cssText = `
                position: absolute;
                left: ${logoCenterX}px;
                top: ${logoCenterY}px;
                width: ${startSize}px;
                height: ${startSize}px;
                z-index: 5;
                transform: translate(-50%, -50%);
                will-change: transform, width, height, left, top;
            `;

            // Set character initial state
            character.style.cssText = `
                width: 100%;
                height: 100%;
                opacity: 0;
                transform: scale(1);
                position: relative;
            `;

            // Create and add image
            const img = document.createElement('img');
            img.src = imagePath;
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: contain;
                image-rendering: -webkit-optimize-contrast;
            `;

            character.appendChild(img);
            wrapper.appendChild(character);
            document.body.appendChild(wrapper);

            // Start the complex animation sequence
            img.onload = () => {
                // Phase 1: Peek out (character becomes visible while small)
                setTimeout(() => {
                    character.style.transition = 'opacity 200ms ease';
                    character.style.opacity = '1';
                }, 100);

                // Phase 2: Jump out animation
                setTimeout(() => {
                    // Calculate jump path
                    const jumpAngle = characterType === 'jew' ? -25 : 25; // Angle of emergence
                    const jumpDistance = 150; // How far they jump initially
                    
                    // Create keyframe animation
                    const jumpAnimation = `
                        @keyframes jumpOut${characterType} {
                            0% {
                                left: ${logoCenterX}px;
                                top: ${logoCenterY}px;
                                width: ${startSize}px;
                                height: ${startSize}px;
                                transform: translate(-50%, -50%) rotate(0deg);
                                z-index: 5;
                            }
                            20% {
                                left: ${logoCenterX + (Math.sin(jumpAngle * Math.PI / 180) * jumpDistance * 0.3)}px;
                                top: ${logoCenterY + (Math.cos(jumpAngle * Math.PI / 180) * jumpDistance * 0.3)}px;
                                width: ${finalSize * 0.2}px;
                                height: ${finalSize * 0.2}px;
                                transform: translate(-50%, -50%) rotate(${jumpAngle * 0.5}deg);
                                z-index: 51;
                            }
                            40% {
                                left: ${logoCenterX + (Math.sin(jumpAngle * Math.PI / 180) * jumpDistance)}px;
                                top: ${logoCenterY + jumpDistance * 0.5}px;
                                width: ${finalSize * 0.6}px;
                                height: ${finalSize * 0.6}px;
                                transform: translate(-50%, -50%) rotate(${jumpAngle}deg);
                                z-index: 51;
                            }
                            60% {
                                left: ${finalX - (finalSize / 2) + (finalSize / 2)}px;
                                top: ${finalY - 30}px;
                                width: ${finalSize * 1.1}px;
                                height: ${finalSize * 1.1}px;
                                transform: translate(-50%, -50%) rotate(${-jumpAngle * 0.3}deg);
                                z-index: 51;
                            }
                            80% {
                                left: ${finalX - (finalSize / 2) + (finalSize / 2)}px;
                                top: ${finalY + 10}px;
                                width: ${finalSize * 0.95}px;
                                height: ${finalSize * 0.95}px;
                                transform: translate(-50%, -50%) rotate(0deg);
                                z-index: 51;
                            }
                            100% {
                                left: ${finalX}px;
                                top: ${finalY}px;
                                width: ${finalSize}px;
                                height: ${finalSize}px;
                                transform: translate(-50%, -50%) rotate(0deg);
                                z-index: 51;
                            }
                        }
                    `;
                    
                    // Inject keyframe animation
                    const styleSheet = document.createElement('style');
                    styleSheet.textContent = jumpAnimation;
                    document.head.appendChild(styleSheet);
                    
                    // Apply animation to wrapper
                    wrapper.style.animation = `jumpOut${characterType} ${config.animationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
                    
                    // Add bouncing shadow
                    const shadow = document.createElement('div');
                    shadow.className = 'character-shadow';
                    shadow.style.cssText = `
                        position: absolute;
                        bottom: -10px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 60%;
                        height: 15px;
                        background: radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, transparent 70%);
                        opacity: 0;
                        animation: shadowPulse ${config.animationDuration}ms ease-out forwards;
                    `;
                    wrapper.appendChild(shadow);
                    
                }, 300);
                
                // Phase 3: Final positioning (after animation completes)
                setTimeout(() => {
                    wrapper.style.animation = '';
                    wrapper.style.cssText = `
                        position: ${isMobile && config.enableMobileFixed ? 'fixed' : 'absolute'};
                        left: ${finalX}px;
                        top: ${isMobile && config.enableMobileFixed ? dividerRect.top - (finalSize * config.heightOffset) : finalY}px;
                        width: ${finalSize}px;
                        height: ${finalSize}px;
                        transform: translate(-50%, -50%);
                        z-index: 51;
                        transition: transform 0.3s ease;
                    `;
                    
                    // Add hover effect
                    wrapper.addEventListener('mouseenter', () => {
                        wrapper.style.transform = 'translate(-50%, -50%) scale(1.05) translateY(-5px)';
                    });
                    
                    wrapper.addEventListener('mouseleave', () => {
                        wrapper.style.transform = 'translate(-50%, -50%) scale(1)';
                    });
                    
                }, config.animationDuration + 300);
            };
        }, delay);
    }

    function startSequence() {
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

    // Expose API for testing
    window.CharacterAnimation = {
        config: config,
        restart: function() {
            document.querySelectorAll('.character-wrapper').forEach(c => c.remove());
            document.querySelectorAll('style').forEach(s => {
                if (s.textContent.includes('jumpOut')) s.remove();
            });
            startSequence();
        }
    };

})();
