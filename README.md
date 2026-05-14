# D4 簡易換裝傷害計算機

一頁式 Diablo 4 換裝傷害比較工具。輸入「其他來源 / 舊裝 / 新裝」三欄屬性，立即看到傷害變化 %。

## 公式

```
傷害 ∝ 武器傷害
     × 主屬性
     × critMult
     × (1.2 + 易傷%)
     × (1.0 + 屬性傷害%)
     × skillMult
```

`critMult` 依「計算設定」的爆擊模式而定：

- **假設爆擊命中**（預設）：`1.5 + 爆擊傷害%`
- **期望值**：`1 + 爆擊機率 × (0.5 + 爆擊傷害%)`，其中爆擊機率 = `min(100%, 5% + 各欄爆擊機率%)`（基礎 5% 已內建）

`skillMult` 僅在開啟「技能等級乘區」時生效：

- 關閉：`1`
- 開啟：`1 + (技能等級 − 1) × 每階傷害成長%`（技能等級 = 三欄加總，rank 1 為基準）

刻意省略：職業專屬乘區、Overpower、Aspect [x] 全域倍率。

## 計算設定

| 設定 | 說明 |
|---|---|
| 爆擊計算方式 | 「假設爆擊命中」算傷害上限；「期望值」用爆擊機率算平均傷害（會多出「爆擊機率」輸入欄） |
| 技能等級乘區 | 開啟後三欄會多出「技能等級」輸入欄，計入 gear 的 +技能階造成的傷害差異 |
| 技能每階傷害成長 % | 預設 2%。實測核心/主動技能約 10%（相對 rank 1 的加法成長）、基礎技能約 1%，可自行調整 |

## 三欄輸入

| 欄位 | 內容 |
|---|---|
| 其他來源 | 角色本身 + 沒被替換的其他裝備提供的數值總和（= 把要換的那件 slot 卸下後的角色狀態） |
| 舊裝 | 要換下來的這件 |
| 新裝 | 候選的這件 |

工具會計算 `dmg(其他 + 新) / dmg(其他 + 舊) - 1`。

## 本地開發

```bash
npm install
npm run dev      # http://localhost:5173/d4-simple-gear-dmg-calc/
npm test
npm run build
```

## 部署到 GitHub Pages

倉庫包含 `.github/workflows/deploy.yml`，會在 push 到 `main` 或任何 `claude/**` 分支時自動 build & deploy。

**第一次使用需要做一次性設定：**

1. 進 GitHub 倉庫 → **Settings** → **Pages**
2. **Source** 選 **GitHub Actions**
3. 進 **Settings** → **Actions** → **General** → **Workflow permissions** 勾 **Read and write permissions**（確保部署有寫入權限）
4. push 後等 Actions 跑完（約 1–2 分鐘），訪問 `https://<你的帳號>.github.io/d4-simple-gear-dmg-calc/`

之後每次 push 都會自動重新部署。
