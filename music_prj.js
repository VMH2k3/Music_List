const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const cdWidth = cd.offsetWidth;
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Love U 3000 <3',
            singer: 'Vũ Minh Hoàng',
            path: './music/song9.mp4',
            image: './image/song9.png'

        },
        {
            name: 'Hẹn em ở lần yêu thứ 2',
            singer: 'Đặng Tuấn Vũ',
            path: './music/song1.mp3',
            image: './image/song1.jfif'

        },
        {
            name: 'Có chắc yêu là đây',
            singer: 'Sơn Tùng MTP',
            path: './music/song2.mp3',
            image: './image/song2.jfif'

        },
        {
            name: 'Muộn rồi mà sao còn',
            singer: 'Sơn Tùng MTP',
            path: './music/song3.mp3',
            image: './image/song3.jfif'

        },
        {
            name: 'Nop',
            singer: 'Chen Yue Long',
            path: './music/song4.mp3',
            image: './image/song4.jfif'

        },
        {
            name: 'Pluto projector',
            singer: ' Rex Orange Country',
            path: './music/song5.mp3',
            image: './image/song5.jfif'

        },
        {
            name: 'Ngày em đẹp nhất',
            singer: 'TAMA',
            path: './music/song6.mp3',
            image: './image/song6.png'

        },
        {
            name: 'Đếm cừu',
            singer: 'Han Sara',
            path: './music/song7.mp4',
            image: './image/song7.jfif'

        },
        {
            name: 'Đừng yêu nữa, em mệt rồi!',
            singer: 'Min',
            path: './music/song8.mp4',
            image: './image/song8.jfif'

        },

        {
            name: 'Jeremy Zucker',
            singer: 'Comethru ',
            path: './music/song10.mp4',
            image: './image/song10.jfif'

        }
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div></div>`
        });

        playList.innerHTML = htmls.join('');
    },
    handleEvent: function () {
        //xử lí quay cd
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10s
            iterations: Infinity //số lần lặp vô hạn
        }
        )
        cdThumbAnimate.pause();
        //xử lí phóng to thu nhỏ cd
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop;
            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0;
            cd.style.opacity = newcdWidth / cdWidth;
        }
        const _this = app;
        //xử lí phím play

        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
                cdThumbAnimate.pause();
            } else {
                audio.play();
                cdThumbAnimate.play();
            }
        }
        //  khi bài hát được phát
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
        }
        //khi bài hát bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
        }
        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }
        audio.onended = function () {
            if (_this.isRandom) {
                _this.randomSong();
                audio.play();
                _this.render();
            } else
                if (_this.isRepeat) {
                    audio.play();
                } else
                    _this.nextSong();
            audio.play();
            _this.render();

        }
        //xử lí khi tua 
        progress.oninput = function () {  //.oniinput giúp fix bug giật giật của progress
            audio.currentTime = this.value * audio.duration / 100;
        }
        //xử lí phím next
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
                audio.play();
                _this.render();
                _this.scrollToActiveSong();

            } else
                _this.nextSong();
            audio.play();
            _this.render();
            _this.scrollToActiveSong();

        }
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
                audio.play();
                _this.render();
                _this.scrollToActiveSong();

            } else
                _this.prevSong();
            audio.play();
            _this.render();
            _this.scrollToActiveSong();

        }
        //xử lí random bật / tắt
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        //Xử lí repeat bật/tắt
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        //Xử lí việc chọn song
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                //xu li neu chuyen bai
                if (songNode) {
                    _this.currentIndex = Number(songNode.getAttribute('data-index'))
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }
                //Xu li neu nhan vao nut option

            }
        }
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++

        if (this.currentIndex > this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length;
        }
        this.loadCurrentSong();
    },
    randomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();

    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavor: 'smooth',
                block: this.currentIndex < 1 ? 'center' : 'nearest', // xử lí việc cuộn lên cuộn xuống
            })
        }, 400)
    },
    start: function () {
        //Định nghĩa các thuộc tính trong obj
        this.defineProperties();

        //xử lí những hành vi trong DOM
        this.handleEvent();

        //Tải thông tin bài hát đầu tiên vào UI 
        this.loadCurrentSong()
        //render lại danh sách các bài hát
        this.render()

    }
}
app.start();