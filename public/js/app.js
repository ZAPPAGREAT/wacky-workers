// ======== 改良版 app.js ========

const fixSectionHeight = () => {
  const baseHeight = document.documentElement.clientHeight;
  const width = window.innerWidth;

  document.querySelectorAll('.pinned-section').forEach(sec => {
    // Use a single, large multiplier for all devices up to 1024px
    const multiplier = width <= 1024 ? 3.0 : 3.0;
    sec.style.height = `${baseHeight * multiplier}px`;
    sec.style.overflow = "visible";
  });

  document.querySelectorAll('.member-container').forEach(container => {
    container.style.height = `${baseHeight}px`;
    // Remove device-specific layout changes for now
    container.style.justifyContent = 'center';
    container.style.paddingTop = '0';
  });

  document.querySelectorAll('.member-image-container').forEach(imgBox => {
    imgBox.style.height = 'auto';
    imgBox.style.maxHeight = `${window.innerHeight}px`;
  });
};

window.addEventListener('resize', fixSectionHeight);
fixSectionHeight();
  
// --- ① vh補正処理（スマホのアドレスバー対策） ---
const setVh = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
window.addEventListener('resize', setVh);
setVh(); // 初回実行
  
  // --- ② スクロールアニメーション更新制御 ---
  let ticking = false;
  
  // スクロール進行に使う基準高さを固定化（innerHeightは使わない）
  const baseHeight = document.documentElement.clientHeight;
  
  // メインのスクロール処理
  function updateScrollEffect() {
    // タイトルセクション
    const titleSection = document.querySelector("#title-section");
    const titleImage = document.querySelector("#title-section .console");
  
    if (titleSection && titleImage) {
      const rect = titleSection.getBoundingClientRect();
      const scrollProgress = Math.min(
        Math.max((-rect.top + baseHeight * 0.1) / (baseHeight * 1.1), 0),
        1
      );
  
      const scale = 0.5 + scrollProgress * 3.5;
      const rotation = scrollProgress * 720;
      const opacity = Math.min(scrollProgress * 2, 1);
  
      titleImage.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
      titleImage.style.opacity = opacity;
    }
  
    // 各メンバーセクションの処理
    const memberSections = [
      "#member1-section",
      "#member2-section",
      "#member3-section",
      "#member4-section",
      "#member5-section"
    ];
  
    memberSections.forEach(sectionId => {
      const section = document.querySelector(sectionId);
      const image = document.querySelector(`${sectionId} .console`);
      const infoFrame = document.querySelector(`${sectionId} .info-image`) ||
                        document.querySelector(`${sectionId} .info-frame`);
  
      if (section && image) {
        const rect = section.getBoundingClientRect();
        const scrollProgress = Math.min(Math.max((baseHeight / 2 - rect.top) / baseHeight, 0), 1);
  
        // 画像の移動（前半）
        if (scrollProgress <= 0.5) {
          const progress = scrollProgress * 2;
          const translateX = 100 - progress * 100;
          const opacity = Math.min(progress * 2, 1);
          // image.style.transform = `translateX(${translateX}%)`;
          image.style.opacity = opacity;
        } else {
          image.style.transform = `translateX(0vw)`;
          image.style.opacity = 1;
        }
  
        // 枠の移動（後半）
        if (scrollProgress > 0.3 && infoFrame) {
          const frameProgress = Math.min((scrollProgress - 0.3) / 0.4, 1);
          const frameTranslateX = -100 + frameProgress * 100;
          const frameOpacity = Math.min(frameProgress * 2, 1);
          infoFrame.style.transform = `translateX(${frameTranslateX}%)`;
          infoFrame.style.opacity = frameOpacity;
        }
      }
    });
  
    ticking = false;
  }
  
  // --- スクロール監視をフレームループ化 ---
let lastScrollY = window.scrollY;

function loop() {
  const currentY = window.scrollY;

  // スクロール位置が変わっていたら更新
  if (Math.abs(currentY - lastScrollY) > 0.5) {
    updateScrollEffect();
    lastScrollY = currentY;
  }

  requestAnimationFrame(loop);
}

loop(); // 初回実行
