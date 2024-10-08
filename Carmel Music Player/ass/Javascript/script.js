// Definindo as músicas disponíveis, agora com clipes de vídeo associados
const tracks = [
  {
    title: "Vento no Litoral",
    artist: "Legião Urbana",
    src: "ass/mus/musica1.mp3",
    cover: "ass/img/capa1.jpg",
    video: "ass/videos/clipe1.mp4" // Caminho do clipe de vídeo
  },
  {
    title: "Remexe",
    artist: "Chiquititas",
    src: "ass/mus/musica2.mp3",
    cover: "ass/img/capa2.jpg",
    video: "ass/videos/clipe2.mp4"
  },
  {
    title: "Deixa Acontecer",
    artist: "Grupo Revelação",
    src: "ass/mus/musica3.mp3",
    cover: "ass/img/capa3.jpg",
    video: "ass/videos/clipe3.mp4"
  },
  {
    title: "Fio de cabelo",
    artist: "Chitãozinho e Xororó",
    src: "ass/mus/musica4.mp3",
    cover: "ass/img/capa4.jpg",
    video: "ass/videos/clipe4.mp4"
  },
  {
    title: "A dança do Bumbum",
    artist: "É o Tchan",
    src: "ass/mus/musica5.mp3",
    cover: "ass/img/capa5.jpg",
    video: "ass/videos/clipe5.mp4"
  }
];

// Variáveis de controle
let currentTrack = 0;
let isPlaying = false;
let isLoop = false; // Variável para controlar o estado de loop
let isShuffle = false; // Variável para controlar o estado de shuffle

// Referências aos elementos HTML
const audio = document.getElementById('audio');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const albumCover = document.getElementById('albumCover');
const videoBackground = document.getElementById('videoBackground');
const progress = document.getElementById('progress');
const timer = document.getElementById('timer');
const loopButton = document.getElementById('loop'); // Botão de loop
const shuffleButton = document.getElementById('shuffle'); // Botão de shuffle
const stopButton = document.getElementById('stop'); // Botão de stop

// Função para carregar a música e o clipe correspondentes
function loadTrack(trackIndex) {
  const track = tracks[trackIndex];
  audio.src = track.src;
  title.textContent = track.title;
  artist.textContent = track.artist;
  albumCover.src = track.cover;
  videoBackground.src = track.video; // Carrega o clipe de vídeo de fundo

  // Caso o áudio já esteja tocando, iniciar automaticamente o novo clipe e a nova música
  if (isPlaying) {
    audio.play();
    videoBackground.play();
  } else {
    videoBackground.pause(); // O clipe não deve tocar até que o áudio toque
  }
}

// Carregar a primeira música ao iniciar
loadTrack(currentTrack);

// Tocar / Pausar
document.getElementById('play').addEventListener('click', function () {
  if (isPlaying) {
    audio.pause();
    videoBackground.pause(); // Pausa o vídeo quando a música é pausada
    isPlaying = false;
    this.innerHTML = '<i class="bi bi-play-circle-fill"></i>';
  } else {
    audio.play();
    videoBackground.play(); // Toca o vídeo sincronizado com a música
    isPlaying = true;
    this.innerHTML = '<i class="bi bi-pause-circle-fill"></i>';
  }
});

// Função para o botão de stop
stopButton.addEventListener('click', function () {
  audio.pause();
  videoBackground.pause();
  audio.currentTime = 0;
  videoBackground.currentTime = 0;
  isPlaying = false;
  document.getElementById('play').innerHTML = '<i class="bi bi-play-circle-fill"></i>'; // Reseta o botão de play
});

// Botão de próxima música
document.getElementById('next').addEventListener('click', function () {
  nextTrack();
});

// Função para tocar a próxima música ou repetir a atual se o loop estiver ativo
function nextTrack() {
  if (isLoop) {
    // Se o loop estiver ativo, repete a mesma faixa
    audio.currentTime = 0;
    audio.play();
    videoBackground.currentTime = 0;
    videoBackground.play();
  } else if (isShuffle) {
    // Se o shuffle estiver ativado, seleciona uma faixa aleatória
    currentTrack = Math.floor(Math.random() * tracks.length);
    loadTrack(currentTrack);
    if (isPlaying) {
      audio.play();
      videoBackground.play();
    }
  } else {
    // Toca a próxima música na sequência
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    if (isPlaying) {
      audio.play();
      videoBackground.play(); // Sincroniza a nova música com o clipe correspondente
    }
  }
}

// Botão de música anterior
document.getElementById('prev').addEventListener('click', function () {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrack);
  if (isPlaying) {
    audio.play();
    videoBackground.play(); // Sincroniza a nova música com o clipe correspondente
  }
});

// Barra de progresso
audio.addEventListener('timeupdate', function () {
  const progressValue = (audio.currentTime / audio.duration) * 100;
  progress.value = progressValue || 0;

  // Atualizando o tempo atual e a duração total
  let currentMinutes = Math.floor(audio.currentTime / 60);
  let currentSeconds = Math.floor(audio.currentTime % 60);
  let durationMinutes = Math.floor(audio.duration / 60);
  let durationSeconds = Math.floor(audio.duration % 60);

  if (currentSeconds < 10) currentSeconds = "0" + currentSeconds;
  if (durationSeconds < 10) durationSeconds = "0" + durationSeconds;

  timer.textContent = `${currentMinutes}:${currentSeconds} / ${durationMinutes}:${durationSeconds}`;
});

// Atualizando o tempo do áudio quando a barra de progresso é ajustada
progress.addEventListener('input', function () {
  const progressTime = (progress.value / 100) * audio.duration;
  audio.currentTime = progressTime;
});

// Mostra/oculta a lista de músicas (aba lateral)
document.getElementById('music-list').addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle('show');
});

// Populando a lista de músicas na aba lateral
const trackList = document.getElementById('trackList');
tracks.forEach((track, index) => {
  const li = document.createElement('li');
  li.textContent = `${track.title} - ${track.artist}`;
  li.addEventListener('click', function () {
    currentTrack = index;
    loadTrack(currentTrack);
    if (isPlaying) {
      audio.play();
      videoBackground.play(); // Toca o clipe ao selecionar uma música
    }
    document.getElementById('sidebar').classList.remove('show'); // Fechar a aba após a seleção
  });
  trackList.appendChild(li);
});

// Botão de loop
loopButton.addEventListener('click', function () {
  isLoop = !isLoop; // Alterna o estado de loop
  loopButton.classList.toggle('active'); // Alterar a aparência do botão
});

// Botão de shuffle
shuffleButton.addEventListener('click', function () {
  isShuffle = !isShuffle; // Alterna o estado de shuffle
  shuffleButton.classList.toggle('active'); // Alterar a aparência do botão
});

// Quando o áudio terminar, passa para a próxima faixa ou repete, dependendo do loop ou shuffle
audio.addEventListener('ended', function () {
  nextTrack();
});

