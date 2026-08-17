// 演習ラボの実行クライアント。利用者のコードは必ずWorker内で動かし、
// 無限ループ対策として制限時間を超えたらWorkerを強制終了する。

const RUNNER_URL = '/lab-runner.js'
export const LAB_RUN_TIMEOUT_MS = 2000

export function runLabExercise({ code, functionName, cases }, timeoutMs = LAB_RUN_TIMEOUT_MS) {
  return new Promise((resolve) => {
    let worker
    try {
      worker = new Worker(RUNNER_URL)
    } catch (error) {
      resolve({ logs: [], cases: [], error: `実行環境を起動できませんでした: ${error.message}`, timedOut: false })
      return
    }

    let settled = false
    const finish = (result) => {
      if (settled) return
      settled = true
      window.clearTimeout(timerId)
      worker.terminate()
      resolve(result)
    }

    const timerId = window.setTimeout(() => {
      finish({
        logs: [],
        cases: [],
        error: `${timeoutMs}ミリ秒以内に終了しませんでした。無限ループになっていないか確認してください。`,
        timedOut: true,
      })
    }, timeoutMs)

    worker.onmessage = (event) => {
      const data = event.data || {}
      finish({ logs: data.logs || [], cases: data.cases || [], error: data.error || null, timedOut: false })
    }

    worker.onerror = (event) => {
      finish({
        logs: [],
        cases: [],
        error: `実行中にエラーが発生しました: ${event.message || '詳細不明'}`,
        timedOut: false,
      })
    }

    worker.postMessage({ type: 'run', code, functionName, cases })
  })
}

export function summarizeLabResult(result) {
  const total = result.cases.length
  const passed = result.cases.filter((testCase) => testCase.passed).length
  return { total, passed, allPassed: total > 0 && passed === total }
}
