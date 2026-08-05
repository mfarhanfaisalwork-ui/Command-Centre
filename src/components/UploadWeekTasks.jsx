import { useRef, useState } from 'react'
import { parseWeekCsv } from '../lib/scheduler'
import { uploadWeekTasks } from '../lib/weekTasks'
import { UploadIcon, CheckIcon } from './Icons'

const BUSINESS_LABEL = { nifar: 'NIFAR', nifarise: 'Nifarise', merged: 'Both' }

const SAMPLE = `Task Name, Business, Estimated Hours, Deadline, Notes
Write 3 IG captions, Nifarise, 1, Wednesday, keep tone casual
Design product thumbnail, NIFAR, 2, Friday,`

/**
 * @param {object[]} existingOpenTasks - all not-done weekTasks currently in Firestore
 */
export default function UploadWeekTasks({ existingOpenTasks }) {
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState(null)
  const [fileName, setFileName] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setError('')
    setDone(null)
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = parseWeekCsv(String(reader.result))
        if (parsed.length === 0) {
          setError('No task rows found in that file.')
          setRows(null)
        } else {
          setRows(parsed)
        }
      } catch {
        setError('Could not read that file as CSV.')
        setRows(null)
      }
    }
    reader.readAsText(file)
  }

  async function handleConfirm() {
    if (!rows?.length) return
    setSaving(true)
    setError('')
    try {
      const count = await uploadWeekTasks(rows, existingOpenTasks)
      setDone(count)
      setRows(null)
      setFileName('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch {
      setError('Upload failed — check your Firestore connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  function reset() {
    setOpen(false)
    setRows(null)
    setFileName('')
    setError('')
    setDone(null)
  }

  if (!open) {
    return (
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        <UploadIcon width={14} height={14} /> Add week's tasks
      </button>
    )
  }

  return (
    <div className="upload-panel">
      <div className="upload-panel-head">
        <div>
          <div className="upload-panel-title">Upload this week's tasks</div>
          <div className="upload-panel-hint">
            CSV with columns: Task Name, Business, Estimated Hours, Deadline, Notes. Deadline can be a day
            name (e.g. "Friday") or a date.
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={reset}>
          Close
        </button>
      </div>

      {done !== null ? (
        <div className="upload-success">
          <span className="icon-chip icon-chip-mixed">
            <CheckIcon width={15} height={15} />
          </span>
          {done} task{done === 1 ? '' : 's'} scheduled across the week. The auto-scheduler already slotted
          them onto days based on deadline + workload.
        </div>
      ) : (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFile}
            className="upload-file-input"
          />
          {fileName && <div className="upload-file-name">{fileName}</div>}
          {error && <div className="upload-error">{error}</div>}

          {rows && (
            <div className="upload-preview-wrap">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Business</th>
                    <th>Hrs</th>
                    <th>Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td>{r.title}</td>
                      <td>
                        <span className="badge badge-platform">{BUSINESS_LABEL[r.business]}</span>
                      </td>
                      <td>{r.estimatedHours}</td>
                      <td>{r.deadlineRaw || 'this week'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn btn-primary btn-block" onClick={handleConfirm} disabled={saving}>
                {saving ? 'Scheduling…' : `Confirm & schedule ${rows.length} task${rows.length === 1 ? '' : 's'}`}
              </button>
            </div>
          )}

          {!rows && (
            <details className="upload-sample">
              <summary>See a sample CSV</summary>
              <pre>{SAMPLE}</pre>
            </details>
          )}
        </>
      )}
    </div>
  )
}
