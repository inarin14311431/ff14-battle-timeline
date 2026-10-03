param([Parameter(Mandatory=$true)][string]$InputPath,[Parameter(Mandatory=$true)][string]$OutputDir)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
  $voices = @($synth.GetInstalledVoices() | Where-Object { $_.Enabled -and $_.VoiceInfo.Culture.Name -eq 'ja-JP' })
  if ($voices.Count -eq 0) { throw 'Install a Japanese Windows speech voice first, or supply recorded audio files.' }
  $synth.SelectVoice($voices[0].VoiceInfo.Name)
  $synth.Rate = 0
  $items = Get-Content -LiteralPath $InputPath -Raw -Encoding UTF8 | ConvertFrom-Json
  foreach ($item in $items) {
    if ($item.id -notmatch '^[a-z0-9]+$') { throw 'Invalid audio ID' }
    $target = Join-Path $OutputDir ($item.id + '.wav')
    if (Test-Path -LiteralPath $target) { continue }
    $synth.SetOutputToWaveFile($target)
    $synth.Speak([string]$item.text)
    $synth.SetOutputToNull()
  }
} finally { $synth.Dispose() }
