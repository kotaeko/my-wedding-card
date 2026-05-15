// map.js
// 카카오맵 초기화 및 외부 지도 버튼 링크를 설정합니다.

document.addEventListener('DOMContentLoaded', () => {
  const C = WEDDING_CONTENT;

  // 1. 카카오맵 임베딩 (API)
  if (typeof kakao !== 'undefined' && kakao.maps && C.venueLat && C.venueLng) {
    kakao.maps.load(() => {
      const mapContainer = document.getElementById('kakao-map');
      if (!mapContainer) return;

      const mapOption = { 
        center: new kakao.maps.LatLng(C.venueLat, C.venueLng), // 지도의 중심좌표
        level: 4 // 지도의 확대 레벨
      };

      const map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

      // 마커를 생성합니다
      const markerPosition  = new kakao.maps.LatLng(C.venueLat, C.venueLng); 
      const marker = new kakao.maps.Marker({
          position: markerPosition
      });

      // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(map);

      // 스크롤 시 지도가 확대/축소 되는 것을 방지
      map.setZoomable(false);
    });
  } else {
    const mapContainer = document.getElementById('kakao-map');
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
