# CS Atlas — 資工互動學習平台

一個用繁體中文學習資料結構、C 語言記憶體、演算法、作業系統、網路概論和 Wi-Fi 的**純前端互動學習網站**。課程以 JSON 管理；`AGENTS.md` 規範 AI 如何持續新增課程與互動計算器。

## 功能

- 6 大主分類、35 個子分類、8 篇可瀏覽的 MVP 課程（其餘分類顯示「規劃中」，不冒充已上線）。
- 共用課程模板：文章、概念示意圖、程式碼、表格、公式、重點整理、問答解析、延伸閱讀。
- Stack/Queue 操作、二分搜尋步進、記憶體區段示意、Process/Thread 示意、OSI 七層互動圖。
- 六種即時公式計算：FSPL、RSSI 近似、熱雜訊、SINR、Shannon 理論容量、OFDM PHY 速率教學模型。
- 網站搜尋、子分類瀏覽、手機版排版、支援 GitHub Pages 子路徑。
- 沒有依賴、沒有後端、沒有追蹤或外部 API。

## 本機啟動

因為網站透過 `fetch()` 讀取 JSON，**不要直接雙擊 `index.html` 使用 `file://` 開啟**。

```bash
cd cs-learning-platform
python -m http.server 8000
```

瀏覽 `http://localhost:8000`。

也可以使用 VS Code 的 Live Server。Python 只用於**開發時的靜態伺服器**，部署後不需要 Python。

## 發布至 GitHub Pages

1. 在 GitHub 新增公開 repository（如 `cs-learning-platform`）。
2. 將壓縮檔的 `cs-learning-platform/` **資料夾內所有檔案**上傳到 repository 根目錄（`index.html` 應位於根目錄）。
3. 在 Repository → Settings → Pages → Build and deployment，選擇 `Deploy from a branch`，Branch 選 `main`、Folder 選 `/(root)`，儲存。
4. 等待 GitHub Pages 部署完成，在 Pages 顯示的網址驗證首頁、分類、課程直連及計算器。
5. 專案頁址通常為 `https://<username>.github.io/<repo>/`，以 GitHub Pages 顯示的正式網址為準。

## 架構

```text
AGENTS.md                      AI 代理規範（含互動計算器規則）
index.html                     網站首頁
categories/index.html          分類頁（?id=<category>）
topics/index.html              共用教學頁（?id=<lesson>）
docs/index.html                可瀏覽的網頁文件
css/                           共用樣式
js/app.js                      首頁、分類頁
js/catalog.js                  載入資料、網址與安全 DOM helper
js/lesson-renderer.js          共用文章渲染器
js/components/                 Quiz、Diagram、Demo、Calculator
data/categories.json           六大分類
data/subcategories.json        35 個子分類（單一權威清單）
data/topics.json               已上線的文章索引
data/lessons/*.json            各篇完整文章資料
tests.mjs                      Node.js 內建 assert 驗證 JSON 與計算邏輯
```

## 新增課程的步驟

1. 閱讀 `AGENTS.md`。從 `subcategories.json` 選擇符合的 `category` 與 `subcategory`。
2. 複製一份 `data/lessons/` 已上線的 JSON，換成**唯一**文章 `id`。用 `sections` 撰寫文章，保留 `takeaways`、`quiz`。
3. 更新 `data/topics.json`，加入同一 `id` 的文章摘要、分類、子分類、難度與關鍵字。首頁和分類頁會**自動**顯示文章。
4. 新增的可計算公式必須提供對應的計算器。在 `js/components/calculator.js` 增加純計算函式、介面定義、單位與有效範圍，在 `tests.mjs` 增加測試。
5. 若使用新型互動區塊，更新共用 renderer/components 而不是複製整頁 HTML。
6. 更新 README / docs / GitHub Wiki 文件，並重新檢查連結、操作與行動裝置畫面。

## 驗證

```bash
node tests.mjs
```

不需要 npm 安裝或打包工具。測試涵蓋資料結構一致性、文章公式區塊有計算器，以及主要物理公式的數值驗證。

## 計算模型的限制

- **FSPL** 使用 MHz / km 常數 32.44 的常見表示形式。近似模型不等於室內量測。
- **RSSI** 頁面展示簡化接收功率鏈路預算，硬體 RSSI 定義與讀值會不同。
- **Thermal noise** 使用約 290 K 時 −174 dBm/Hz 近似。
- **SINR** 需將 dBm 轉為 mW 後先加總干擾與雜訊；預設只輸入「總干擾」。
- **Shannon** 為理論容量上界，**不是** Wi-Fi 或 IP 實際 Throughput。
- **OFDM PHY** 計算使用使用者指定子載波數、QAM 每子載波位元、編碼率、空間串流與符號時間；預設是 HE 類似場景示例，非標準速率自動判定，也不含協定開銷。
- Wi-Fi 6/7 的設備功能及頻譜使用視標準、地區、硬體與配置而定。

## 參考資料

- ITU-R P.525-3 — [Calculation of free-space attenuation](https://www.itu.int/dms_pubrec/itu-r/rec/p/R-REC-P.525-3-201611-S%21%21PDF-E.pdf)
- [Wi-Fi Alliance — Discover Wi-Fi](https://www.wi-fi.org/discover-wi-fi)

## GitHub Wiki 建議頁面

- Home：專案介紹、網站網址、教學路線
- Architecture：架構、JSON Schema 與 renderer
- Adding-Lessons：如何新增文章、公式、計算器及測試
- Content-Guidelines：資料正確性、數學假設、引用來源
- Deployment：GitHub Pages 發布及測試步驟

GitHub Wiki 需要在 GitHub Repository 建立後啟用；本 ZIP 提供 `docs/` 網頁文件與上述建議大綱，不會自動替你建立遠端 Wiki。
