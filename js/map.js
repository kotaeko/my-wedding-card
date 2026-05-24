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
          let tipTimeout;

          // 쓸기/드래그 감지 시 팁을 스마트하게 노출하는 함수
          const showTip = () => {
            if (mapOverlay && !mapOverlay.classList.contains('hide')) {
              mapOverlay.classList.add('show-tip');
              
              // 3초 후 팁을 자동으로 서서히 숨김
              clearTimeout(tipTimeout);
              tipTimeout = setTimeout(() => {
                mapOverlay.classList.remove('show-tip');
              }, 3000);
            }
          };

          if (mapOverlay) {
            // 지도를 터치/탭하면 투명 차단막을 걷어내고 즉시 조작을 활성화합니다.
            mapOverlay.addEventListener('click', (e) => {
              e.stopPropagation();
              mapOverlay.classList.add('hide');
              mapOverlay.classList.remove('show-tip');
              clearTimeout(tipTimeout);
              map.setDraggable(true);
              map.setZoomable(true);
            });

            // 드래그(쓸기) 시도 감지 (모바일: touchmove, 데스크톱: 마우스 왼쪽 버튼 누른 채 움직임)
            mapOverlay.addEventListener('touchmove', showTip, { passive: true });
            mapOverlay.addEventListener('mousemove', (e) => {
              if (e.buttons === 1) { // 마우스 왼쪽 드래그 감지
                showTip();
              }
            });
          }

          // 지도가 활성화 상태일 때, 다시 페이지를 스크롤하거나 외부를 터치하면 지도를 자동으로 잠급니다.
          const lockMap = () => {
            if (mapOverlay && mapOverlay.classList.contains('hide')) {
              mapOverlay.classList.remove('hide');
              mapOverlay.classList.remove('show-tip');
              clearTimeout(tipTimeout);
              map.setDraggable(false);
              map.setZoomable(false);
            }
          };

          // 1. 청첩장 본문 페이지를 스크롤할 때 지도를 자동으로 다시 잠금
          const scrollWrapper = document.getElementById('letter-scroll-wrapper');
          if (scrollWrapper) {
            scrollWrapper.addEventListener('scroll', lockMap, { passive: true });
          }

          // 2. 지도 영역 외부를 터치/클릭할 때 지도를 자동으로 다시 잠금
          document.addEventListener('click', (e) => {
            const isClickInside = mapContainer.contains(e.target) || (mapOverlay && mapOverlay.contains(e.target));
            if (!isClickInside) {
              lockMap();
            }
          });
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
