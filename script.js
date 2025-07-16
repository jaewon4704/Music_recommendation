// ✅ 기분별 음악 데이터 (2000~2020대 섞임)
const musicData = {
  행복: [
    { title: "Happy - Pharrell Williams", year: 2013, link: "https://www.youtube.com/watch?v=ZbZSe6N_BXs", img: "https://i.ytimg.com/vi/ZbZSe6N_BXs/hqdefault.jpg" },
    { title: "Good Day - IU", year: 2010, link: "https://www.youtube.com/watch?v=jeqdYqsrsA0", img: "https://i.ytimg.com/vi/jeqdYqsrsA0/hqdefault.jpg" },
    { title: "Shake It Off - Taylor Swift", year: 2014, link: "https://www.youtube.com/watch?v=nfWlot6h_JM", img: "https://i.ytimg.com/vi/nfWlot6h_JM/hqdefault.jpg" }
  ],
  설렘: [
    { title: "All of Me - John Legend", year: 2013, link: "https://www.youtube.com/watch?v=450p7goxZqg", img: "https://i.ytimg.com/vi/450p7goxZqg/hqdefault.jpg" }
  ],
  신남: [
    { title: "Uptown Funk - Mark Ronson ft. Bruno Mars", year: 2014, link: "https://www.youtube.com/watch?v=OPf0YbXqDm0", img: "https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg" },
    { title: "Dynamite - BTS", year: 2020, link: "https://www.youtube.com/watch?v=gdZLi9oWNZg", img: "https://i.ytimg.com/vi/gdZLi9oWNZg/hqdefault.jpg" },
    { title: "Can't Stop the Feeling! - Justin Timberlake", year: 2016, link: "https://www.youtube.com/watch?v=ru0K8uYEZWw", img: "https://i.ytimg.com/vi/ru0K8uYEZWw/hqdefault.jpg" }
  ],
  차분: [
    { title: "River Flows in You - Yiruma", year: 2009, link: "https://www.youtube.com/watch?v=7maJOI3QMu0", img: "https://i.ytimg.com/vi/7maJOI3QMu0/hqdefault.jpg" },
    { title: "Weightless - Marconi Union", year: 2011, link: "https://www.youtube.com/watch?v=UfcAVejslrU", img: "https://i.ytimg.com/vi/UfcAVejslrU/hqdefault.jpg" }
  ],
  편안: [
    { title: "Thinking Out Loud - Ed Sheeran", year: 2014, link: "https://www.youtube.com/watch?v=lp-EO5I60KA", img: "https://i.ytimg.com/vi/lp-EO5I60KA/hqdefault.jpg" }
  ],
  슬픔: [
    { title: "Someone Like You - Adele", year: 2011, link: "https://www.youtube.com/watch?v=hLQl3WQQoQ0", img: "https://i.ytimg.com/vi/hLQl3WQQoQ0/hqdefault.jpg" }
  ],
  우울: [
    { title: "Love, Maybe - MeloMance", year: 2022, link: "https://www.youtube.com/watch?v=e1rXhFP2ybY", img: "https://i.ytimg.com/vi/e1rXhFP2ybY/hqdefault.jpg" }
  ]
};

// ✅ 즐겨찾기 목록 (LocalStorage 저장)
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
displayFavorites();

// ✅ 음악 추천 (2000~2010년대 2곡 + 2020년대 3곡)
function recommendMusic() {
  const checked = document.querySelectorAll("input[type='checkbox']:checked");
  const selectedMoods = Array.from(checked).map(input => input.value);

  if (selectedMoods.length === 0) {
    alert("기분을 하나 이상 선택하세요!");
    return;
  }

  // 선택된 기분에서 모든 곡 모으기
  let songPool = [];
  selectedMoods.forEach(mood => {
    if (musicData[mood]) songPool = songPool.concat(musicData[mood]);
  });

  if (songPool.length === 0) {
    alert("추천할 곡이 없습니다!");
    return;
  }

  // 연대별 분류
  const oldSongs = songPool.filter(song => song.year >= 2000 && song.year <= 2010);
  const newSongs = songPool.filter(song => song.year >= 2020);

  // 랜덤 뽑기 함수
  function pickRandom(pool, count) {
    const selected = [];
    const poolCopy = [...pool];
    const limit = Math.min(count, poolCopy.length);
    for (let i = 0; i < limit; i++) {
      const randomIndex = Math.floor(Math.random() * poolCopy.length);
      selected.push(poolCopy[randomIndex]);
      poolCopy.splice(randomIndex, 1);
    }
    return selected;
  }

  // 2000~2010년대 2곡 + 2020년대 3곡
  let selectedSongs = [];
  selectedSongs = selectedSongs.concat(pickRandom(oldSongs, 2));
  selectedSongs = selectedSongs.concat(pickRandom(newSongs, 3));

  // 부족하면 나머지 곡으로 채우기
  if (selectedSongs.length < 5) {
    const remaining = songPool.filter(song => !selectedSongs.includes(song));
    selectedSongs = selectedSongs.concat(pickRandom(remaining, 5 - selectedSongs.length));
  }

  displayRecommendations(selectedSongs);
}

// ✅ 추천 음악 출력
function displayRecommendations(songs) {
  const recDiv = document.getElementById("recommendations");
  recDiv.innerHTML = "";
  songs.forEach(song => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${song.img}" alt="${song.title}">
      <p>${song.title} (${song.year})</p>
      <a href="${song.link}" target="_blank">YouTube에서 듣기</a>
      <button onclick='addToFavorites(${JSON.stringify(song)})'>⭐ 즐겨찾기</button>
    `;
    recDiv.appendChild(card);
  });
}

// ✅ 즐겨찾기 추가
function addToFavorites(song) {
  if (!favorites.find(fav => fav.title === song.title)) {
    favorites.push(song);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
    alert("즐겨찾기에 추가되었습니다!");
  } else {
    alert("이미 즐겨찾기에 있습니다!");
  }
}

// ✅ 즐겨찾기 출력
function displayFavorites() {
  const favDiv = document.getElementById("favorites");
  favDiv.innerHTML = "";
  favorites.forEach(song => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${song.img}" alt="${song.title}">
      <p>${song.title} (${song.year})</p>
      <a href="${song.link}" target="_blank">YouTube에서 듣기</a>
    `;
    favDiv.appendChild(card);
  });
}