from __future__ import annotations

import json
from pathlib import Path


STATE_FILE = Path(__file__).resolve().parents[1] / "alerts_state.json"


def _read_state() -> dict:
    if not STATE_FILE.exists():
        return {"enabled": True}
    try:
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {"enabled": True}


def get_alerts_enabled() -> bool:
    state = _read_state()
    return bool(state.get("enabled", True))


def set_alerts_enabled(enabled: bool) -> bool:
    STATE_FILE.write_text(json.dumps({"enabled": bool(enabled)}), encoding="utf-8")
    return bool(enabled)