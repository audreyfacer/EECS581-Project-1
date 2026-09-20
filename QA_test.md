# Minesweeper QA Test Cases

Test date: September 20, 2026

| ID | Test | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| QA-01 | Mine amount | Selected mine count is used | Correct mine count displayed | Pass |
| QA-02 | Board size | Board is 10x10 | 10x10 board displayed | Pass |
| QA-03 | First click | First click area is safe | Safe area confirmed | Pass |
| QA-04 | Flag cell | Flag can be added/removed | Flag worked correctly | Pass |
| QA-05 | Flagged cell | Flagged cell cannot open | Cell stayed flagged | Pass |
| QA-06 | Empty cell | Nearby safe cells open | Cells opened correctly | Pass |
| QA-07 | Click mine | GAME OVER appears | GAME OVER displayed | Pass |
| QA-08 | Win game | YOU WIN appears | YOU WIN displayed | Pass |
| QA-09 | New game | Game resets | Game reset correctly | Pass |
| QA-10 | Stress test | Game remains responsive | No crashes or errors | Pass |
| QA-11 | Mine numbers | Numbers match nearby mines | Numbers were correct | Pass |
| QA-12 | Mine limits | Slider stays between 10–20 | Limits worked correctly | Pass |
| QA-13 | Flag revealed cell | Revealed cell cannot be flagged | Cell stayed revealed | Pass |
| QA-14 | Game ended | Board cannot change | Board stayed unchanged | Pass |

## Additional Finding

**Flag-limit issue:** The game allows more flags than the selected number of mines. For example, a 15-mine game allows 16+ flags. This may need to be fixed depending on the requirements.