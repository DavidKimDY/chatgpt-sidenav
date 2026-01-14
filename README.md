# 크롬 익스텐션 기본 프로젝트

## 설치 방법

1. 크롬 브라우저에서 `chrome://extensions/` 접속
2. 우측 상단의 "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. 이 프로젝트 폴더 선택

## 파일 구조

- `manifest.json` - 익스텐션 설정 파일
- `popup.html` - 팝업 HTML
- `popup.js` - 팝업 JavaScript
- `styles.css` - 스타일시트
- `icons/` - 아이콘 폴더

## 아이콘 추가

`icons` 폴더에 다음 크기의 아이콘을 추가하세요:
- icon16.png (16x16)
- icon48.png (48x48)
- icon128.png (128x128)

아이콘이 없어도 익스텐션은 작동하지만, 기본 아이콘이 표시됩니다.
