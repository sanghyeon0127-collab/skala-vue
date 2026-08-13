# Weather Dashboard (Vue 3 실습 프로젝트)

Vue 3 Composition API 학습 커리큘럼의 "Weather" 실습 시리즈를 단계별로 이어 붙여 만든 날씨 대시보드입니다.
Mock 데이터로 시작해 실제 OpenWeatherMap API 연동, 컴포넌트 분리, 라우팅, 전역 상태 관리, UI 라이브러리 적용까지
한 프로젝트 안에서 점진적으로 완성해 나갔습니다.

## 주요 기능

- 도시별 실시간 날씨 조회 및 검색 (한글 도시명, 즉시 필터링)
- 도시 카드 그리드 대시보드 (반응형: 화면 폭에 따라 열 개수 자동 조정)
- 도시 상세 페이지 : 현재 날씨, 24시간 예보(막대그래프 + 아이콘), 일출·일몰 시각
- 섭씨/화씨 단위 전환 (새로고침해도 유지)
- 즐겨찾기 도시 등록/해제 (새로고침해도 유지)
- 전체 도시 통계 페이지 (평균 기온, 최고/최저 기온 도시)
- 존재하지 않는 경로 접근 시 404 페이지

## 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| 프레임워크 | Vue 3 (`<script setup>`, Composition API) |
| 라우팅 | Vue Router (Lazy Loading, Dynamic Route, Catch-all Route) |
| 상태 관리 | Pinia (Setup Store 문법) |
| HTTP 통신 | Axios |
| 외부 API | [OpenWeatherMap](https://openweathermap.org/api) (현재 날씨 · 5일 예보), [sunrise-sunset.org](https://sunrise-sunset.org/api) (일출/일몰) |
| UI 라이브러리 | [Element Plus](https://element-plus.org/) |
| 유틸리티 | [VueUse](https://vueuse.org/) (`useStorage`로 localStorage 동기화) |
| 빌드 도구 | Vite |

## 프로젝트 시작하기

### 1. 패키지 설치

```sh
npm install
```

### 2. OpenWeatherMap API Key 설정

프로젝트 루트에 `.env.local` 파일을 만들고 아래처럼 본인의 API Key를 넣습니다.
(`.env.local`은 `.gitignore`에 포함되어 있어 git에 올라가지 않습니다.)

```
VITE_OPENWEATHER_API_KEY=여기에_본인의_API_Key
```

> OpenWeatherMap은 키 발급 직후 최대 2시간 정도 활성화 지연이 있을 수 있습니다.
> 401 에러가 발생하면 코드 문제가 아니라 키가 아직 활성화되지 않았을 가능성이 큽니다.

### 3. 개발 서버 실행

```sh
npm run dev
```

### 4. 빌드 / 린트

```sh
npm run build   # 프로덕션 빌드
npm run lint    # ESLint + oxlint 검사
```

## 폴더 구조

```
src/
├── App.vue                  # Navigation Bar + RouterView(+페이지 전환 애니메이션)
├── main.js                  # Pinia / Vue Router / Element Plus 전역 등록
├── router/
│   └── index.js             # 라우트 정의 (전부 Lazy Loading), Catch-all Route
├── api/
│   ├── weatherApi.js        # OpenWeatherMap 현재 날씨 / 예보 API 호출
│   └── sunApi.js             # sunrise-sunset.org API 호출
├── data/
│   └── cityCatalog.js       # 조회 대상 도시 목록 (id / 한글명 / OWM 조회용 영문명)
├── stores/
│   ├── configStore.js       # 날씨 단위(섭씨/화씨) 설정 (localStorage 동기화)
│   ├── favoriteStore.js     # 즐겨찾기 도시 목록 (localStorage 동기화)
│   └── weatherStore.js      # Axios로 받아온 실시간 날씨 목록 캐시
├── components/exercise/     # 재사용 UI 부품
│   ├── BaseDashboardCard.vue
│   ├── SearchBar.vue
│   ├── WeatherCard.vue
│   ├── WeatherSummary.vue
│   ├── ForecastChart.vue
│   └── UnitToggler.vue
└── views/
    ├── WeatherHomeView.vue    # '/' 메인 대시보드
    ├── WeatherDetailView.vue  # '/weather/:cityId' 도시 상세
    ├── WeatherAboutView.vue   # '/about' 소개
    ├── WeatherStatsView.vue   # '/stats' 전체 통계
    ├── WeatherFavoritesView.vue # '/favorites' 즐겨찾기한 도시 모아보기
    └── NotFoundView.vue       # 그 외 모든 경로 (404)
```

## 실습 진행 단계

프로젝트는 아래 순서로 기능을 하나씩 얹으며 완성했습니다.

1. **Weather Mockup** — v-for/v-if/v-model 등 기본 디렉티브로 정적 Mock 데이터를 화면에 렌더링
2. **Weather Composition** — computed/watch/watchEffect로 검색·통계 로직을 반응형으로 전환
3. **Weather Component** — BaseDashboardCard / SearchBar / WeatherCard로 컴포넌트 분리 (props, emit, slot)
4. **Weather Router** — Vue Router 도입, 페이지를 View로 분리하고 동적 라우팅(`/weather/:cityId`) 적용
5. **Weather Store** — Pinia 도입, 단위 설정(configStore) 및 즐겨찾기(favoriteStore) 전역 상태화
6. **Weather Axios** — Mock 데이터를 OpenWeatherMap 실제 API 호출로 교체, 예보/일출일몰 API 추가 연동
7. **Weather UI Library** — Element Plus 적용 (el-card, el-input, el-switch, el-tag, el-statistic 등)
8. **Weather Refinement** — VueUse로 상태 영속화(localStorage), 공통 색상 변수 정리, 페이지 전환 애니메이션 추가

## 알아두면 좋은 점

- API Key는 Vite의 `VITE_` 접두사 환경변수 특성상 브라우저 번들에 그대로 노출됩니다. 학습 목적의 실습 범위에서는
  문제 없지만, 실제 서비스라면 백엔드 뒤에 키를 숨기고 프론트는 자체 서버로만 요청하는 구조가 안전합니다.
- `weatherStore`는 도시 목록을 한 번 불러오면 캐시해두고 재요청하지 않습니다. 최신 데이터를 다시 받고 싶다면
  새로고침이 필요합니다.
