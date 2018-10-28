import React from 'react';
import { timeDifferenceForDate } from '../utils'

export default ({
  text,
  createdAt,
  userName
}) => (
  <div>
    <p style={{ marginBottom: 0}}>{text}</p>
    <div className="f6 lh-copy gray">
      by{' '}
      {userName || 'Unknown'}{' '}
      {timeDifferenceForDate(createdAt)}
    </div>
  </div>
)