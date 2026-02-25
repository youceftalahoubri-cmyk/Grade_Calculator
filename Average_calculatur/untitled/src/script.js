const modules = [
    { id: 1, coef: 5, ccW: 0.4, exW: 0.6 },
    { id: 2, coef: 4, ccW: 0.5, exW: 0.5 }, // Network Foundation 1: 50/50
    { id: 3, coef: 4, ccW: 0.4, exW: 0.6 },
    { id: 4, coef: 4, ccW: 0.4, exW: 0.6 },
    { id: 5, coef: 4, ccW: 0.4, exW: 0.6 },
    { id: 6, coef: 3, ccW: 0.4, exW: 0.6 },
    { id: 7, coef: 2, ccW: 0.4, exW: 0.6 },
    { id: 8, coef: 2, ccW: 0.4, exW: 0.6 },
  ];

  function gradeClass(v) {
    if (v >= 12) return 'success';
    if (v >= 10) return 'warn';
    return 'fail';
  }

  function calculate() {
    // ── Faithful to original script.js logic ─────────────────────────
    // Empty fields → treated as 0
    // Invalid range → "Invalid" shown, module skipped (coef excluded)
    // Semester avg = total / (sum of non-invalid coefs)
    let total = 0, coefSum = 0;
    let filled = 0, passing = 0, avgs = [];

    modules.forEach(m => {
      const ccEl  = document.getElementById('cc' + m.id);
      const exEl  = document.getElementById('ex' + m.id);
      const avgEl = document.getElementById('avg' + m.id);

      // Empty → 0  (matches original: cc = isNaN(cc) ? 0 : cc)
      let cc = parseFloat(ccEl.value);
      let ex = parseFloat(exEl.value);
      cc = isNaN(cc) ? 0 : cc;
      ex = isNaN(ex) ? 0 : ex;

      // Highlight only if user actually typed an invalid value
      ccEl.classList.toggle('invalid', ccEl.value !== '' && (cc < 0 || cc > 20));
      exEl.classList.toggle('invalid', exEl.value !== '' && (ex < 0 || ex > 20));

      // Out of range → skip module (original: continue)
      if (cc < 0 || cc > 20 || ex < 0 || ex > 20) {
        avgEl.textContent = 'Invalid';
        avgEl.className = 'avg-pill error';
        return;
      }

      const avg = cc * m.ccW + ex * m.exW;
      avgEl.textContent = avg.toFixed(2);
      avgEl.className = 'avg-pill ' + gradeClass(avg);
      total    += avg * m.coef;
      coefSum  += m.coef;

      // Stats: only count rows where user typed at least one value
      if (ccEl.value !== '' || exEl.value !== '') {
        filled++;
        if (avg >= 10) passing++;
        avgs.push(avg);
      }
    });

    // ── Stats chips ───────────────────────────────────────────────────
    document.getElementById('statFilled').textContent = filled + ' / 8';
    if (avgs.length > 0) {
      document.getElementById('statPassing').textContent = passing + ' / ' + avgs.length;
      document.getElementById('statBest').textContent   = Math.max(...avgs).toFixed(2);
      document.getElementById('statWorst').textContent  = Math.min(...avgs).toFixed(2);
    } else {
      document.getElementById('statPassing').textContent = '—';
      document.getElementById('statBest').textContent    = '—';
      document.getElementById('statWorst').textContent   = '—';
    }

    // ── Result display ────────────────────────────────────────────────
    const rv = document.getElementById('resultValue');
    const rs = document.getElementById('resultStatus');
    const rd = document.getElementById('resultDesc');
    const pf = document.getElementById('progressFill');
    const rc = document.getElementById('resultCard');

    if (coefSum > 0) {
      const sem = total / coefSum;
      const cls = gradeClass(sem);
      rv.textContent = sem.toFixed(2);
      rv.className   = 'result-value ' + cls;
      pf.className   = 'progress-fill ' + cls;
      pf.style.width = (sem / 20 * 100) + '%';
      rc.className   = 'result-card ' + (sem >= 10 ? 'pass' : 'fail');

      if (sem >= 14) {
        rs.textContent = '🎉 Excellent';
        rs.className   = 'result-status success';
        rd.textContent = 'Outstanding — keep it up!';
      } else if (sem >= 10) {
        rs.textContent = '✓ Passed';
        rs.className   = 'result-status ' + cls;
        rd.textContent = sem >= 12 ? 'Good standing' : 'Just above the threshold';
      } else {
        rs.textContent = '✗ Failed';
        rs.className   = 'result-status fail';
        rd.textContent = 'Below 10 — retake required';
      }
    } else {
      rv.textContent = '—';
      rv.className   = 'result-value';
      rs.textContent = 'Awaiting input';
      rs.className   = 'result-status';
      rd.textContent = 'Fill in your scores above';
      pf.style.width = '0%';
      pf.className   = 'progress-fill';
      rc.className   = 'result-card';
    }
  }

  function resetAll() {
    document.querySelectorAll('input').forEach(i => { i.value = ''; i.classList.remove('invalid'); });
    document.querySelectorAll('.avg-pill').forEach(el => { el.textContent = '—'; el.className = 'avg-pill'; });
    document.getElementById('resultValue').textContent = '—';
    document.getElementById('resultValue').className = 'result-value';
    document.getElementById('resultStatus').textContent = 'Awaiting input';
    document.getElementById('resultStatus').className = 'result-status';
    document.getElementById('resultDesc').textContent = 'Fill in your scores above';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('progressFill').className = 'progress-fill';
    document.getElementById('resultCard').className = 'result-card';
    document.getElementById('statFilled').textContent = '0 / 8';
    document.getElementById('statPassing').textContent = '—';
    document.getElementById('statBest').textContent = '—';
    document.getElementById('statWorst').textContent = '—';
  }