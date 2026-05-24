// map.js
// 카카오맵 초기화 및 외부 지도 버튼 링크를 설정합니다.

document.addEventListener('DOMContentLoaded', () => {
  const C = WEDDING_CONTENT;

  // 1. 카카오맵 임베딩 (API)
  const mapContainer = document.getElementById('kakao-map');
  
  if (typeof kakao !== 'undefined') {
    kakao.maps.load(() => {
      if (!mapContainer || !C.venueLat || !C.venueLng) return;

      // 맵이 그려지기 전에 혹시 남아있을 수 있는 에러 텍스트를 제거
      mapContainer.innerHTML = '';

      // 카카오맵 장소 검색 서비스 객체를 생성합니다
      const ps = new kakao.maps.services.Places();

      // 키워드로 장소를 검색합니다 (정확한 핀 위치를 위해)
      ps.keywordSearch('까사그랑데센트로', function(data, status) {
          let coords;
          if (status === kakao.maps.services.Status.OK) {
              // 검색된 장소의 좌표를 사용합니다
              coords = new kakao.maps.LatLng(data[0].y, data[0].x);
          } else {
              // 검색 실패 시 fallback으로 기존 좌표 사용
              coords = new kakao.maps.LatLng(C.venueLat, C.venueLng);
          }

          const mapOption = { 
            center: coords, // 지도의 중심좌표
            level: 4 // 지도의 확대 레벨
          };

          const map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

          // 마커를 생성합니다
          const marker = new kakao.maps.Marker({
              position: coords,
              map: map
          });

          // 초기 상태: 지도 드래그 및 확대/축소 차단 (모바일 스크롤 간섭 방지)
          map.setDraggable(false);
          map.setZoomable(false);

          // 지도 조작 활성화 관련 요소 제어
          const mapOverlay = document.getElementById('map-overlay');
          const lockBtn = document.getElementById('btn-map-lock');

          if (mapOverlay) {
            mapOverlay.addEventListener('click', () => {
              mapOverlay.classList.add('hide');
              map.setDraggable(true);
              map.setZoomable(true); // 조작 활성화 시에는 확대/축소 가능하게
              if (lockBtn) {
                lockBtn.style.display = 'flex';
              }
            });
          }

          if (lockBtn) {
            lockBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              mapOverlay.classList.remove('hide');
              map.setDraggable(false);
              map.setZoomable(false);
              lockBtn.style.display = 'none';
              
              // 원래 좌표(Casa Grande Centro 위치)로 지도 중심 재정렬
              map.setCenter(coords);
            });
          }
      });
    });
  } else {
    // API 로드 실패 시 에러 텍스트 표시
    if (mapContainer) {
      mapContainer.style.display = 'flex';
      mapContainer.style.alignItems = 'center';
      mapContainer.style.justifyContent = 'center';
      mapContainer.style.fontSize = '12px';
      mapContainer.style.color = 'var(--color-text-muted)';
      mapContainer.innerText = '카카오맵을 불러올 수 없습니다. 도메인 설정을 확인해주세요.';
    }
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
