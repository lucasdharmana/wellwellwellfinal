// Character Animation Script - Surprise Jump Effect
// CLEAN VERSION - No bobbing, smooth animation

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
        characterSize: 450,
        mobileScale: 0.5,
        scales: {
            jew: 0.85,
            africa: 1.0
        },
        positions: {
            jew: 0.15,
            africa: 0.85
        },
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
            
            const baseSize = isMobile ? config.characterSize * config.mobileScale : config.characterSize;
            const startSize = 5;
            const finalSize = baseSize * (config.scales[characterType] || 1.0);

            const bubbleEdgeOffset = logoRect.width * 0.35;
            const logoCenterX = characterType === 'jew' 
                ? logoRect.left + (logoRect.width / 2) - bubbleEdgeOffset + window.pageXOffset
                : logoRect.left + (logoRect.width / 2) + bubbleEdgeOffset + window.pageXOffset;
            const logoCenterY = logoRect.top + (logoRect.height * 0.65) + window.pageYOffset;

            const finalX = screenWidth * config.positions[characterType];
            const dividerTop = dividerRect.top + window.pageYOffset;
            const finalY = dividerTop - (finalSize * config.heightOffset);
            
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

            const character = document.createElement('div');
            character.className = `character character-${characterType}`;
            character.style.cssText = `
                width: 100%;
                height: 100%;
                position: relative;
            `;

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

            img.onload = () => {
                setTimeout(() => {
                    wrapper.style.transition = 'opacity 150ms ease-out';
                    wrapper.style.opacity = '1';
                }, 50);

                setTimeout(() => {
                    wrapper.style.zIndex = '45';
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

                setTimeout(() => {
                    wrapper.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    wrapper.style.pointerEvents = 'auto';
                    wrapper.style.zIndex = '45';
                    
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
