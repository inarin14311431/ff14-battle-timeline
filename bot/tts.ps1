param([Parameter(Mandatory=$true)][string]$InputPath,[Parameter(Mandatory=$true)][string]$OutputDir,[switch]$Force)
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
    if ((Test-Path -LiteralPath $target) -and -not $Force) { continue }
    $temporary = Join-Path $OutputDir ($item.id + '.' + [guid]::NewGuid().ToString('N') + '.tmp.wav')
    try {
      $synth.SetOutputToWaveFile($temporary)
      $synth.Speak([string]$item.text)
      $synth.SetOutputToNull()
      Move-Item -LiteralPath $temporary -Destination $target -Force
    } finally {
      $synth.SetOutputToNull()
      if (Test-Path -LiteralPath $temporary) { Remove-Item -LiteralPath $temporary }
    }
  }
} finally { $synth.Dispose() }
