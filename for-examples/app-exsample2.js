// スクロールアニメーション制御（app-example.jsのアプローチ）
let ticking = false;

function updateScrollEffect() {
    // タイトルセクションのアニメーション
    const titleSection = document.querySelector("#title-section");
    const titleImage = document.querySelector("#title-section .console");
    
    if (titleSection && titleImage) {
        const rect = titleSection.getBoundingClientRect();
        const scrollProgress = Math.min(Math.max(-rect.top / window.innerHeight, 0), 1);
        
        // 画像をズーム＋回転＋フェード
        const scale = 0.5 + scrollProgress * 3.5; // 0.5から4.0にスケール
        const rotation = scrollProgress * 720;  // 720度回転
        const opacity = Math.min(scrollProgress * 2, 1); // フェードイン
        
        titleImage.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        titleImage.style.opacity = opacity;
    }
    
    // 全メンバーセクションのアニメーション
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
        const infoFrame = document.querySelector(`${sectionId} .info-image`) || document.querySelector(`${sectionId} .info-frame`);
        const memberName = document.querySelector(`${sectionId} .member-name`);
        const memberDescription = document.querySelector(`${sectionId} .member-description`);
        
        if (section && image) {
            const rect = section.getBoundingClientRect();
            const scrollProgress = Math.min(Math.max(-rect.top / window.innerHeight, 0), 1);
            
            // 画像の右端から中央への移動（前半50%）
            if (scrollProgress <= 0.5) {
                const imageProgress = scrollProgress * 2; // 0-0.5を0-1に変換
                const translateX = 100 - imageProgress * 100; // 100vwから0vwに移動
                const opacity = Math.min(imageProgress * 2, 1); // フェードイン
                
                image.style.transform = `translateX(${translateX}vw)`;
                image.style.opacity = opacity;
            } else {
                // 画像を中央に固定
                image.style.transform = `translateX(0vw)`;
                image.style.opacity = 1;
            }
            
            // 枠の左端から中央への移動（後半50%）
            if (scrollProgress > 0.3 && infoFrame) {
                const frameProgress = Math.min((scrollProgress - 0.3) / 0.4, 1); // 0.3-0.7を0-1に変換
                const frameTranslateX = -100 + frameProgress * 100; // -100vwから0vwに移動
                const frameOpacity = Math.min(frameProgress * 2, 1); // フェードイン
                
                infoFrame.style.transform = `translateX(${frameTranslateX}vw)`;
                infoFrame.style.opacity = frameOpacity;
                
                // テキストの順次表示
                if (frameProgress > 0.5 && memberName) {
                    const textProgress = Math.min((frameProgress - 0.5) / 0.5, 1); // 0.5-1.0を0-1に変換
                    
                    // 名前の表示
                    memberName.style.opacity = Math.min(textProgress * 2, 1);
                    memberName.style.transform = `translateY(${20 - textProgress * 20}px)`;
                    
                    // 説明文の表示（少し遅れて）
                    if (textProgress > 0.3 && memberDescription) {
                        const descProgress = Math.min((textProgress - 0.3) / 0.7, 1);
                        memberDescription.style.opacity = Math.min(descProgress * 2, 1);
                        memberDescription.style.transform = `translateY(${20 - descProgress * 20}px)`;
                    }
                }
            }
        }
    });
    
    ticking = false;
}

window.addEventListener("scroll", () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffect);
        ticking = true;
    }
});

// メンバーセクションのアニメーション
function animateMemberSections() {
    const memberSections = document.querySelectorAll('.member-section');
    
    memberSections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // セクションが画面に入った時の処理
        if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
            animateMemberContent(section, index);
        }
    });
}

// 個別メンバーコンテンツのアニメーション
function animateMemberContent(section, index) {
    const image = section.querySelector('.member-image');
    const frame = section.querySelector('.info-frame');
    const name = section.querySelector('.member-name');
    const description = section.querySelector('.member-description');
    
    if (!image || !frame || !name || !description) return;
    
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
    
    // 画像のアニメーション（右から流れてくる）
    if (progress > 0.2) {
        image.style.transform = 'translateX(0)';
        image.style.opacity = '1';
        image.classList.add('animate');
    }
    
    // フレームのアニメーション（左から流れてくる）
    if (progress > 0.4) {
        frame.style.transform = 'translateX(0)';
        frame.style.opacity = '1';
        frame.classList.add('animate');
    }
    
    // テキストの順次表示
    if (progress > 0.6) {
        name.style.opacity = '1';
        name.style.transform = 'translateY(0)';
        name.classList.add('animate');
    }
    
    if (progress > 0.8) {
        description.style.opacity = '1';
        description.style.transform = 'translateY(0)';
        description.classList.add('animate');
    }
    
    // スクロール終了時の退場アニメーション
    if (progress > 0.95) {
        animateExit(section);
    }
}

// 退場アニメーション
function animateExit(section) {
    const image = section.querySelector('.member-image');
    const frame = section.querySelector('.info-frame');
    
    if (image && frame) {
        image.classList.add('exit');
        frame.classList.add('exit');
    }
}

// メンバーセクションのアニメーションも追加
window.addEventListener("scroll", () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateScrollEffect();
            animateMemberSections();
            ticking = false;
        });
        ticking = true;
    }
});
