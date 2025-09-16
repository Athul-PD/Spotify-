export function setupSlider(wrapperSelector){
    const wrapper = document.querySelector(wrapperSelector);
    const track = wrapper.querySelector('.made_for_you');
    const next = wrapper.querySelector('.next');
    const prev = wrapper.querySelector('.prev');

    let index = 0;
    const cardsPerView = 4;
    const totalCards = track.querySelectorAll('.slider_1').length;
    const maxIndex = Math.ceil(totalCards - cardsPerView);

    function updateSlider(){
        const slideWidth = track.querySelector('.slider_1').offsetWidth + 16;
        track.style.transform = `translateX(-${index * slideWidth}px)`;

        if(index <= 0){
            prev.style.display = 'none';
        }else{
            prev.style.display = 'block';
        }

        if(index >= maxIndex){
            next.style.display = 'none';
        }else{
            next.style.display = 'block';
        }
    }
    next.addEventListener('click',() => {
        if(index < maxIndex){
            index += 2;
            if(index > maxIndex) index = maxIndex;
            updateSlider();
        }
    })
    prev.addEventListener('click',() => {
        if(index > 0){
            index -= 2;
            if(index < 0) index = 0;
            updateSlider();
        }
    })
}
