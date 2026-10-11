## Failing checks on main (heal exhausted)

Детерминированный heal не исцелил чек-сьют (run <RUN_ID>).

```
<содержимое artifact autofix-diagnosis: упавшие workflow, имена тестов,
классификация>
```

Автоматика:
1. Повесьте label `ai-fix` — сработает полный агент (Gemini + Groq ансамбль)
   и откроет draft PR.
2. Если и агент не справится — `ai-fix-super` (SUPER-режим, до 8 итераций
   с локальным прогоном checks в песочнице).
3. Контекст для моделей: `docs/ai/failure_patterns.md`.

Не трогать: contracts/, .github/workflows/ — по конституции autonomy.json
это классы «человек».
