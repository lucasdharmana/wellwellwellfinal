// Character Animation Script for WELL WELL Website
// Simple fade-in transitions with fixed positioning on the section divider

(function() {
    'use strict';

    const characterImages = {
        jew: 'images/wellwell12347_jew.png',
        africa: 'images/wellwell12347_africa.png'
    };

    const config = {
        initialDelay: 1000,        // 1 second initial delay
        sequenceDelay: 500,        // 0.5 seconds between each character
        fadeInDuration: 800,       // 0.8 second fade-in
        characterSize: 300,        // 50% bigger than original 200px
        mobileScale: 0.4,          // 40% size on mobile to prevent glitching
        positions: {
            jew: 0.30,             // 30% from left
            africa: 0.70           // 70% from left
        },
        heightOffset: 0.85,        // Multiplier for positioning (0.85 = sits on line, 1.0 = below line)
        enableMobileFixed: true    // Fix position on mobile to prevent glitching
    };

    function createCharacter(imagePath, characterType, delay) {
        setTimeout(() => {
            const character = document.createElement('div');
            character.className = `character character-${characterType}`;
            
            // Find the section divider to position characters
            const divider = document.querySelector('.section-divider');
            if (!divider) {
                return;
            }

            const dividerRect = divider.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const isMobile = screenWidth < 768;
            
            // Calculate size
            const size = isMobile ? config.characterSize * config.mobileScale : config.characterSize;
            
            // Calculate position
            const xPosition = screenWidth * config.positions[characterType];
            // Adjusted height calculation with configurable offset
            const yPosition = dividerRect.top + window.pageYOffset - (size * config.heightOffset);

            // Set initial styles with fixed positioning for mobile
            character.style.cssText = `
                position: ${isMobile && config.enableMobileFixed ? 'fixed' : 'absolute'};
                width: ${size}px;
                height: ${size}px;
                left: ${xPosition - (size / 2)}px;
                ${isMobile && config.enableMobileFixed ? 
                    `top: ${dividerRect.top - (size * config.heightOffset)}px;` : 
                    `top: ${yPosition}px;`}
                opacity: 0;
                z-index: 50;
                pointer-events: none;
                transition: opacity ${config.fadeInDuration}ms ease-in-out;
                will-change: opacity;
                transform-style: preserve-3d;
                backface-visibility: hidden;
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

            img.onload = () => {
                // Trigger fade-in after image loads
                requestAnimationFrame(() => {
                    character.style.opacity = '1';
                });
            };

            img.onerror = () => {
                // Create placeholder if image fails
                character.style.background = 'linear-gradient(135deg, #FF6B6B, #4ECDC4)';
                character.style.borderRadius = '50%';
                character.style.opacity = '0.5';
            };
            
            character.appendChild(img);
            document.body.appendChild(character);
        }, delay);
    }

    function updateCharacterPositions() {
        const divider = document.querySelector('.section-divider');
        if (!divider) return;

        const dividerRect = divider.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const isMobile = screenWidth < 768;
        const size = isMobile ? config.characterSize * config.mobileScale : config.characterSize;

        document.querySelectorAll('.character').forEach(character => {
            const characterType = character.className.split('character-')[1];
            if (characterType && config.positions[characterType]) {
                const xPosition = screenWidth * config.positions[characterType];
                
                character.style.width = `${size}px`;
                character.style.height = `${size}px`;
                character.style.left = `${xPosition - (size / 2)}px`;
                
                if (isMobile && config.enableMobileFixed) {
                    // Use fixed positioning on mobile
                    character.style.position = 'fixed';
                    character.style.top = `${dividerRect.top - (size * config.heightOffset)}px`;
                } else {
                    // Use absolute positioning on desktop
                    character.style.position = 'absolute';
                    const yPosition = dividerRect.top + window.pageYOffset - (size * config.heightOffset);
                    character.style.top = `${yPosition}px`;
                }
            }
        });
    }

    function startSequence() {
        // Create characters with staggered delays
        createCharacter(characterImages.jew, 'jew', config.initialDelay);
        createCharacter(characterImages.africa, 'africa', config.initialDelay + config.sequenceDelay);
    }

    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startSequence);
        } else {
            startSequence();
        }

        // Update positions on scroll and resize
        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateCharacterPositions, 100);
        });

        window.addEventListener('resize', () => {
            updateCharacterPositions();
        });
    }

    // Initialize
    init();

    // Expose API for testing
    window.CharacterAnimation = {
        config: config,
        restart: function() {
            // Remove existing characters
            document.querySelectorAll('.character').forEach(c => c.remove());
            // Restart sequence
            startSequence();
        },
        setDelay: function(initial, sequence) {
            config.initialDelay = initial;
            config.sequenceDelay = sequence;
            this.restart();
        },
        setSize: function(size) {
            config.characterSize = size;
            updateCharacterPositions();
        },
        setHeightOffset: function(offset) {
            // Offset controls how high characters sit
            // 0.5 = halfway up their height above line
            // 0.85 = mostly on the line
            // 1.0 = bottom touches line
            config.heightOffset = offset;
            updateCharacterPositions();
        },
        setMobileScale: function(scale) {
            config.mobileScale = scale;
            updateCharacterPositions();
        },
        toggleMobileFixed: function(enable) {
            config.enableMobileFixed = enable;
            updateCharacterPositions();
        }
    };

})();
// ADD this new function at the END of your existing JS file
// This won't interfere with your social media buttons

function initCharacterAnimations() {
    const jewCharacter = document.querySelector('.jew-character'); // Update with your actual class
    const africaCharacter = document.querySelector('.africa-character'); // Update with your actual class
    
    if (!jewCharacter || !africaCharacter) return;
    
    // Store original positions first
    const jewOriginal = jewCharacter.getBoundingClientRect();
    const africaOriginal = africaCharacter.getBoundingClientRect();
    
    // Get logo center for hiding position
    const logo = document.querySelector('.thought-bubble'); // Update with your logo class
    if (!logo) return;
    
    const logoRect = logo.getBoundingClientRect();
    const logoCenterX = logoRect.left + logoRect.width / 2;
    const logoCenterY = logoRect.top + logoRect.height / 2;
    
    // Setup initial hidden state
    jewCharacter.style.cssText += `
        position: fixed !important;
        left: ${logoCenterX}px !important;
        top: ${logoCenterY}px !important;
        transform: translate(-50%, -50%) scale(0.01) !important;
        opacity: 0 !important;
        z-index: 1 !important;
        transition: none !important;
    `;
    
    africaCharacter.style.cssText += `
        position: fixed !important;
        left: ${logoCenterX}px !important;
        top: ${logoCenterY}px !important;
        transform: translate(-50%, -50%) scale(0.01) !important;
        opacity: 0 !important;
        z-index: 1 !important;
        transition: none !important;
    `;
    
    // Start animations after logo settles
    setTimeout(() => {
        animateCharacterOut(jewCharacter, jewOriginal.left - 50, jewOriginal.top - 30, 0);
        animateCharacterOut(africaCharacter, africaOriginal.left + 50, africaOriginal.top - 30, 400);
    }, 2500);
}

function animateCharacterOut(character, finalX, finalY, delay) {
    setTimeout(() => {
        character.style.transition = 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        character.style.left = `${finalX}px`;
        character.style.top = `${finalY}px`;
        character.style.transform = 'translate(0, 0) scale(1.5)';
        character.style.opacity = '1';
        character.style.zIndex = '5';
    }, delay);
}

// ADD this single line to trigger the animation when page loads
// Put this at the very end of your file
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCharacterAnimations);
} else {
    initCharacterAnimations();
}
