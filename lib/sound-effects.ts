// 声音效果管理
export class SoundEffects {
  private audioContext: AudioContext | null = null
  private enabled: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext || !this.enabled) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  // 正确答案
  playCorrect() {
    this.playTone(523.25, 0.15) // C5
    setTimeout(() => this.playTone(659.25, 0.15), 100) // E5
    setTimeout(() => this.playTone(783.99, 0.3), 200) // G5
  }

  // 错误答案
  playWrong() {
    this.playTone(196, 0.2, 'square') // G3
    setTimeout(() => this.playTone(174.61, 0.3, 'square'), 100) // F3
  }

  // 移动棋子
  playMove() {
    this.playTone(440, 0.1) // A4
  }

  // 选择棋子
  playSelect() {
    this.playTone(523.25, 0.08) // C5
  }

  // 完成关卡
  playLevelComplete() {
    const melody = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    melody.forEach((freq, index) => {
      setTimeout(() => this.playTone(freq, 0.2), index * 150)
    })
  }

  // 升级
  playLevelUp() {
    const melody = [392, 523.25, 659.25, 783.99, 1046.50] // G4, C5, E5, G5, C6
    melody.forEach((freq, index) => {
      setTimeout(() => this.playTone(freq, 0.25), index * 200)
    })
  }

  // 成就解锁
  playAchievement() {
    const melody = [783.99, 1046.50, 1318.51, 1567.98] // G5, C6, E6, G6
    melody.forEach((freq, index) => {
      setTimeout(() => this.playTone(freq, 0.15), index * 120)
    })
  }

  // 按钮点击
  playClick() {
    this.playTone(880, 0.05) // A5
  }

  // 获取成就
  playGetReward() {
    this.playAchievement()
  }

  // 启用/禁用声音
  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  // 检查是否启用
  isEnabled(): boolean {
    return this.enabled
  }
}

// 导出单例
export const soundEffects = new SoundEffects()
