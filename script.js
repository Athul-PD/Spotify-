import { setupSlider } from "./slider.js";
// Slider section
setupSlider('.made_for_you_wrapper');
setupSlider('.made_for_you_wrapper_2');
setupSlider('.made_for_you_wrapper_3');
setupSlider('.made_for_you_wrapper_4');
setupSlider('.made_for_you_wrapper_5');

// video hovering and play the video
const videos = document.querySelectorAll('.video');
videos.forEach(video => {
    video.addEventListener('mouseenter',() => {
        video.play();
    });
    video.addEventListener('mouseleave',() => {
        video.pause();

        video.currentTime = 0;
    })
})
const progress = document.querySelector('.progress_bar')
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');

function showPauseIcon(){
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'flex';
}
function showplayicon(){
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'flex';
    isPlaying = true;
}

playBtn.addEventListener('click',() => {
    showPauseIcon()
})
pauseBtn.addEventListener('click',() => {
    showplayicon()
})

// ...........Fetching for Song playing Functionality and Main Code starts here.........
const audio = document.getElementById('audio')
const previousMusic = document.getElementById('previousMusic')
const nextMusic = document.getElementById('nextMusic')
const current_songNAme = document.querySelectorAll('.current_songNAme');
const current_song_author = document.querySelectorAll('.current_song_author');
const current_song_img = document.querySelectorAll('.current_song_img');

const queue_img = document.querySelector('.queue_img');
const queue_author = document.querySelector('.queue_author');
const queue_name = document.querySelector('.queue_name');

let storingSongs = [];
let currentIndex = 0;

async function fetchingSongData(){
    try{
    const res = await fetch(`data.json`);
    const datas = await res.json();
    storingSongs = datas;

    playMusic(datas,currentIndex);

    }catch(err){
        console.warn('Error');
    }
}
fetchingSongData();

function playMusic(songdata,index){
    const currentSong = songdata[index];

    const {
        name,
        img,
        src,
        author,
        composer

    } = currentSong;

    audio.src = src;

    // Songs Name
    current_songNAme.forEach(names => {
        names.innerText = name;
    })

    // Song Authors
    current_song_author.forEach(authors => {
        authors.innerText = author;
    })

    // Song images
    current_song_img.forEach(images => {
        images.src = img;
    })

    // Composer
    const Current_composer = document.querySelector('.composerClass')
    Current_composer.innerText = composer;

    nextInQueue(songdata,index);

    // check if song is Liked or not....
    let playlistArray = getItemSongs('likedsongs');
    if(playlistArray.some(song => song.src === currentSong.src)){
        add_playlist.classList.add('addMusic');
    }else{
        add_playlist.classList.remove('addMusic');
    }
}
// Next in Queue...........
function nextInQueue(songdata,index){

    if(index === songdata.length-1){
        index = -1;
    }
    const currentSong = songdata[index + 1];

    const {
        name,author,img
    } = currentSong;

    queue_name.innerText = name;
    queue_author.innerText = author;
    queue_img.src = img;
}

// Play Music Btn.........
playBtn.addEventListener('click',() => {
    audio.play()
})
// Pause Music Btn.........
pauseBtn.addEventListener('click',() => {
    audio.pause();
})

// Play next song if we click on nextBtn.....
nextMusic.addEventListener('click',() => {
    add_playlist.classList.remove('addMusic')
    currentIndex++;
    if(currentIndex >= storingSongs.length){
        currentIndex = 0;
    }
    playMusic(storingSongs,currentIndex);
    audio.play();
    showPauseIcon();
})

// Play Previous song if we click on previousBtn.....
previousMusic.addEventListener('click',() => {
    add_playlist.classList.remove('addMusic')
    currentIndex--;
    if(currentIndex < 0){
        currentIndex = storingSongs.length - 1;
    }
    playMusic(storingSongs,currentIndex);
    audio.play();
    showPauseIcon();
})
// Setting Time duration of songs......
audio.addEventListener('loadedmetadata',() => {
    const tottalDurationOfSong = document.querySelector('.tottalDurationOfSong');

    const totaltime = audio.duration;

    const inSeconds = Math.floor(totaltime % 60);
    const inMinutes = Math.floor(totaltime / 60);

    const secondsPadded = String(inSeconds).padStart(2,"0");
    
    tottalDurationOfSong.innerText = `${inMinutes}:${secondsPadded}`

    progress.value = 0;
})

// Setting currentTime of Songs...........
audio.addEventListener('timeupdate',() => {
    const currentTimeofSong = document.querySelector('.currentTimeofSong');
    const songCurrrentTime = audio.currentTime;

    const inSeconds = Math.floor(songCurrrentTime % 60);
    const inMinutes = Math.floor(songCurrrentTime / 60);

    const inSecPadded = String(inSeconds).padStart(2,"0");

    currentTimeofSong.innerText = `${inMinutes}:${inSecPadded}`;

    // ProgressBar Live updations of Music........
    const totaltime = audio.duration;
    const val = (songCurrrentTime / totaltime) * 100;
    if(audio.play){
        progress.value = val;
    }else{
        progress.value = 0;
    }
    
    progress.style.background = `linear-gradient(to right, white ${val}%, gray ${val}%)`
})

// Allow user to seek by dragging.....
progress.addEventListener('input',() => {
    const totaltime = audio.duration;
    const newTime = (progress.value / 100) * totaltime;

    audio.currentTime = newTime;
})

// continous Playing functionality.........
audio.addEventListener('ended',() => {
    add_playlist.classList.remove('addMusic')
    currentIndex++;
    if(currentIndex >= storingSongs.length){
        currentIndex = 0;
    }
    playMusic(storingSongs,currentIndex);
    audio.play();
})

// add music to PlayList
function setItemToLocalStorage(key,value){
    localStorage.setItem(key,JSON.stringify(value))
}
function getItemSongs(key){
    const playlist = localStorage.getItem(key);
    return playlist ? JSON.parse(playlist) : [];
}

// if we clicked + icon then store the song to liked songs folder also localstorage....
const add_playlist = document.querySelector('.add_playlist');

add_playlist.addEventListener('click',() => {
    const currentsong = storingSongs[currentIndex];

    add_playlist.classList.toggle('addMusic')

    if(add_playlist.classList.contains('addMusic')){
        let playlistArray = getItemSongs('likedsongs');

        if(playlistArray.every(song => song.id !== currentsong.id)){
            playlistArray.push(currentsong);
            setItemToLocalStorage('likedsongs',playlistArray);
        }
    }else{
        let playlistArray = getItemSongs('likedsongs');

        playlistArray = playlistArray.filter(song => song.id !== currentsong.id);

        setItemToLocalStorage('likedsongs',playlistArray);
    }
})

const skipSong = document.querySelector('.hideSong')
skipSong.addEventListener('click',() => {
    currentIndex++;
    playMusic(storingSongs,currentIndex);
    audio.play();
    showPauseIcon();
})
