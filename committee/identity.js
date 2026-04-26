/**
 * Committee Identity — per-user token separation
 * Captain = Pepe (PIN: AC2026), Candidate = Agathe (PIN: PANDA2026)
 *
 * Include this script BEFORE any inline token scripts on committee pages.
 * Provides window.CommitteeIdentity with:
 *   getPin()        — returns the active user's PIN
 *   getStorageKey() — returns the active localStorage key
 *   getPlayer()     — 'captain' | 'candidate' (or null if not set)
 *   whenReady(fn)   — calls fn immediately if identity known, else after modal is answered
 */
(function () {
  var CAPTAIN_PIN    = 'AC2026';
  var CANDIDATE_PIN  = 'PANDA2026';
  var CAPTAIN_KEY    = 'ipsc_tokens_ac2026';
  var CANDIDATE_KEY  = 'ipsc_tokens_panda2026';

  var _ready         = false;
  var _queue         = [];

  function getPlayer()     { return sessionStorage.getItem('committee_player'); }
  function getPin()        { return getPlayer() === 'candidate' ? CANDIDATE_PIN : CAPTAIN_PIN; }
  function getStorageKey() { return getPlayer() === 'candidate' ? CANDIDATE_KEY  : CAPTAIN_KEY; }

  function _flush() {
    _ready = true;
    var q = _queue.slice();
    _queue = [];
    for (var i = 0; i < q.length; i++) {
      try { q[i](); } catch (e) {}
    }
  }

  function whenReady(fn) {
    if (_ready || getPlayer()) {
      _ready = true;
      try { fn(); } catch (e) {}
    } else {
      _queue.push(fn);
    }
  }

  function _buildModal() {
    var overlay = document.createElement('div');
    overlay.id = 'committee-identity-overlay';
    overlay.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:9999',
      'background:rgba(0,0,0,0.93)',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'
    ].join(';');

    overlay.innerHTML = [
      '<div style="background:#0d0d0d;border:1px solid #2a2a2a;border-radius:16px;padding:44px 36px;',
      'text-align:center;max-width:340px;width:90%;">',
      '<div style="font-size:11px;letter-spacing:3px;color:#555;text-transform:uppercase;margin-bottom:16px;">',
      'Committee Access</div>',
      '<div style="font-size:26px;font-weight:700;color:#fff;margin-bottom:8px;">Who are you?</div>',
      '<div style="font-size:14px;color:#555;margin-bottom:36px;">Select your identity to continue</div>',
      '<div style="display:flex;gap:12px;justify-content:center;">',
      '<button id="id-btn-captain" style="flex:1;padding:16px 0;background:#E14B87;color:#fff;',
      'border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;',
      'letter-spacing:1px;">Captain</button>',
      '<button id="id-btn-candidate" style="flex:1;padding:16px 0;background:#111;color:#e0e0e0;',
      'border:1px solid #333;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;',
      'letter-spacing:1px;">Candidate</button>',
      '</div></div>'
    ].join('');

    document.body.appendChild(overlay);

    document.getElementById('id-btn-captain').addEventListener('click', function () {
      sessionStorage.setItem('committee_player', 'captain');
      overlay.remove();
      _flush();
    });
    document.getElementById('id-btn-candidate').addEventListener('click', function () {
      sessionStorage.setItem('committee_player', 'candidate');
      overlay.remove();
      _flush();
    });
  }

  function _showModal() {
    // Small delay so the page body exists before we append
    if (document.body) {
      _buildModal();
    } else {
      document.addEventListener('DOMContentLoaded', _buildModal);
    }
  }

  // If player already selected in this session, mark ready immediately
  if (getPlayer()) {
    _ready = true;
  } else {
    // Show modal when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', _showModal);
    } else {
      setTimeout(_showModal, 0);
    }
  }

  window.CommitteeIdentity = {
    getPin:        getPin,
    getStorageKey: getStorageKey,
    getPlayer:     getPlayer,
    whenReady:     whenReady
  };
}());
