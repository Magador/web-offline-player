"use strict"

var playlist = []
const player = document.querySelector('.player')
const playlistDisplay = document.querySelector('.playlist-display')

playlistDisplay.addEventListener('drop', onDrop)
playlistDisplay.addEventListener('dragleave', onDragLeave)
document.addEventListener('dragenter', onDragEnter)
document.addEventListener('dragover', onDragOver)

function onDrop(e) {
  if(!playlistOpened)
    playlistDisplay.classList.remove('visible')
  e.preventDefault()

  Array.from(e.dataTransfer.files).filter(f => '' != player.canPlayType(f.type)).forEach(f => addVideo(f))
}

function onDragEnter(e) {
  playlistDisplay.classList.add('visible')
}

function onDragOver(e) {
  e.preventDefault()
}

function onDragLeave(e) {
  if(!playlistOpened)
    playlistDisplay.classList.remove('visible')
}

const playPause = document.querySelector('.play-pause')
const muteUnmute = document.querySelector('.mute-unmute')
let mutedVolume = player.volume;
let uiPlayState = false;

playPause.addEventListener('click', _ => {
  if (player.paused)
    play()
  else
    pause()
})

muteUnmute.addEventListener('click', _ => {
  if(player.volume == 0)
    player.volume = mutedVolume || .5
  else {
    player.volume = 0
  }
})

const currentPlayState = {
  index: 0
}

const playlistList = document.querySelector('.playlist')
const playlistItemTemplate = document.querySelector('#playlist-item-template')

function addVideo(video) {
  const listItem = playlistItemTemplate.content.cloneNode(true)
  const index = playlist.length
  listItem.querySelector('.playlist-play-element').addEventListener('click', _ => {
    player.src = URL.createObjectURL(playlist[index])
    currentPlayState.index = index
    play()
  })
  listItem.querySelector('.playlist-title').textContent = video.name
  playlistList.appendChild(listItem)
  playlist.push(video)
}

function play() {
  if (playlist.length === 0)
    return

  if (player.currentSrc == '' || player.ended)
    player.src = URL.createObjectURL(playlist[currentPlayState.index])

  return player.play()
}

function pause() {
  player.pause()
}

player.addEventListener('play', _ => {
  playPause.textContent = 'Pause'
  timeControl.disabled = false
})

player.addEventListener('pause', _ => {
  playPause.textContent = 'Play'
})

player.addEventListener('volumechange', _ => {
  volumeControl.value = player.volume
  if (player.volume == 0) {
    muteUnmute.textContent = '🔈'
  } else {
    muteUnmute.textContent = '🔊'
  }
})

player.addEventListener('ended', _ => {
  if (currentPlayState.index == playlist.length - 1)
    return

  currentPlayState.index = currentPlayState.index + 1
  play()
})

const volumeControl = document.querySelector('.volume-control')

volumeControl.addEventListener('input', _ => {
  mutedVolume = player.volume = parseFloat(volumeControl.value)
})

const timeDisplay = document.querySelector('.time-display')

player.addEventListener('timeupdate', _ => {
  if(isNaN(player.duration) || !isFinite(player.duration))
    return;
  timeDisplay.textContent = `${timestamp(player.currentTime)} / ${timestamp(player.duration)}`
  timeControl.value = player.currentTime / player.duration
})

player.addEventListener('ended', _ => {
  timeDisplay.textContent = '-:-- / -:--'
})

function timestamp(time) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60).toString().padStart(2, 0)
  return `${minutes}:${seconds}`
}

const timeControl = document.querySelector('.time-control')

timeControl.addEventListener('input', _ => {
  player.currentTime = timeControl.value * player.duration
})

timeControl.addEventListener('mousedown', onTimeControlMouseDown)

function onTimeControlMouseDown() {
  timeControl.removeEventListener('mousedown', onTimeControlMouseDown)
  pause()
  document.addEventListener('mouseup', onTimeControlMouseUp)
}

function onTimeControlMouseUp() {
  document.removeEventListener('mouseup', onTimeControlMouseUp)
  play().then(_ => {
    timeControl.addEventListener('mousedown', onTimeControlMouseDown)
    timeControl.disabled = false
  })
  timeControl.disabled = true
}

let playlistOpened = false;
const openPlaylist = document.querySelector('.open-playlist')

openPlaylist.addEventListener('click', _ => {
  playlistDisplay.classList.add('visible')
  playlistOpened = true
})

const closePlaylist = document.querySelector('.close-playlist')

closePlaylist.addEventListener('click', _ => {
  playlistDisplay.classList.remove('visible')
  playlistOpened = false
})

function sendNotification(name) {
  
}