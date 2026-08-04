import { useState } from 'react'
import { addSocialStat, deleteSocialStat } from '../lib/socialStats'

/**
 * @param {object[]} entries - already filtered to this business, newest first
 * @param {string} business - 'nifar' or 'nifarise'
 * @param {string[]} platforms - dropdown options for this business
 */
export default function SocialStats({ entries, business, platforms }) {
  const [open, setOpen] = useState(false)
  const [platform, setPlatform] = useState(platforms[0])
  const [postName, setPostName] = useState('')
  const [views, setViews] = useState('')
  const [shares, setShares] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!postName.trim()) return
    setSaving(true)
    await addSocialStat({
      business,
      platform,
      postName: postName.trim(),
      views,
      shares,
    })
    setPostName('')
    setViews('')
    setShares('')
    setPlatform(platforms[0])
    setSaving(false)
    setOpen(false)
  }

  async function handleDelete(id, name) {
    if (confirm(`Delete stats for "${name}"?`)) {
      await deleteSocialStat(id)
    }
  }

  return (
    <div className="social-stats">
      <div className="section-header">
        <h2>Social stats</h2>
        {!open && (
          <button className="btn btn-outline btn-sm" onClick={() => setOpen(true)}>
            + Log post
          </button>
        )}
      </div>

      {open && (
        <form className="stats-form" onSubmit={handleSubmit}>
          <select className="input" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Post name / title"
            value={postName}
            onChange={(e) => setPostName(e.target.value)}
            autoFocus
          />
          <input
            className="input"
            type="number"
            min="0"
            placeholder="Views"
            value={views}
            onChange={(e) => setViews(e.target.value)}
          />
          <input
            className="input"
            type="number"
            min="0"
            placeholder="Shares"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
          />
          <div className="task-card-actions">
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving || !postName.trim()}>
              Save
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {entries.length === 0 ? (
        <div className="empty-hint">No posts logged yet</div>
      ) : (
        <div className="stats-table-wrap">
          <table className="stats-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Post</th>
                <th>Views</th>
                <th>Shares</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <span className="badge badge-platform">{entry.platform}</span>
                  </td>
                  <td>{entry.postName}</td>
                  <td>{entry.views.toLocaleString()}</td>
                  <td>{entry.shares.toLocaleString()}</td>
                  <td>
                    <button
                      className="icon-btn icon-btn-danger"
                      title="Delete"
                      onClick={() => handleDelete(entry.id, entry.postName)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
