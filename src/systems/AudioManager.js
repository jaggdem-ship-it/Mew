export class AudioManager {
  constructor(scene) {
    this.scene = scene;
    this.ctx = scene.sound.context;
    this.master = this.ctx.createGain();
    this.master.connect(this.ctx.destination);
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.connect(this.master);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.connect(this.master);
    this.bgmNodes = [];
    this.bgmInterval = null;
    this.isPlaying = false;
    this.setVolumesFromSave();
  }

  setVolumesFromSave() {
    try {
      const raw = localStorage.getItem("sanctuary_survivors_save");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.settings) {
          this.master.gain.value = data.settings.master ?? 0.6;
          this.bgmGain.gain.value = data.settings.bgm ?? 0.5;
          this.sfxGain.gain.value = data.settings.sfx ?? 0.7;
        }
      }
    } catch (e) {}
  }

  createOsc(type, freq, duration, vol, detune = 0, target = "sfx") {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    if (detune) osc.detune.setValueAtTime(detune, this.ctx.currentTime);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(target === "bgm" ? this.bgmGain : this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
    return osc;
  }

  createPulse(freq, duration, vol) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const real = new Float32Array([0, 1, 0, 1/3, 0, 1/5, 0, 1/7]);
    const imag = new Float32Array(real.length);
    const wave = this.ctx.createPeriodicWave(real, imag);
    osc.setPeriodicWave(wave);
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  createNoise(duration, vol, filterFreq = 800, filterType = "lowpass") {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(filterFreq, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + duration);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    src.start();
  }

  playSfx(name) {
    const t = this.ctx.currentTime;
    switch (name) {
      case "shoot": this.createPulse(660, 0.06, 0.07); break;
      case "hit": this.createNoise(0.06, 0.1, 1200, "highpass"); this.createPulse(200, 0.1, 0.06); break;
      case "enemy_hit": this.createNoise(0.08, 0.08, 600); this.createPulse(150, 0.12, 0.05); break;
      case "enemy_death": this.createPulse(440, 0.15, 0.04); this.createPulse(220, 0.2, 0.04); this.createNoise(0.12, 0.06, 400); break;
      case "boss_hit": this.createNoise(0.15, 0.12, 200); this.createPulse(110, 0.3, 0.08); break;
      case "boss_roar": this.createPulse(80, 0.5, 0.1); this.createNoise(0.4, 0.08, 300); break;
      case "boss_death": this.createPulse(110, 0.6, 0.08); this.createPulse(55, 0.8, 0.06); this.createNoise(0.5, 0.1, 200); break;
      case "pickup_xp": this.createPulse(987, 0.05, 0.05); this.createPulse(1318, 0.1, 0.04); break;
      case "pickup_gold": this.createPulse(880, 0.05, 0.05); this.createPulse(1100, 0.08, 0.04); break;
      case "pickup_health": this.createOsc("sine", 523, 0.1, 0.05); this.createOsc("sine", 659, 0.1, 0.05, 0, "sfx"); this.createOsc("sine", 784, 0.2, 0.05, 0, "sfx"); break;
      case "level_up": this.createPulse(523, 0.08, 0.04); this.createPulse(659, 0.08, 0.04); this.createPulse(784, 0.08, 0.04); this.createPulse(1047, 0.3, 0.05); break;
      case "chest_open": this.createPulse(440, 0.1, 0.06); this.createPulse(554, 0.1, 0.06); this.createPulse(659, 0.15, 0.07); break;
      case "ui_click": this.createPulse(1760, 0.03, 0.03); break;
      case "ui_back": this.createPulse(880, 0.03, 0.03); break;
      case "explosion": this.createNoise(0.3, 0.15, 400); this.createPulse(100, 0.3, 0.08); break;
      case "fireball": this.createPulse(330, 0.15, 0.06); this.createNoise(0.1, 0.04, 800); break;
      case "ice_cast": this.createOsc("sine", 880, 0.2, 0.04); this.createOsc("sine", 1100, 0.2, 0.03); break;
      case "alert": this.createPulse(880, 0.1, 0.05); this.createPulse(880, 0.1, 0.05); break;
      case "dash": this.createNoise(0.1, 0.06, 2000, "highpass"); break;
      case "heavy_hit": this.createNoise(0.12, 0.15, 150); this.createPulse(100, 0.2, 0.08); break;
      case "wind": this.createNoise(0.5, 0.03, 400, "bandpass"); break;
      case "drip": this.createPulse(2000, 0.02, 0.02); break;
    }
  }

  playBGM(bpm = 120, scale = [0, 2, 4, 5, 7, 9, 11], baseFreq = 220, intensity = 1) {
    if (this.isPlaying) this.stopBGM();
    const beat = 60 / bpm;
    const patternLen = 16;
    const melody = [];
    const bassline = [];
    for (let i = 0; i < patternLen; i++) {
      melody.push(Math.random() > 0.35 ? scale[Math.floor(Math.random() * scale.length)] : null);
      bassline.push(i % 4 === 0 ? scale[0] : (i % 4 === 2 ? scale[2] : null));
    }
    const playPattern = () => {
      const t = this.ctx.currentTime;
      for (let i = 0; i < patternLen; i++) {
        const stepT = t + i * beat * 0.5;
        const note = melody[i];
        if (note !== null) {
          const f = baseFreq * Math.pow(2, note / 12);
          this.schedulePulse(stepT, f, beat * 0.35, 0.02 * intensity);
          if (i % 2 === 0) this.scheduleTriangle(stepT, f / 2, beat * 0.8, 0.03 * intensity);
          if (i % 4 === 0) this.schedulePulse(stepT + 0.05, f * 2, beat * 0.2, 0.012 * intensity);
        }
        const bass = bassline[i];
        if (bass !== null) {
          const bf = (baseFreq / 2) * Math.pow(2, bass / 12);
          this.scheduleTriangle(stepT, bf, beat, 0.04 * intensity);
        }
        if (i % 4 === 0) this.scheduleNoiseHit(stepT, 0.08, 0.07 * intensity, 3000);
        else if (i % 4 === 2) this.scheduleNoiseHit(stepT, 0.06, 0.05 * intensity, 6000);
        else this.scheduleNoiseHit(stepT, 0.02, 0.015 * intensity, 8000);
      }
    };
    playPattern();
    this.bgmInterval = setInterval(playPattern, patternLen * beat * 0.5 * 1000);
    this.isPlaying = true;
  }

  schedulePulse(t, freq, dur, vol) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const real = new Float32Array([0, 1, 0, 1/3, 0, 1/5]);
    const imag = new Float32Array(real.length);
    const wave = this.ctx.createPeriodicWave(real, imag);
    osc.setPeriodicWave(wave);
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(this.bgmGain);
    osc.start(t);
    osc.stop(t + dur);
    this.bgmNodes.push(osc);
  }

  scheduleTriangle(t, freq, dur, vol) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(this.bgmGain);
    osc.start(t);
    osc.stop(t + dur);
    this.bgmNodes.push(osc);
  }

  scheduleNoiseHit(t, dur, vol, filterFreq) {
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(filterFreq, t);
    filter.Q.setValueAtTime(1, t);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);
    src.start(t);
    this.bgmNodes.push(src);
  }

  stopBGM() {
    if (this.bgmInterval) { clearInterval(this.bgmInterval); this.bgmInterval = null; }
    this.bgmNodes.forEach(n => { try { n.stop(); } catch(e) {} });
    this.bgmNodes = [];
    this.isPlaying = false;
  }

  setMaster(v) { this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1); }
  setBGM(v) { this.bgmGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1); }
  setSFX(v) { this.sfxGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1); }
}
