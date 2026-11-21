# 에셋·폰트 출처 (CREDITS)

게임에 들어가는 외부 자료와 라이선스를 모두 여기에 적는다. 새 자료를 넣으면 같은 형식으로 한 줄씩 추가한다.
허용 라이선스: 코드 MIT·Apache-2.0, 폰트 SIL OFL 1.1, 이미지·모델·소리 CC0 (라이선스 없는 자료는 쓰지 않는다).

## 폰트 (`public/fonts/`)
| 파일 | 이름 | 저작권 | 라이선스 | 원본 | 용도 |
|---|---|---|---|---|---|
| `Jua-Regular.subset.woff2` | Jua (주아) | Copyright 2018 The Jua Project Authors (우아한형제들) | SIL OFL 1.1 — `public/fonts/OFL-Jua.txt` | Google Fonts (https://fonts.google.com/specimen/Jua) | 제목·숫자·버튼·간판 |
| `Pretendard-Regular.subset.woff2`, `Pretendard-Bold.subset.woff2` | Pretendard | Copyright (c) 2021 Kil Hyung-jin, Reserved Font Name "Pretendard" | SIL OFL 1.1 — `public/fonts/OFL-Pretendard.txt` | https://github.com/orioncactus/pretendard | 본문 |

- 두 폰트 모두 앱 용량을 줄이려고 게임에 쓰는 글자만 남긴 부분 집합(subset)을 woff2 로 넣었다. OFL 은 앱에 넣어 배포·상업적 이용을 허용하며, 폰트 파일만 따로 판매하는 것은 금지한다. 라이선스 전문(OFL-*.txt)을 함께 배포한다.
- Pretendard 는 "Reserved Font Name" 이 있어, 원본을 고친 파일을 다시 "Pretendard" 라는 이름의 폰트로 배포하면 안 된다. 게임 안에서 글자를 표시하는 용도(앱 내장)는 문제없으나, 출시 전에 원저작자가 배포하는 공식 서브셋(웹폰트 dynamic-subset) 파일로 바꾸거나 서브셋 파일의 내부 이름 처리를 한 번 더 확인한다.

## 3D·텍스처·아이콘
- 외부 파일 없음. 상품(몽글곰·달토끼·까봉이)·기계·집게 모델은 코드로 만든다 (`src/visual/`).
- 간판·뒷판·배경·펠트·유리 텍스처는 캔버스로 그린다 (`src/visual/textures.js`). 한국 테마는 단청·청사초롱 색 모티프, 기와지붕·보름달 실루엣으로 표현하고 국기는 쓰지 않는다.
- 환경광은 three.js 내장 `RoomEnvironment` (MIT).
- UI 아이콘(코인·집게·시계·톱니·시점·별)은 `index.html` 안의 직접 그린 SVG.

## 소리
- 외부 음원 파일 없음. 배경음악(오락실풍 칩튠 8마디 루프)과 효과음(코인·집게 이동·하강·닫힘·상승·획득·탭)은 **Web Audio API 로 코드에서 직접 합성**한다 (`src/audio.js`). 멜로디·베이스·드럼 패턴 모두 이 프로젝트에서 새로 작성한 오리지널이라 저작권·라이선스 걱정이 없다. (나중에 외부 소리 파일을 쓰게 되면 CC0 만, 여기에 출처를 적는다.)

## 라이브러리 (npm, 참고)
| 이름 | 라이선스 |
|---|---|
| three | MIT |
| @dimforge/rapier3d-compat | Apache-2.0 |
| @capacitor/core, @capacitor/android, @capacitor/cli | MIT |
| vite (개발 도구, 앱에 포함 안 됨) | MIT |

## 캐릭터
- 몽글곰·달토끼·까봉이는 이 프로젝트의 오리지널 캐릭터(가칭)다. AI 이미지 시안을 쓰게 되면 생성 도구·날짜를 여기에 적는다.
