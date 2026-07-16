const container = document.getElementById('stack-container');
const cards = Array.from(container.getElementsByClassName('stack-item'));

let activeCard = null;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;

cards.forEach(card => {
    card.addEventListener('pointerdown', onPointerDown);
});

function onPointerDown(e) {
    if (e.currentTarget !== container.lastElementChild) return;
    
    activeCard = e.currentTarget;
    activeCard.style.transition = 'none';
    
    startX = e.clientX;
    startY = e.clientY;
    
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
}

function onPointerMove(e) {
    if (!activeCard) return;
    
    currentX = e.clientX - startX;
    currentY = e.clientY - startY;
    let rotate = currentX * 0.08; 
    
    activeCard.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotate}deg)`;
}

function onPointerUp(e) {
    if (!activeCard) return;
    
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    
    if (Math.abs(currentX) > 100 || Math.abs(currentY) > 100) {
        let flyX = currentX > 0 ? 400 : -400;
        let flyY = currentY > 0 ? 400 : -400;
        
        activeCard.style.transition = 'transform 0.4s ease-out';
        activeCard.style.transform = `translate(${flyX}px, ${flyY}px) rotate(${currentX * 0.1}deg)`;
        
        const cardToMove = activeCard;
        setTimeout(() => {
            cardToMove.style.transition = 'none';
            cardToMove.style.transform = '';
            container.insertBefore(cardToMove, container.firstElementChild);
            
            setTimeout(() => {
                updateStackRotations();
            }, 20);
        }, 400);
        
    } else {
        activeCard.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.2)';
        activeCard.style.transform = '';
        setTimeout(() => {
            updateStackRotations();
        }, 300);
    }
    
    activeCard = null;
    currentX = 0;
    currentY = 0;
}

function updateStackRotations() {
    const currentCards = Array.from(container.getElementsByClassName('stack-item'));
    const rotations = [-3, 4, -5, 2];
    
    currentCards.forEach((card, index) => {
        card.style.transition = 'transform 0.5s ease';
        let rotIdx = index % rotations.length;
        let depth = (currentCards.length - 1 - index) * -10;
        card.style.transform = `rotate(${rotations[rotIdx]}deg) translateZ(${depth}px)`;
    });
}