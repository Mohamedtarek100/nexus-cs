// Web Audio API Synthesizer for UI sound effects and focus ambient sounds

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.ambientNodes = null;
    this.soundEnabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound(enabled) {
    this.soundEnabled = enabled;
  }

  playClick() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      console.error(e);
    }
  }

  playSuccess() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch (e) {
      console.error(e);
    }
  }

  playError() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {
      console.error(e);
    }
  }

  startAmbient(type = 'cyber-drone') {
    this.stopAmbient();
    try {
      this.init();
      if (!this.ctx) return;

      if (type === 'binaural-gamma') {
        // 40Hz difference for deep focus / gamma waves
        const leftOsc = this.ctx.createOscillator();
        const rightOsc = this.ctx.createOscillator();
        const merger = this.ctx.createChannelMerger(2);
        const gain = this.ctx.createGain();

        leftOsc.type = 'sine';
        rightOsc.type = 'sine';
        leftOsc.frequency.setValueAtTime(200, this.ctx.currentTime);
        rightOsc.frequency.setValueAtTime(240, this.ctx.currentTime); // 40Hz delta

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        leftOsc.connect(merger, 0, 0);
        rightOsc.connect(merger, 0, 1);
        merger.connect(gain);
        gain.connect(this.ctx.destination);

        leftOsc.start();
        rightOsc.start();
        this.ambientNodes = { nodes: [leftOsc, rightOsc, merger, gain] };
      } else if (type === 'cyber-rain') {
        // Synthesized pink/brown noise
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99 * b0 + white * 0.05;
          b1 = 0.95 * b1 + white * 0.1;
          b2 = 0.85 * b2 + white * 0.2;
          output[i] = (b0 + b1 + b2) * 0.15;
        }
        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        whiteNoise.start();
        this.ambientNodes = { nodes: [whiteNoise, filter, gain] };
      } else {
        // Deep Space Cyber Drone
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(110, this.ctx.currentTime);
        osc2.frequency.setValueAtTime(110.5, this.ctx.currentTime); // gentle detune beat

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(250, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start();
        osc2.start();
        this.ambientNodes = { nodes: [osc1, osc2, filter, gain] };
      }
    } catch (e) {
      console.error(e);
    }
  }

  stopAmbient() {
    if (this.ambientNodes) {
      try {
        this.ambientNodes.nodes.forEach(n => {
          if (n.stop) n.stop();
          if (n.disconnect) n.disconnect();
        });
      } catch (e) {
        // ignore
      }
      this.ambientNodes = null;
    }
  }
}

export const sound = new SoundEngine();
