// map.js
// 네이버 지도 초기화 및 지도 버튼 링크를 설정합니다.

document.addEventListener('DOMContentLoaded', () => {
  const C = WEDDING_CONTENT;

  // 1. 네이버 지도 임베딩 (API)
  if (typeof naver !== 'undefined' && naver.maps && C.venueLat && C.venueLng) {
    const position = new naver.maps.LatLng(C.venueLat, C.venueLng);
    
    const mapOptions = {
      center: position,
      zoom: 15,
      minZoom: 10,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT
      },
      draggable: true,
      pinchZoom: true,
      scrollWheel: false, // 스크롤 시 지도가 확대/축소되는 것 방지
      disableKineticPan: false
    };

    const map = new naver.maps.Map('naver-map', mapOptions);

    // 마커 추가
    new naver.maps.Marker({
      position: position,
      map: map
    });
  } else {
    // API 로드 실패 시 컨테이너 숨김
    const mapContainer = document.getElementById('naver-map');
    if (mapContainer) mapContainer.style.display = 'none';
  }

  // 2. 외부 링크 버튼 설정
  const naverBtn = document.getElementById('btn-naver-map');
  const kakaoBtn = document.getElementById('btn-kakao-map');

  if (C.naverMapUrl) {
    naverBtn.href = C.naverMapUrl;
  } else {
    // URL이 없으면 주소로 검색 링크 생성
    const query = encodeURIComponent(C.venueAddress || C.venueName);
    naverBtn.href = `https://map.naver.com/v5/search/${query}`;
  }

  if (C.venueMapUrl) {
    kakaoBtn.href = C.venueMapUrl;
  } else {
    const query = encodeURIComponent(C.venueAddress || C.venueName);
    kakaoBtn.href = `https://map.kakao.com/?q=${query}`;
  }
});
