// guest-upload.js
// Firebase Storage에 하객 사진을 업로드하고 실시간으로 표시합니다.
//
// Firebase 설정이 완료되지 않은 경우 이 섹션은 조용히 비활성화됩니다.

document.addEventListener('DOMContentLoaded', async () => {
  // Firebase 설정값이 비어있으면 섹션을 비활성화
  if (!FIREBASE_CONFIG.apiKey) {
    document.getElementById('upload-form').innerHTML =
      '<p class="upload-status">사진 공유 기능은 준비 중입니다.</p>';
    return;
  }

  // Firebase SDK (CDN) 동적 로드
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
  const { getStorage, ref, uploadBytesResumable, getDownloadURL } =
    await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js');
  const { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } =
    await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

  const app = initializeApp(FIREBASE_CONFIG);
  const storage = getStorage(app);
  const db = getFirestore(app);

  const nameInput   = document.getElementById('uploader-name');
  const fileInput   = document.getElementById('upload-file');
  const fileLabel   = document.getElementById('upload-file-text');
  const uploadBtn   = document.getElementById('upload-btn');
  const statusEl    = document.getElementById('upload-status');
  const guestGrid   = document.getElementById('guest-grid');
  const emptyMsg    = document.getElementById('guest-empty');

  // 파일 선택 시 파일명 표시
  fileInput.addEventListener('change', () => {
    const count = fileInput.files.length;
    fileLabel.textContent = count > 0 ? `${count}장 선택됨` : '사진 선택';
  });

  // 업로드 버튼
  uploadBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    const files = Array.from(fileInput.files);

    if (!name) {
      setStatus('이름을 입력해 주세요.', 'error'); return;
    }
    if (files.length === 0) {
      setStatus('사진을 선택해 주세요.', 'error'); return;
    }

    // 파일 검증
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setStatus('이미지 파일만 올릴 수 있습니다.', 'error'); return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setStatus(`${file.name} 파일이 20MB를 초과합니다.`, 'error'); return;
      }
    }

    uploadBtn.disabled = true;
    setStatus(`0 / ${files.length} 업로드 중...`, 'info');

    let uploaded = 0;
    for (const file of files) {
      try {
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storageRef = ref(storage, `guest-photos/${timestamp}_${safeName}`);

        await new Promise((resolve, reject) => {
          const task = uploadBytesResumable(storageRef, file);
          task.on('state_changed', null,
            reject,
            async () => {
              const url = await getDownloadURL(task.snapshot.ref);
              await addDoc(collection(db, 'guestPhotos'), {
                uploaderName: name,
                fileName: file.name,
                downloadUrl: url,
                storagePath: storageRef.fullPath,
                createdAt: serverTimestamp(),
              });
              resolve();
            }
          );
        });

        uploaded++;
        setStatus(`${uploaded} / ${files.length} 완료`, 'info');
      } catch (err) {
        console.error('업로드 실패:', err);
        setStatus(`업로드 중 오류가 발생했습니다.`, 'error');
        uploadBtn.disabled = false;
        return;
      }
    }

    setStatus(`${files.length}장이 성공적으로 올라갔습니다! 감사합니다 💕`, 'success');
    nameInput.value = '';
    fileInput.value = '';
    fileLabel.textContent = '사진 선택';
    uploadBtn.disabled = false;
  });

  // 실시간으로 하객 사진 표시
  const q = query(collection(db, 'guestPhotos'), orderBy('createdAt', 'desc'));
  onSnapshot(q, snapshot => {
    guestGrid.innerHTML = '';
    if (snapshot.empty) {
      emptyMsg.style.display = 'block';
      return;
    }
    emptyMsg.style.display = 'none';

    snapshot.forEach(doc => {
      const data = doc.data();
      const item = document.createElement('div');
      item.className = 'gallery-item guest-item';

      const img = document.createElement('img');
      img.src = data.downloadUrl;
      img.alt = `${data.uploaderName}님의 사진`;
      img.loading = 'lazy';

      const caption = document.createElement('p');
      caption.className = 'guest-item-name';
      caption.textContent = data.uploaderName;

      item.appendChild(img);
      item.appendChild(caption);
      guestGrid.appendChild(item);

      img.addEventListener('click', () => {
        if (window.openLightbox) openLightbox(data.downloadUrl, data.uploaderName);
      });
    });
  });

  function setStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = `upload-status ${type}`;
  }
});
